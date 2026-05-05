# PAM KPI Reporting System — Implementation Plan

## Context

Build a full-responsive Next.js web application for "ระบบรายงานผลการดำเนินงานตามเกณฑ์วัดของสายงาน" (KPI Performance Reporting System) for ฝ่ายบริหารจัดการสินทรัพย์ระบบไฟฟ้า (ฝบร.) based on a Claude Design handoff bundle containing detailed JSX prototypes and screenshots.

**Key advantage**: A reference project exists at `../pea-pam-kpi/` with the same stack (Next.js 16, shadcn/ui v4, Tailwind v4, TypeScript) that has working types, workflow logic, mock data, and UI components. We'll adopt its data layer and adapt its components to match the new purple/gold design.

---

## Phase 1: Project Scaffolding

1. **Initialize Next.js project** in current directory:
   ```
   npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
   ```
2. **Install shadcn/ui**: `npx shadcn@latest init`
3. **Install shadcn components**: button, card, input, select, table, badge, dialog, tabs, textarea, tooltip, avatar, separator, label, progress, scroll-area, sheet, dropdown-menu
4. **Install extra deps**: `recharts` (for charts)
5. **Configure fonts** in `layout.tsx`: Sarabun (Thai body) + IBM Plex Mono (numbers/mono) via `next/font/google`
6. **Copy PEA logo** from design bundle to `public/pea-logo.png`

## Phase 2: Design System (`globals.css`)

Replace default shadcn theme with purple/gold tokens from the design handoff `colors_and_type.css`:

