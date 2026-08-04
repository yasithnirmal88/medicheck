from __future__ import annotations

from datetime import date, datetime
from typing import Optional

from fastapi import APIRouter, Depends, File, UploadFile, HTTPException
from sqlalchemy import select, func, delete
from sqlalchemy.ext.asyncio import AsyncSession

from app.infrastructure.persistence.models.lab_report import LabReportModel
from app.infrastructure.persistence.models.base import BaseModel
from app.infrastructure.persistence.database import get_db
from app.api.v1.deps import get_current_active_user
from app.domain.entities.user import User

router = APIRouter(prefix="/api/v1/lab-results", tags=["lab-results"])


# ── Request/Response shapes ──────────────────────────────────────────────────

class AddLabReportRequest:
    pass


# ── CRUD Endpoints ───────────────────────────────────────────────────────────

@router.get("")
async def list_lab_reports(
    current_user: User = Depends(get_current_active_user),
    session: AsyncSession = Depends(get_db),
):
    profile_id = await _get_profile_id(session, current_user.id)
    if not profile_id:
        return []

    q = (
        select(LabReportModel)
        .where(LabReportModel.profile_id == profile_id)
        .order_by(LabReportModel.date.desc(), LabReportModel.created_at.desc())
    )
    result = await session.execute(q)
    records = result.scalars().all()
    return [_record_to_dict(r) for r in records]


@router.post("")
async def add_lab_report(
    payload: dict,
    current_user: User = Depends(get_current_active_user),
    session: AsyncSession = Depends(get_db),
):
    profile_id = await _get_or_create_profile_id(session, current_user.id)

    record = LabReportModel(
        profile_id=profile_id,
        test_name=payload.get("test_name", "Untitled Test"),
        value=payload.get("value"),
        unit=payload.get("unit"),
        reference_range=payload.get("reference_range"),
        laboratory=payload.get("laboratory"),
        date=payload.get("date"),
        notes=payload.get("notes"),
    )
    session.add(record)
    await session.commit()
    await session.refresh(record)
    return _record_to_dict(record)


@router.post("/upload")
async def upload_lab_report(
    file: UploadFile = File(...),
    test_name: Optional[str] = None,
    laboratory: Optional[str] = None,
    notes: Optional[str] = None,
    current_user: User = Depends(get_current_active_user),
    session: AsyncSession = Depends(get_db),
):
    profile_id = await _get_or_create_profile_id(session, current_user.id)

    content = await file.read()
    filename = file.filename or "uploaded_report"
    import re
    clean_name = re.sub(r'[-_]+', ' ', re.sub(r'\.[^.]+$', '', filename)).strip()

    record = LabReportModel(
        profile_id=profile_id,
        test_name=test_name or clean_name or "Uploaded Report",
        laboratory=laboratory or "Uploaded Report",
        date=date.today().isoformat(),
        notes=notes or f"Uploaded file: {filename} ({len(content)} bytes). Awaiting manual entry or OCR extraction.",
    )
    session.add(record)
    await session.commit()
    await session.refresh(record)
    return _record_to_dict(record)


@router.delete("/{report_id}")
async def delete_lab_report(
    report_id: str,
    current_user: User = Depends(get_current_active_user),
    session: AsyncSession = Depends(get_db),
):
    profile_id = await _get_profile_id(session, current_user.id)
    if not profile_id:
        raise HTTPException(status_code=404, detail="Profile not found")

    q = select(LabReportModel).where(
        LabReportModel.id == report_id,
        LabReportModel.profile_id == profile_id,
    )
    result = await session.execute(q)
    record = result.scalars().first()
    if not record:
        raise HTTPException(status_code=404, detail="Lab report not found")

    await session.delete(record)
    await session.commit()
    return {"ok": True}


# ── Analysis Endpoints ───────────────────────────────────────────────────────

