"""Phase 3 AI-engine behavior tests.

Covers:
1. Report generation auto-runs the clinical decision engine (CDSE) when no
   decision result exists yet, completing the questionnaire -> report flow.
2. Disease probability scoring + screening generation in the CDSE output.
3. Adaptive questionnaire branching via authored branch rules.
"""

import pytest
from sqlalchemy.ext.asyncio import AsyncSession

from app.application.services.clinical_decision_service import ClinicalDecisionService
from app.application.services.questionnaire_service import QuestionnaireService
from app.application.services.report_service import ReportService
from app.infrastructure.persistence.models.assessment_answer import (
    AssessmentAnswerModel,
)
from app.infrastructure.persistence.models.assessment_session import (
    AssessmentSessionModel,
)
from app.infrastructure.persistence.models.body_system import BodySystemModel
from app.infrastructure.persistence.models.branch_rule import BranchRuleModel
from app.infrastructure.persistence.models.clinical_indicator import (
    ClinicalIndicatorModel,
)
from app.infrastructure.persistence.models.question import QuestionModel
from app.infrastructure.persistence.models.question_group import QuestionGroupModel
from app.infrastructure.persistence.models.question_option import QuestionOptionModel
from app.infrastructure.persistence.repositories.sql_knowledge_graph_repository import (
    SQLKnowledgeGraphRepository,
)


async def _seed_cdse_flow(db_session: AsyncSession, user_id: str = "u1") -> str:
    """Seed one question/option -> indicator -> condition and return session id."""
    session = db_session
    kg_repo = SQLKnowledgeGraphRepository(session)

    bs = BodySystemModel(id="bs-p3", code="P3", name="P3 Test", display_order=1)
    session.add(bs)
    qg = QuestionGroupModel(
        id="qg-p3", code="QG3", name="QG3", body_system_id="bs-p3", display_order=1
    )
    session.add(qg)
    await session.commit()

    await session.execute(
        ClinicalIndicatorModel.__table__.insert().values(
            key="i1", name="Ind 1", body_system_id="bs-p3"
        )
    )
    await session.execute(
        QuestionModel.__table__.insert().values(
            text="Q1",
            body_system_id="bs-p3",
            question_group_id="qg-p3",
            code="q1",
            question_type="yes_no",
        )
    )
    await session.execute(
        QuestionOptionModel.__table__.insert().values(
            question_id="q1",
            text="Yes",
            value="yes",
            code="opt1",
            display_order=1,
            score_value=1.0,
        )
    )
    await session.commit()

    ind_row = await session.execute(
        ClinicalIndicatorModel.__table__.select().where(
            ClinicalIndicatorModel.key == "i1"
        )
    )
    ind_id = ind_row.first()._mapping["id"]
    q_row = await session.execute(
        QuestionModel.__table__.select().where(QuestionModel.code == "q1")
    )
    q_id = q_row.first()._mapping["id"]
    opt_row = await session.execute(
        QuestionOptionModel.__table__.select().where(
            QuestionOptionModel.code == "opt1"
        )
    )
    opt_id = opt_row.first()._mapping["id"]

    await kg_repo.link_question_option_indicator(opt_id, ind_id)
    cond = await kg_repo.create_condition({"code": "C1", "name": "Hypertension"})
    await kg_repo.link_indicator_condition(ind_id, cond.id)

    await session.execute(
        AssessmentSessionModel.__table__.insert().values(user_id=user_id)
    )
    await session.commit()
    s_row = await session.execute(
        AssessmentSessionModel.__table__.select().where(
            AssessmentSessionModel.user_id == user_id
        )
    )
    s_id = s_row.first()._mapping["id"]

    await session.execute(
        AssessmentAnswerModel.__table__.insert().values(
            session_id=s_id,
            question_id=q_id,
            question_code="q1",
            option_id=opt_id,
            value="Yes",
        )
    )
    await session.commit()
    return s_id