- **Primary**: Purple scale (#3B0764 → #F5F3FF), brand at #6D28D9
- **Accent**: Gold scale (#C9A84C)
- **Sidebar**: Purple-900 (#3B0764) background
- **Fonts**: `--font-sans: Sarabun`, `--font-mono: IBM Plex Mono`
- **Shadows**: Purple-tinted soft shadows
- **Status colors**: Green (success), Amber (warning), Red (danger), Blue (info)

Map all shadcn CSS variables (`--primary`, `--accent`, `--card`, etc.) to the purple palette.

## Phase 3: Data Layer (Adopt from Reference)

Copy and adapt from `../pea-pam-kpi/src/lib/`:

| File | Source | Changes |
|------|--------|---------|
| `src/lib/types.ts` | Copy from ref | Add `category` field to KpiItem, change `targets` to numeric `{1:num, 2:num, 3:num, 4:num, 5:num}` to match design |
| `src/lib/workflow.ts` | Copy from ref | Add `computeLevel(actual, targets, unit)` function from design's `data.jsx` |
| `src/lib/labels.ts` | Copy from ref | Already has Thai labels for roles, divisions, statuses |
| `src/lib/mock-data.ts` | Copy + expand | Add all 7 KPIs and 4 reports from design's `data.jsx`, add demo users with Thai names |
| `src/lib/utils.ts` | Copy from ref | `cn()` utility |
| `src/lib/constants.ts` | New | Nav items, month options, page meta/breadcrumbs |

## Phase 4: State Management

Create `src/providers/app-provider.tsx` based on ref's `prototype-provider.tsx`:

- Auth context: current user, login/logout, role switching
- Data context: KPIs, reports, CRUD mutations
- Client-side state with localStorage persistence
- Interface designed for future Supabase replacement
- Add `createKpi`, `updateKpi`, `createReport`, `updateReport` mutations (ref only has approval actions)

## Phase 5: Layout Shell

### Sidebar (`src/components/layout/sidebar.tsx`)
- Purple-900 background, collapsible 240px ↔ 68px
- PEA logo + "PEA · PAM" branding
- 4 nav items: ภาพรวม KPI, รายการตัวชี้วัด, รายงานผลรายเดือน, คิวอนุมัติ
- Amber badge count on คิวอนุมัติ
- User info card at bottom (avatar gradient, name, role, division)
- Collapse toggle with smooth animation

### Header (`src/components/layout/header.tsx`)
- Breadcrumbs with purple accent
- Month/year chip (purple pill with calendar icon)
- User avatar dropdown with logout

### Mobile Nav (`src/components/layout/mobile-nav.tsx`)
- Sheet-based overlay on mobile using shadcn Sheet

### App Shell (`src/components/layout/app-shell.tsx`)
- Combine sidebar + header + main content area
- Route group `(app)/layout.tsx` wraps all authenticated pages

## Phase 6: Shared Components

| Component | File | Description |
|-----------|------|-------------|
| StatusBadge | `src/components/shared/status-badge.tsx` | Pill badge with dot: draft/pending1-3/approved/returned |
| DivBadge | `src/components/shared/div-badge.tsx` | Division badge: กบผ.(gold), กบร.(blue), กบค.(green) |
| LevelBadge | `src/components/shared/level-badge.tsx` | Performance level 1-5 with color scale |
| ProgressBar | `src/components/shared/progress-bar.tsx` | Gradient bar (red→amber→purple→green) |
| ApprovalTimeline | `src/components/shared/approval-timeline.tsx` | Vertical timeline with action icons |
| ApprovalSteps | `src/components/shared/approval-steps.tsx` | Horizontal 4-step indicator |
| ApprovalActions | `src/components/shared/approval-actions.tsx` | Submit/Approve/Reject buttons + reason dialog |
| Field | `src/components/shared/field.tsx` | Form field wrapper with label + hint |

## Phase 7: Login Page (`src/app/login/page.tsx`)

Standalone page (no AppShell), matching design screenshots:
- Deep purple gradient bg (`linear-gradient(135deg, #1a0533, #3B0764)`)
- 3 decorative radial gradient orbs + subtle grid pattern
- Glassmorphism card (`backdrop-filter: blur(20px)`, semi-transparent)
- Employee ID + Password fields with icons
- Demo role quick-login buttons (5 roles)
- PEA logo with gold border ring
- Loading spinner on submit

## Phase 8: Dashboard (`src/app/(app)/dashboard/page.tsx`)

Components in `src/components/dashboard/`:

1. **Welcome strip**: "สวัสดี, {role}" with action buttons
2. **Stat cards** (4-grid): KPI ทั้งหมด, อนุมัติแล้ว, รออนุมัติ, ส่งกลับแก้ไข — IBM Plex Mono large numbers
3. **KPI trend bar chart** (`recharts` BarChart): 8-month trend, purple gradient bars
4. **KPI status donut** (`recharts` PieChart or custom SVG): Status proportions with center percentage
5. **Division summary table**: Division rows with DivBadge, KPI counts, progress bars, averages

## Phase 9: KPI Master Data

### List (`src/app/(app)/kpi/page.tsx`)
- Search input with icon
- Division filter pills (monospace font)
- Status filter chips
- Table: รหัส KPI, ชื่อตัวชี้วัด + definition preview, กอง, หมวดหมู่, น้ำหนัก, สถานะ, actions
- "สร้าง KPI ใหม่" button (visible only to Assignees)

### Detail/Form (`src/app/(app)/kpi/[id]/page.tsx`)
- 2-column layout: form (left) + approval sidebar (right)
- **Form fields**: name, definition (textarea), division (select), category, unit, weight, owner, coOwner, initiative, targets level 1-5 with color dots
- **Returned warning**: Red alert banner with rejection reason
- **Approval sidebar**: 4-step indicator + ApprovalTimeline
- **Actions**: Save draft, Submit, Approve, Reject (with reason dialog)
- Read-only mode for non-editors

## Phase 10: Monthly Reports

### List (`src/app/(app)/reports/page.tsx`)
- Month/year selector (Sarabun + IBM Plex Mono)
- Division filter pills
- Summary stats: total, filled, approved
- Table: KPI code, name, division, unit, actual value, level badge, report status, action button

### Detail (`src/app/(app)/reports/[id]/page.tsx`)
- 2-column layout: content (left) + approval sidebar (right)
- **KPI info card**: name, definition, weight, unit, category, owner
- **Performance section**: Actual value input (large mono font) + live LevelBadge, targets comparison table (level 1-5 with pass/fail indicators)
- **Detail textareas** (4 fields): ผลการดำเนินงาน, แนวทางระดับ 4, ปัญหาอุปสรรค, แนวทางแก้ไข
- **Approval sidebar**: Same as KPI detail

## Phase 11: Approval Queue (NEW — not in reference project)

`src/app/(app)/approvals/page.tsx` — Split panel layout:

### Left panel (340px): Queue list
- Tabs: รอดำเนินการ / ดำเนินการแล้ว
- Queue items: type badge (KPI/รายงาน), DivBadge, title, status, last log date
- Selected state with purple left border
- Empty state with icon

### Right panel: Detail view
- Type badge + DivBadge + StatusBadge header
- KPI or Report detail card
- Approval timeline
- Approve/Reject action buttons
- "ดูรายละเอียดเต็ม" link to full page

### Mobile: Stack vertically or use Sheet for detail

## Phase 12: Responsive Design

- **Mobile sidebar**: Sheet overlay triggered by hamburger menu
- **Dashboard**: 4-grid → 2-grid → 1-grid on mobile
- **Tables**: Horizontal scroll wrapper on mobile
- **2-column layouts** (KPI form, report detail): Stack to single column on mobile
- **Approval queue**: Stack panels on mobile
- **Breakpoints**: sm(640) md(768) lg(1024) xl(1280)

---

## File Structure Summary

```
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx                    # Redirect → /dashboard or /login
│   ├── login/page.tsx
│   └── (app)/
│       ├── layout.tsx              # AppShell wrapper
│       ├── dashboard/page.tsx
│       ├── kpi/
│       │   ├── page.tsx
│       │   └── [id]/page.tsx
│       ├── reports/
│       │   ├── page.tsx
│       │   └── [id]/page.tsx
│       └── approvals/page.tsx
├── components/
│   ├── ui/                         # shadcn/ui (auto-generated)
│   ├── layout/
│   │   ├── app-shell.tsx
│   │   ├── sidebar.tsx
│   │   ├── header.tsx
│   │   └── mobile-nav.tsx
│   ├── shared/
│   │   ├── status-badge.tsx
│   │   ├── div-badge.tsx
│   │   ├── level-badge.tsx
│   │   ├── progress-bar.tsx
│   │   ├── approval-timeline.tsx
│   │   ├── approval-steps.tsx
│   │   ├── approval-actions.tsx
│   │   └── field.tsx
│   ├── dashboard/
│   │   ├── stat-cards.tsx
│   │   ├── kpi-trend-chart.tsx
│   │   ├── kpi-status-donut.tsx
│   │   └── division-summary.tsx
│   ├── kpi/
│   │   ├── kpi-list.tsx
│   │   └── kpi-form.tsx
│   ├── reports/
│   │   ├── report-list.tsx
│   │   └── report-detail.tsx
│   └── approvals/
│       ├── approval-queue.tsx
│       └── approval-detail.tsx
├── providers/
│   └── app-provider.tsx
├── hooks/
│   ├── use-auth.ts
│   └── use-data.ts
├── lib/
│   ├── types.ts
│   ├── workflow.ts
│   ├── labels.ts
│   ├── mock-data.ts
│   ├── utils.ts
│   └── constants.ts
└── public/
    └── pea-logo.png
```

## Key Reuse from Reference Project (`../pea-pam-kpi/`)

| What | Reuse Level | Notes |
|------|-------------|-------|
| `types.ts` | Copy + modify | Add category, numeric targets |
| `workflow.ts` | Copy + extend | Add computeLevel() |
| `labels.ts` | Copy directly | Already complete |
| `mock-data.ts` | Copy + expand | More KPIs/reports from design |
| `utils.ts` | Copy directly | cn() utility |
| `prototype-provider.tsx` | Adapt | Rename, add CRUD mutations |
| `approval-timeline.tsx` | Adapt | Restyle for purple theme |
| `approval-actions.tsx` | Adapt | Restyle for purple theme |
| `status-badge.tsx` | Adapt | Add design's color config |
| `app-shell.tsx` | Rewrite | Different sidebar design |
| `login-view.tsx` | Rewrite | Different glassmorphism design |
| `dashboard-view.tsx` | Rewrite | Add charts, different layout |
| shadcn ui/ components | Copy directly | Already configured |

## Verification

1. `npm run build` — Ensure no TypeScript/build errors
2. `npm run dev` — Visual inspection of each page at desktop + mobile sizes
3. Test login with all 5 demo roles — verify RBAC permissions per page
4. Test approval workflow end-to-end: create KPI → submit → approve L1 → approve L2 → approve L3
5. Test report workflow: create report → fill data → submit → approve chain
6. Test reject workflow: reject at any level → verify returned status + reason display
7. Test sidebar collapse/expand animation
8. Test responsive at 375px, 768px, 1024px, 1280px