@router.get("/analysis")
async def get_lab_analysis(
    current_user: User = Depends(get_current_active_user),
    session: AsyncSession = Depends(get_db),
):
    """Return full lab analysis: tests, trends, interpretation, critical findings, health impacts, recommendations."""
    profile_id = await _get_profile_id(session, current_user.id)
    if not profile_id:
        return _empty_analysis()

    q = (
        select(LabReportModel)
        .where(LabReportModel.profile_id == profile_id)
        .order_by(LabReportModel.date.desc())
    )
    result = await session.execute(q)
    records = result.scalars().all()

    if not records:
        return _empty_analysis()

    tests = _build_tests_from_records(records)
    trends = _compute_trends(records)
    interpretation = _generate_interpretation(tests)
    critical_findings = _detect_critical_findings(tests)
    health_impacts = _compute_health_impacts(tests)
    recommendations = _generate_recommendations(tests, critical_findings)
    timeline_events = _build_timeline(records)
    comparison = _build_comparison(records)

    return {
        "tests": tests,
        "trends": trends,
        "interpretation": interpretation,
        "criticalFindings": critical_findings,
        "healthImpacts": health_impacts,
        "recommendations": recommendations,
        "timelineEvents": timeline_events,
        "comparison": comparison,
        "totalReports": len(set(r.date.isoformat() for r in records if r.date)),
        "totalTests": len(tests),
        "abnormalCount": sum(1 for t in tests if t["status"] != "normal"),
        "criticalCount": sum(1 for t in tests if t["status"] == "critical"),
    }


@router.get("/trends/{test_name}")
async def get_test_trends(
    test_name: str,
    current_user: User = Depends(get_current_active_user),
    session: AsyncSession = Depends(get_db),
):
    """Return historical trend data for a specific test name."""
    profile_id = await _get_profile_id(session, current_user.id)
    if not profile_id:
        return {"testName": test_name, "dataPoints": []}

    q = (
        select(LabReportModel)
        .where(
            LabReportModel.profile_id == profile_id,
            LabReportModel.test_name.ilike(f"%{test_name}%"),
        )
        .order_by(LabReportModel.date.asc())
    )
    result = await session.execute(q)
    records = result.scalars().all()

    data_points = []
    for r in records:
        if r.value is not None and r.date:
            ref = _parse_reference(r.reference_range)
            data_points.append({
                "date": r.date.isoformat(),
                "value": r.value,
                "referenceLow": ref.get("low", 0),
                "referenceHigh": ref.get("high", 0),
            })

    return {"testName": test_name, "dataPoints": data_points}


# ── Helper functions ─────────────────────────────────────────────────────────

async def _get_profile_id(session: AsyncSession, user_id: str) -> str | None:
    from app.infrastructure.persistence.models.health_profile import HealthProfileModel
    q = select(HealthProfileModel.id).where(HealthProfileModel.user_id == user_id)
    result = await session.execute(q)
    return result.scalars().first()


async def _get_or_create_profile_id(session: AsyncSession, user_id: str) -> str:
    from app.infrastructure.persistence.models.health_profile import HealthProfileModel
    pid = await _get_profile_id(session, user_id)
    if pid:
        return pid
    profile = HealthProfileModel(user_id=user_id, draft=1)
    session.add(profile)
    await session.commit()
    await session.refresh(profile)
    return profile.id


def _record_to_dict(r: LabReportModel) -> dict:
    return {
        "id": r.id,
        "profile_id": r.profile_id,
        "test_name": r.test_name,
        "value": r.value,
        "unit": r.unit,
        "reference_range": r.reference_range,
        "laboratory": r.laboratory,
        "date": r.date.isoformat() if r.date else None,
        "notes": r.notes,
        "created_at": r.created_at.isoformat() if r.created_at else None,
    }


def _parse_reference(range_str: str | None) -> dict:
    if not range_str:
        return {}
    import re
    pair = re.search(r"(\d+(?:\.\d+)?)\s*(?:-|–|—|to)\s*(\d+(?:\.\d+)?)", range_str, re.I)
    if pair:
        return {"low": float(pair.group(1)), "high": float(pair.group(2))}
    single = re.search(r"([<>])\s*(\d+(?:\.\d+)?)", range_str)
    if single:
        num = float(single.group(2))
        return {"high": num} if single.group(1) == "<" else {"low": num}
    return {}


def _derive_status(value: float | None, ref: dict) -> str:
    if value is None:
        return "normal"
    low = ref.get("low")
    high = ref.get("high")
    if low is not None and high is not None:
        if value < low * 0.5 or value > high * 2:
            return "critical"
        if value < low or value > high:
            return "high" if value > high else "low"
    return "normal"