@pytest.mark.asyncio
async def test_report_generation_auto_runs_cdse(db_session: AsyncSession):
    """generate_report must succeed without a prior CDSE result."""
    s_id = await _seed_cdse_flow(db_session)

    report_svc = ReportService(db_session)
    rpt = await report_svc.generate_report(s_id, "u1")
    assert "report_id" in rpt

    r = await report_svc.get_report_by_session(s_id)
    assert r is not None
    assert len(r.conditions) == 1


@pytest.mark.asyncio
async def test_cdse_disease_probability_and_screenings(db_session: AsyncSession):
    """CDSE must emit disease probabilities + generate screenings."""
    s_id = await _seed_cdse_flow(db_session)

    svc = ClinicalDecisionService(db_session)
    result = await svc.process_assessment(s_id, "u1")

    summary = result["summary"]
    assert "disease_probabilities" in summary
    probs = summary["disease_probabilities"]
    assert len(probs) == 1
    entry = next(iter(probs.values()))
    assert entry["name"] == "Hypertension"
    assert entry["probability"] == pytest.approx(1.0)
    assert entry["risk_label"] == "High"

    r = await svc.get_result_by_session(s_id)
    assert r is not None
    assert len(r.generated_screenings) == 1
    assert "Hypertension" in r.generated_screenings[0].name


@pytest.mark.asyncio
async def test_branch_rules_route_next_question(db_session: AsyncSession):
    """Authored branch rules must override the default next question."""
    session = db_session

    bs = BodySystemModel(id="bs-br", code="BR", name="BR Test", display_order=1)
    session.add(bs)
    qg = QuestionGroupModel(
        id="qg-br", code="QGBR", name="QGBR", body_system_id="bs-br", display_order=1
    )
    session.add(qg)
    await session.commit()

    for code, order in [("q1", 1), ("q2", 2), ("q3", 3)]:
        await session.execute(
            QuestionModel.__table__.insert().values(
                text=code.upper(),
                body_system_id="bs-br",
                question_group_id="qg-br",
                code=code,
                question_type="yes_no",
                order_index=order,
            )
        )
    await session.execute(
        QuestionModel.__table__.select().where(QuestionModel.code == "q1")
    )
    q1_row = (await session.execute(
        QuestionModel.__table__.select().where(QuestionModel.code == "q1")
    )).first()
    q3_row = (await session.execute(
        QuestionModel.__table__.select().where(QuestionModel.code == "q3")
    )).first()
    q1_id = q1_row._mapping["id"]
    q3_id = q3_row._mapping["id"]

    await session.execute(
        BranchRuleModel.__table__.insert().values(
            code="BR-1",
            name="Skip to q3",
            body_system_id="bs-br",
            condition_operator="AND",
            conditions={"question_id": q1_id, "condition_type": "equals", "condition_value": {"value": "yes"}},
            target_question_id=q3_id,
            priority=10,
            is_active=True,
        )
    )
    await session.execute(
        AssessmentSessionModel.__table__.insert().values(user_id="u-br")
    )
    await session.commit()
    s_row = (await session.execute(
        AssessmentSessionModel.__table__.select().where(
            AssessmentSessionModel.user_id == "u-br"
        )
    )).first()
    s_id = s_row._mapping["id"]

    await session.execute(
        AssessmentAnswerModel.__table__.insert().values(
            session_id=s_id,
            question_id=q1_id,
            question_code="q1",
            value="yes",
            response_value={"value": "yes"},
        )
    )
    await session.commit()

    svc = QuestionnaireService(session)
    sess = await svc._session_repo.find_by_id(s_id)
    assert sess is not None

    target = await svc._apply_branch_rules(sess)
    assert target is not None
    assert target.id == q3_id

    # full next-question evaluation should route to the branch target
    sess.current_question_id = q1_id
    next_q = await svc._evaluate_next(sess)
    assert next_q is not None
    assert next_q.id == q3_id
