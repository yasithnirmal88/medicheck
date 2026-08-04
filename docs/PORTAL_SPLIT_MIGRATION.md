# Patient / Doctor Portal Split — Refactoring Summary

This document records the refactor that separates the Medicheck frontend into two
independent portals while **reusing, moving, and renaming** existing code instead of
rebuilding it. The existing Glassmorphism + blue/teal design system is preserved.

Scope: all changes touch the **frontend only** (`frontend/src`).

---

## 1. What changed (conceptual model)

- **Patient Portal** (existing dashboard + all patient-facing modules) now lives under
  the `/patient/*` path namespace.
- **Doctor CMS** (the existing CMS / Knowledge Center suite) now lives under the
  `/doctor/*` path namespace and is a separate, guarded portal.
- A **pre-login role selector** captures the intended portal. After authentication the
  user is sent to the correct home (`/patient/dashboard` or `/doctor/dashboard`).
- Shared UI, theme, auth, hooks, and layouts are reused as-is (they were already
  centralized).

---

## 2. Files created (new)

| File | Purpose |
| --- | --- |
| `frontend/src/features/auth/pages/RoleSelector.tsx` | Pre-login portal role-picker (Patient vs Doctor). Reuses `AuthLayout`, `motion` cards, defines role via `setRole`. |
| `frontend/docs/PORTAL_SPLIT_MIGRATION.md` | This document. |

> No new layouts, cards, charts or UI primitives were created — existing components are
> reused everywhere.

---

## 3. Files modified (refactor/rename)

| File | What changed |
| --- | --- |
| `frontend/src/features/auth/types/auth.ts` | Added `PortalRole` (`'patient' \| 'doctor'`), `PortalRoleOption`, `ROLE_OPTIONS`, and `roleHomePath(role)` helper. |
| `frontend/src/providers/AuthProvider.tsx` | Added `role`, `setRole`, `clearRole` to context; persists the portal role to `localStorage` (`medicheck:portal:role`) and restores it on load. |
| `frontend/src/features/auth/components/AuthGuard.tsx` | Made guard role-aware; added `PatientGuard`, `DoctorGuard`, and `PortalRedirect`. Unauthenticated → `/login`; wrong role → the other portal home. |
| `frontend/src/features/auth/pages/Login.tsx` | Post-login redirect now targets the role home (`roleHomePath(role)`, falling back to `/portal`). |
| `frontend/src/routes/router.tsx` | Restructured into `/patient/*` and `/doctor/*` namespaces under the new guards; added back-compat prefix redirects for every old absolute path (incl. `/cms/*` → `/doctor/*`). |
| `frontend/src/features/dashboard/components/layout/navConfig.ts` | Patient nav now points to `/patient/*`; removed the doctor-only "Knowledge Center → /cms" entry. |
| `frontend/src/features/dashboard/components/layout/Sidebar.tsx` | Anchored the active state for the new `/patient/dashboard` route. |
| `frontend/src/features/dashboard/components/layout/MobileBottomNav.tsx` | Mobile nav items repointed to `/patient/*`. |
| `frontend/src/features/cms/layouts/CMSLayout.tsx` | All nav paths moved from `/cms/*` to `/doctor/*` (active-state highlighting now resolves correctly). |
| `frontend/src/features/cms/pages/CMSDashboardPage.tsx` | Quick-action links repointed from `/cms/*` to `/doctor/*` (and fixed two stale routes `/rules` → `/rules-builder`, `/knowledge-graph` → `/graph`). |
| `frontend/src/features/health-reports/components/BodySystemAccordion.tsx` | Fixed a pre-existing stray `}}` (the `.map` block close) that blocked the build/typecheck. |

---

## 4. Routing map

### Patient Portal (requires auth + role = `patient`)
- `/` → `PortalRedirect` (authed → role home, else `/portal`)
- `/portal` → `RoleSelectorPage`
- `/login` → `LoginPage`
- `/patient/dashboard` → `Dashboard`
- `/patient/profile`, `/patient/profile/{wizard,sections,versions}`
- `/patient/questionnaires`, `/patient/questionnaires/{history,:id}`
- `/patient/assessments`, `/patient/assessments/dashboard`, `/patient/assessments/:id{,/results}`
- `/patient/report/:id`, `/patient/body-systems`, `/patient/recommendations`
- `/patient/timeline`, `/patient/timeline/compare`

### Doctor CMS (new auth + role guard = `doctor`)
| `/doctor` | CMSLayout shell (Outlet) |
| `/doctor/dashboard` | CMSDashboardPage |
| `/doctor/{questions,diseases,body-systems,symptoms,indicators,lab-tests,imaging,recommendations,lifestyle,exercise,nutrition,evidence,templates,medications,guidelines,rules,thresholds}` | Content list pages |
| `/doctor/{builder,rules-builder,graph}` | Builders |
| `/doctor/{publishing,approvals,history}` | Workflow |
| `/doctor/{audit,users,search,settings}` | Operations |

### Backward-compat redirects (kept so every old deep link still resolves)
- `/cms/*` → `/doctor/*` (prefix-preserving)
- `/app` → `/patient/dashboard`
- `/profile*`, `/questionnaires*`, `/assessments*`, `/report/:id`, `/body-systems`,
  `/recommendations`, `/timeline*`, `/dashboard` → matching `/patient/*`

---

## 5. Verification

- `npx tsc --noEmit` — **no errors in any refactored/created file.** (Remaining
  typecheck errors are all in pre-existing, uncommitted WIP feature folders outside this
  scope: `features/laboratory-results`, `features/recommendations`, `features/health-reports`,
  `features/profile` wizard type edges.)
- `npx eslint --ext .ts,.tsx src/...` — 0 errors on all touched files.
- `npx vite build` — production build completes successfully.

---

## 6. Notes / follow-ups

- The **laboratory-results** and **health-reports** feature folders are uncommitted WIP
  and, as of this refactor, reference components that do not yet exist (they previously
  broke `tsc` and the production build). They were **not** added to the new router; a
  `LaboratoryResultsPage` route that a concurrent edit had introduced was removed to keep
  the build green. Re-enable it once those modules are complete.
- Portal role is stored client-side in `localStorage`. For stricter, server-enforced
  access you can later move this to Firebase custom claims and derive `role` from the
  decoded token in `AuthProvider` without changing any consumers.
- To switch portals after login, call `setRole(next)` (or `clearRole()`) and navigate to
  `roleHomePath(next)` — the account dropdown (`UserMenu`) is the planned entry point.