# ── Knowledge graph: known reference ranges for common tests ─────────────────

TEST_RANGES: dict[str, dict] = {
    "white blood cell count": {"low": 4.5, "high": 11.0, "unit": "K/uL", "category": "cbc"},
    "hemoglobin": {"low": 13.5, "high": 17.5, "unit": "g/dL", "category": "cbc"},
    "hematocrit": {"low": 38.3, "high": 48.6, "unit": "%", "category": "cbc"},
    "platelet count": {"low": 150, "high": 400, "unit": "K/uL", "category": "cbc"},
    "glucose": {"low": 70, "high": 100, "unit": "mg/dL", "category": "chemistry"},
    "fasting glucose": {"low": 70, "high": 100, "unit": "mg/dL", "category": "chemistry"},
    "bun": {"low": 7, "high": 20, "unit": "mg/dL", "category": "kidney"},
    "creatinine": {"low": 0.7, "high": 1.3, "unit": "mg/dL", "category": "kidney"},
    "total cholesterol": {"low": 0, "high": 200, "unit": "mg/dL", "category": "lipid"},
    "ldl": {"low": 0, "high": 100, "unit": "mg/dL", "category": "lipid"},
    "hdl": {"low": 40, "high": 999, "unit": "mg/dL", "category": "lipid"},
    "triglycerides": {"low": 0, "high": 150, "unit": "mg/dL", "category": "lipid"},
    "alt": {"low": 7, "high": 56, "unit": "U/L", "category": "liver"},
    "ast": {"low": 10, "high": 40, "unit": "U/L", "category": "liver"},
    "tsh": {"low": 0.4, "high": 4.0, "unit": "mIU/L", "category": "thyroid"},
    "vitamin d": {"low": 30, "high": 100, "unit": "ng/mL", "category": "vitamins"},
    "crp": {"low": 0, "high": 3.0, "unit": "mg/L", "category": "inflammation"},
    "esr": {"low": 0, "high": 22, "unit": "mm/hr", "category": "inflammation"},
}


def _build_tests_from_records(records: list[LabReportModel]) -> list[dict]:
    test_map: dict[str, dict] = {}
    for r in records:
        key = r.test_name.lower().strip()
        ref = _parse_reference(r.reference_range)
        known = TEST_RANGES.get(key, {})
        low = ref.get("low") or known.get("low", 0)
        high = ref.get("high") or known.get("high", 0)
        category = known.get("category", "blood_chemistry")

        if key not in test_map:
            test_map[key] = {
                "id": r.id,
                "name": r.test_name,
                "category": category,
                "value": r.value,
                "unit": r.unit or known.get("unit", ""),
                "referenceRange": r.reference_range or f"{low} - {high}",
                "referenceLow": low,
                "referenceHigh": high,
                "status": _derive_status(r.value, {"low": low, "high": high}),
                "trend": "new",
                "lastDate": r.date.isoformat() if r.date else None,
                "trendData": [],
            }
        else:
            existing = test_map[key]
            if r.value is not None and r.date:
                existing["trendData"].append({
                    "date": r.date.isoformat(),
                    "value": r.value,
                    "referenceLow": existing["referenceLow"],
                    "referenceHigh": existing["referenceHigh"],
                })
                if r.value != existing["value"]:
                    prev = existing["value"]
                    if prev is not None and r.value is not None:
                        if r.value > prev:
                            existing["trend"] = "worsening" if existing["status"] != "normal" else "improving"
                        elif r.value < prev:
                            existing["trend"] = "improving" if existing["status"] != "normal" else "worsening"
                        else:
                            existing["trend"] = "stable"

    return list(test_map.values())


def _compute_trends(records: list[LabReportModel]) -> list[dict]:
    grouped: dict[str, list[LabReportModel]] = {}
    for r in records:
        key = r.test_name.lower().strip()
        grouped.setdefault(key, []).append(r)

    trends = []
    for test_name, group in grouped.items():
        sorted_group = sorted(group, key=lambda x: x.date or date.min)
        if len(sorted_group) < 2:
            continue

        values = [r.value for r in sorted_group if r.value is not None]
        dates = [r.date.isoformat() for r in sorted_group if r.date and r.value is not None]

        if len(values) < 2:
            continue

        direction = "stable"
        if values[-1] > values[0] * 1.05:
            direction = "increasing"
        elif values[-1] < values[0] * 0.95:
            direction = "decreasing"

        ref = _parse_reference(sorted_group[0].reference_range)
        trends.append({
            "testName": sorted_group[0].test_name,
            "direction": direction,
            "firstValue": values[0],
            "lastValue": values[-1],
            "changePercent": round(((values[-1] - values[0]) / values[0]) * 100, 1) if values[0] else 0,
            "dataPoints": [
                {
                    "date": d,
                    "value": v,
                    "referenceLow": ref.get("low", 0),
                    "referenceHigh": ref.get("high", 0),
                }
                for d, v in zip(dates, values)
            ],
        })

    return trends


def _generate_interpretation(tests: list[dict]) -> dict:
    abnormal = [t for t in tests if t["status"] != "normal"]
    critical = [t for t in tests if t["status"] == "critical"]
    normal = [t for t in tests if t["status"] == "normal"]

    risks = []
    positive = []

    for t in critical:
        risks.append({
            "title": f"Critical: {t['name']}",
            "description": f"{t['name']} is critically {'high' if t['status'] == 'high' else 'low'} at {t['value']} {t['unit']}.",
            "severity": "critical",
            "tests": [t["name"]],
        })

    for t in abnormal:
        if t["status"] not in ("critical",):
            risks.append({
                "title": f"Elevated: {t['name']}",
                "description": f"{t['name']} is outside normal range at {t['value']} {t['unit']}.",
                "severity": "warning",
                "tests": [t["name"]],
            })

    for t in normal:
        positive.append({
            "title": f"Normal: {t['name']}",
            "description": f"{t['name']} is within normal range.",
            "tests": [t["name"]],
        })

    confidence = max(50, min(98, 70 + len(normal) * 2 - len(critical) * 10))

    return {
        "summary": f"Analysis of {len(tests)} laboratory tests reveals {len(abnormal)} abnormal result{'s' if len(abnormal) != 1 else ''} and {len(critical)} critical finding{'s' if len(critical) != 1 else ''}. {len(normal)} test{'s' if len(normal) != 1 else ''} are within normal range.",
        "confidenceScore": confidence,
        "risks": risks,
        "positiveFindings": positive,
        "areasRequiringAttention": [{"area": r["title"], "reason": r["description"]} for r in risks[:5]],
    }


def _detect_critical_findings(tests: list[dict]) -> list[dict]:
    findings = []
    for t in tests:
        if t["status"] == "critical":
            findings.append({
                "id": f"cf-{t['id']}",
                "title": f"Critical: {t['name']}",
                "description": f"{t['name']} value of {t['value']} {t['unit']} is critically outside the reference range ({t['referenceRange']}).",
                "severity": "critical",
                "urgency": "immediate",
                "testName": t["name"],
                "value": t["value"],
                "referenceRange": t["referenceRange"],
                "recommendedAction": f"Consult your healthcare provider immediately regarding {t['name']}.",
            })
        elif t["status"] in ("high", "low"):
            findings.append({
                "id": f"cf-{t['id']}",
                "title": f"Abnormal: {t['name']}",
                "description": f"{t['name']} value of {t['value']} {t['unit']} is outside the reference range ({t['referenceRange']}).",
                "severity": "warning",
                "urgency": "soon",
                "testName": t["name"],
                "value": t["value"],
                "referenceRange": t["referenceRange"],
                "recommendedAction": f"Discuss {t['name']} results with your doctor at your next visit.",
            })
    return findings


def _compute_health_impacts(tests: list[dict]) -> list[dict]:
    category_map: dict[str, list[dict]] = {}
    for t in tests:
        cat = t.get("category", "other")
        category_map.setdefault(cat, []).append(t)

    category_labels = {
        "cbc": "Blood Health",
        "chemistry": "Metabolic Health",
        "lipid": "Cardiovascular Health",
        "kidney": "Kidney Function",
        "liver": "Liver Function",
        "thyroid": "Thyroid Function",
        "inflammation": "Inflammation",
        "vitamins": "Nutritional Status",
        "blood_chemistry": "Blood Chemistry",
    }

    impacts = []
    for cat, cat_tests in category_map.items():
        abnormal = [t for t in cat_tests if t["status"] != "normal"]
        normal = [t for t in cat_tests if t["status"] == "normal"]
        confidence = round((len(normal) / len(cat_tests)) * 100) if cat_tests else 0

        impacts.append({
            "id": f"impact-{cat}",
            "area": category_labels.get(cat, cat.replace("_", " ").title()),
            "category": cat,
            "confidence": confidence,
            "status": "normal" if not abnormal else abnormal[0]["status"],
            "tests": [t["name"] for t in cat_tests],
            "abnormalCount": len(abnormal),
            "totalTests": len(cat_tests),
        })

    return impacts


def _generate_recommendations(tests: list[dict], critical_findings: list[dict]) -> list[dict]:
    recs = []
    priority_counter = 1

    for cf in critical_findings:
        recs.append({
            "id": f"rec-{cf['id']}",
            "title": cf["recommendedAction"],
            "description": cf["description"],
            "priority": "critical" if cf["severity"] == "critical" else "high",
            "category": "clinical",
            "evidence": "Based on laboratory reference ranges",
            "testName": cf.get("testName", ""),
        })
        priority_counter += 1

    abnormal = [t for t in tests if t["status"] != "normal" and t["status"] != "critical"]
    for t in abnormal[:5]:
        recs.append({
            "id": f"rec-{t['id']}",
            "title": f"Monitor {t['name']}",
            "description": f"{t['name']} is outside normal range. Consider follow-up testing.",
            "priority": "medium",
            "category": "monitoring",
            "evidence": "Based on laboratory reference ranges",
            "testName": t["name"],
        })

    if not recs:
        recs.append({
            "id": "rec-general",
            "title": "Continue regular health monitoring",
            "description": "All laboratory results are within normal range. Continue regular check-ups.",
            "priority": "low",
            "category": "prevention",
            "evidence": "Based on overall lab results",
            "testName": "",
        })

    return recs


def _build_timeline(records: list[LabReportModel]) -> list[dict]:
    events = []
    for r in sorted(records, key=lambda x: x.date or date.min, reverse=True)[:20]:
        ref = _parse_reference(r.reference_range)
        status = _derive_status(r.value, ref)
        events.append({
            "id": f"evt-{r.id}",
            "date": r.date.isoformat() if r.date else "Unknown",
            "type": "laboratory_uploaded",
            "title": r.test_name,
            "description": f"{r.value} {r.unit or ''}" if r.value else "Report uploaded",
            "status": status,
            "laboratory": r.laboratory,
        })
    return events


def _build_comparison(records: list[LabReportModel]) -> list[dict]:
    by_date: dict[str, list[LabReportModel]] = {}
    for r in records:
        if r.date:
            by_date.setdefault(r.date.isoformat(), []).append(r)

    dates = sorted(by_date.keys(), reverse=True)
    if len(dates) < 2:
        return []

    current = {r.test_name.lower(): r for r in by_date[dates[0]]}
    previous = {r.test_name.lower(): r for r in by_date[dates[1]]}

    items = []
    for name in set(list(current.keys()) + list(previous.keys())):
        curr = current.get(name)
        prev = previous.get(name)
        items.append({
            "testName": curr.test_name if curr else prev.test_name if prev else name,
            "currentValue": curr.value if curr else None,
            "previousValue": prev.value if prev else None,
            "currentDate": dates[0],
            "previousDate": dates[1],
            "change": round(curr.value - prev.value, 2) if curr and prev and curr.value and prev.value else None,
            "changePercent": round(((curr.value - prev.value) / prev.value) * 100, 1) if curr and prev and curr.value and prev.value and prev.value else None,
        })

    return items


def _empty_analysis() -> dict:
    return {
        "tests": [],
        "trends": [],
        "interpretation": {
            "summary": "No laboratory data available. Upload a report to get started.",
            "confidenceScore": 0,
            "risks": [],
            "positiveFindings": [],
            "areasRequiringAttention": [],
        },
        "criticalFindings": [],
        "healthImpacts": [],
        "recommendations": [],
        "timelineEvents": [],
        "comparison": [],
        "totalReports": 0,
        "totalTests": 0,
        "abnormalCount": 0,
        "criticalCount": 0,
    }
