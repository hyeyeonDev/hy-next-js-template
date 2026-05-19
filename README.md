# Next.JS Template

Next.js 기반 업무용 프론트엔드 템플릿입니다. 공통 UI, 폼, 피드백, 데이터 표시, 인증 가드, mock API, 에러 화면까지 미리 구성해두고 실제 API 연결 시 교체하기 쉽게 만드는 것을 목표로 합니다.

## Stack

- Next.js 16 App Router
- React 19
- Tailwind CSS 4
- React Query
- Zustand
- react-hook-form + zod
- ECharts
- lucide-react

## Documentation

프로젝트 산출물과 인수인계 문서는 `docs/`에서 관리합니다.

```text
docs/
├── 01-overview.md
├── 02-architecture.md
├── 03-folder-structure.md
├── 04-coding-convention.md
├── 05-design-system.md
├── 06-api-spec.md
├── 07-components/
├── 08-pages/
└── 09-deployment.md
```

## Scripts

```bash
npm run dev        # 개발 서버 모드: RELEASED_FEATURES만 노출
npm run dev:local  # 개인 로컬 모드: 모든 페이지/메뉴 노출
npm run build      # 운영 빌드
npm run build:dev  # 개발 서버용 빌드
npm run start      # 운영 빌드 실행
npm run start:dev  # 개발 서버용 빌드 실행
npm run lint
```

## Environment

Next.js는 프로젝트 루트의 `.env*` 파일을 읽습니다. `/src` 안이 아니라 루트에 두어야 합니다.

```text
.env              공통 기본값
.env.local        개인 로컬용 override, git ignore
.env.development  개발 서버
.env.production   운영 서버
.env.example      공유용 예시
```

환경별 역할은 다음 기준으로 사용합니다.

- `.env`: 앱 이름처럼 고정된 값과 기본 API URL, mock 기본값처럼 모든 환경에서 공유 가능한 값
- `.env.local`: 개인 PC에서만 쓰는 값. `NEXT_PUBLIC_APP_ENV=local`이면 모든 메뉴와 페이지가 열림
- `.env.development`: 개발 서버 값. `RELEASED_FEATURES`에 등록된 기능만 노출
- `.env.production`: 운영 서버 값. `RELEASED_FEATURES`에 등록된 기능만 노출

`NEXT_PUBLIC_APP_NAME`처럼 환경마다 달라지지 않는 고정값은 `.env`에만 둡니다. 환경별 파일에는 해당 환경에서 달라지는 값만 작성합니다.

카카오맵/GA처럼 환경마다 달라지는 외부 키는 `.env`에 두지 않고 `.env.local`, `.env.development`, `.env.production`에만 작성합니다. Next.js 로딩 순서는 `.env.development`/`.env.production`이 `.env`보다 우선이지만, 공통 파일에는 진짜 공통값만 두는 편이 실수를 줄입니다.

`NEXT_PUBLIC_APP_ENV=local`일 때만 모든 메뉴와 페이지가 열립니다. `development`, `staging`, `production` 등 local이 아닌 환경에서는 `src/lib/feature-flags.ts`의 `RELEASED_FEATURES`에 등록한 기능만 메뉴에 노출하며, 직접 URL 접근도 `src/proxy.ts`에서 404로 차단합니다.

`NEXT_PUBLIC_USE_MOCK_API=false`로 바꾸면 `src/lib/axios.ts`의 fetch client가 실제 API base URL을 사용합니다.

사용 가능한 feature key는 `dashboard`, `mypage`, `user-permissions`, `login-history`, `organizations`, `data-codes`, `notices`, `inquiries`, `qna`, `storybook`, `error-preview`입니다.

### 실행 방법

개인 로컬 개발은 모든 페이지를 열어두고 확인합니다.

```bash
npm run dev:local
```

개발 서버와 같은 제한 조건으로 로컬에서 확인하려면 다음 명령을 사용합니다. `.env.local`이 있어도 스크립트의 `NEXT_PUBLIC_APP_ENV=development`가 우선 적용됩니다.

```bash
npm run dev
```

운영 빌드를 로컬에서 검증하려면 다음 순서로 실행합니다.

```bash
npm run build
npm run start
```

개발 서버용 빌드를 검증하려면 다음 순서로 실행합니다.

```bash
npm run build:dev
npm run start:dev
```

### 배포 방식

개발 서버 배포:

```bash
npm ci
npm run build:dev
npm run start:dev
```

운영 서버 배포:

```bash
npm ci
npm run build
npm run start
```

Vercel 같은 플랫폼을 사용한다면 환경별 Variables에 `.env.development` 또는 `.env.production`의 값을 등록하고, 빌드 명령은 개발 서버는 `npm run build:dev`, 운영 서버는 `npm run build`로 지정합니다. `NEXT_PUBLIC_` 변수는 빌드 시점에 브라우저 번들에 고정되므로, 환경별 값이 필요한 경우 반드시 해당 환경에서 다시 빌드해야 합니다.

## Routes

- `/`: 홈
- `/storybook`: 공통 컴포넌트 확인 화면
- `/login`: 로그인
- `/signup`: 회원가입
- `/logout`: 로그아웃 처리
- `/dashboard`: 보호 라우트 예시
- `/digital-map`: 독립형 지도 화면, 메뉴에서 새 창으로 열림
- `/mypage`: 내 정보 확인/수정
- `/users`: 사용자권한 정보
- `/users/login-history`: 로그인 이력관리
- `/organizations`: 조직관리
- `/data/codes`: 코드관리
- `/boards`: 활성화된 게시판 첫 메뉴로 이동
- `/boards/notices`: 공지사항
- `/boards/inquiries`: 질의/문의
- `/boards/qna`: Q&A
- `/error-preview`: 에러 타입별 화면 확인

Next.js 16 기준으로 라우트 보호와 feature flag 기반 페이지 차단은 `middleware.ts`가 아니라 `src/proxy.ts`에서 처리합니다.

## Components

### UI

```text
components/ui/
├── Accordion.tsx
├── Avatar.tsx
├── Badge.tsx
├── Button.tsx
├── Card.tsx
├── Checkbox.tsx
├── Chip.tsx
├── ColorPicker.tsx
├── CommandPalette.tsx
├── Divider.tsx
├── Drawer.tsx
├── Dropdown.tsx
├── Input.tsx
├── Modal.tsx
├── MultiSelect.tsx
├── Pagination.tsx
├── Popover.tsx
├── Progress.tsx
├── Radio.tsx
├── Rating.tsx
├── Select.tsx
├── Skeleton.tsx
├── Spinner.tsx
├── Stepper.tsx
├── Switch.tsx
├── Table.tsx
├── Tabs.tsx
├── Textarea.tsx
├── Tooltip.tsx
├── TreeView.tsx
├── Typography.tsx
├── dialog/
└── toast/
```

### Forms

```text
components/forms/
├── AddressField.tsx
├── AutoComplete.tsx
├── CurrencyField.tsx
├── DatePicker.tsx
├── DateRangeField.tsx
├── EmailField.tsx
├── FileUploadField.tsx
├── FormError.tsx
├── FormField.tsx
├── FormLabel.tsx
├── FormProvider.tsx
├── NumberField.tsx
├── OTPField.tsx
├── PasswordField.tsx
├── PhoneField.tsx
├── SearchInput.tsx
├── TagInput.tsx
├── TimeField.tsx
└── UrlField.tsx
```

`FormProvider.tsx`는 `react-hook-form` context를 내려주는 래퍼이며, `useZodForm(schema)`로 zod validation을 바로 연결할 수 있습니다.

### Layout

```text
components/layout/
├── Container.tsx
├── Footer.tsx
├── Header.tsx
├── MainLayout.tsx
├── PageWrapper.tsx
├── Section.tsx
└── Sidebar.tsx
```

업무형 페이지는 `MainLayout + Header + PageWrapper + Section` 조합을 기본 레이아웃 패턴으로 사용합니다.

### Charts

```text
components/charts/
├── BarChart.tsx
├── ChartCard.tsx
├── EChart.tsx
├── LineChart.tsx
├── PieChart.tsx
├── chart-theme.ts
└── useECharts.ts
```

ECharts 기반 차트 래퍼입니다. `useECharts` 훅은 SSR 환경에서 안전하게 동작하며, `ResizeObserver`로 컨테이너 크기 변경에 맞춰 자동 resize합니다.

### Feedback / Errors

```text
components/feedback/
├── Alert.tsx
├── ConfirmDialog.tsx
├── Snackbar.tsx
└── Toast.tsx

components/errors/
└── ErrorPages.tsx
```

API 오류, 네트워크 오류, 화면 렌더링 오류를 `src/lib/errors.ts`에서 구분하고 `app/error.tsx`, `app/global-error.tsx`, `/error-preview`에서 확인할 수 있습니다.

### Auth

```text
components/auth/
├── AuthGuard.tsx
├── RoleGuard.tsx
└── index.ts

components/features/auth/
├── LoginForm.tsx
├── SignupForm.tsx
└── SocialLogin.tsx
```

- `AuthGuard`: 로그인되지 않은 사용자를 로그인 화면으로 이동
- `RoleGuard`: 권한이 없는 사용자에게 특정 UI를 숨김
- `src/proxy.ts`: 쿠키 기반 보호 라우트 리다이렉트

인증 흐름은 기본적으로 다음 패턴을 사용합니다.

1. 보호 라우트 직접 접근: `src/proxy.ts`에서 `access_token` 쿠키를 확인합니다.
2. 토큰이 없으면 `/login?next=기존경로`로 이동합니다.
3. 로그인 성공 후 `LoginForm`이 `next` 경로로 복귀합니다.
4. 페이지 전체 보호는 `AuthGuard mode="redirect"`, 현재 화면 위 로그인은 `AuthGuard mode="modal"`을 사용합니다.

아이디/비밀번호 기반 로그인, 회원가입, 로그아웃은 mock API 기준으로 바로 동작합니다. 실제 API 연결 시에는 `src/api/auth.api.ts`의 endpoint와 응답 타입을 서버 스펙에 맞추면 됩니다.

### Content

```text
components/features/content/
├── ContentForm.tsx
├── ContentListPage.tsx
└── content-meta.ts
```

게시판, 공지사항, 질의, Q&A는 같은 목록/작성/상세/수정/삭제 UI를 공유합니다. `src/api/content.api.ts`의 endpoint map만 서버 스펙에 맞추면 화면 로직을 유지한 채 실제 API로 전환할 수 있습니다.

## API / Mock Data

mock 데이터는 `src/mocks`에 두고, API service와 query hook은 역할별로 분리합니다.

```text
src/api/
src/hooks/queries/
src/mocks/
src/lib/axios.ts
src/lib/query-client.ts
src/lib/react-query.tsx
```

초기 개발 단계에서는 mock API로 화면과 상태를 먼저 만들고, 실제 API 스펙이 확정되면 client base URL과 endpoint만 교체하는 방식으로 진행합니다.

API 관련 역할은 다음 기준으로 나눕니다.

- `src/types`: API request/response, query params, domain model 타입
- `src/api`: 순수 API service 함수
- `src/hooks/queries`: React Query 기반 `use~` hook
- `src/constants/queryKeys.ts`: React Query key factory
- `src/mocks`: mock data, mock store, endpoint handler

상태 관리는 다음 기준으로 나눕니다.

- React Query: 서버 상태, 캐싱, mutation
- Zustand: 클라이언트 전역 상태, UI 상태, 화면 간 임시 상태
- 커스텀 훅: React Query와 Zustand를 조합해 화면에서 쓰기 좋은 API 제공

React Query hook은 `useUsersQuery`, `useCreateUserMutation`처럼 조회는 `Query`, 변경은 `Mutation` 접미사를 사용합니다.

현재 준비된 mock API:

- `POST /auth/login`
- `POST /auth/signup`
- `POST /auth/logout`
- `GET /auth/me`
- `GET /users`, `POST /users`, `GET/PATCH/DELETE /users/:id`
- `GET/POST /boards`, `GET/PATCH/DELETE /boards/:id`
- `GET/POST /boards/:id/comments`, `POST/PATCH/DELETE /boards/:id/comments/:commentId`
- `GET/POST /notices`, `GET/PATCH/DELETE /notices/:id`
- `GET/POST /notices/:id/comments`, `PATCH/DELETE /notices/:id/comments/:commentId`
- `GET/POST /inquiries`, `GET/PATCH/DELETE /inquiries/:id`
- `GET/POST /inquiries/:id/comments`, `POST/PATCH/DELETE /inquiries/:id/comments/:commentId`
- `GET/POST /qnas`, `GET/PATCH/DELETE /qnas/:id`
- `GET/POST /qnas/:id/comments`, `POST/PATCH/DELETE /qnas/:id/comments/:commentId`

## Design Tokens

색상은 `src/styles/globals.css`의 CSS 변수와 Tailwind theme token으로 관리합니다. 라이트/다크 모드는 `html.dark` 클래스 기준으로 전환되며, `useTheme()` 훅으로 토글할 수 있습니다.

## Deliverables Guide

나중에 산출물이 필요할 가능성이 있다면 아래 항목을 미리 쌓아두는 방식이 좋습니다.

1. 컴포넌트 명세서
   - `/storybook` 화면을 기준으로 컴포넌트명, props, 상태, 사용 예시를 정리합니다.
   - 신규 컴포넌트를 추가하면 README의 Components 목록과 `/storybook` 예시를 같이 갱신합니다.

2. 화면 목록 및 라우팅 표
   - URL, 접근 권한, 주요 기능, 사용하는 API, 에러/로딩 상태를 표로 관리합니다.
   - 보호 라우트는 `src/proxy.ts`, 화면 내 권한 제어는 `AuthGuard`/`RoleGuard`로 구분합니다.

3. API 연동 문서
   - mock endpoint, 실제 endpoint, request/response 타입, query key를 함께 기록합니다.
   - `src/constants/queryKeys.ts`와 API hook 이름을 문서 기준으로 맞춥니다.

4. 폼 검증 규칙
   - zod schema를 기능 단위로 관리하고, 필드별 에러 메시지를 정리합니다.
   - 실제 제출 폼은 `FormProvider + useZodForm` 조합을 기본 패턴으로 둡니다.

5. 오류 처리 기준
   - API 오류, 네트워크 오류, 렌더링 오류를 어떤 화면으로 보여줄지 기준을 둡니다.
   - `/error-preview`는 QA와 기획 리뷰용 확인 페이지로 활용합니다.

6. 릴리즈 체크리스트
   - `npm run build`
   - `npm run lint`
   - 주요 라우트 수동 확인
   - 라이트/다크 모드 확인
   - 인증/권한/에러/로딩 상태 확인

## Current Notes

- `npm run build` 통과를 기준으로 유지합니다.
- `npm run lint`는 기존 hook 구현과 일부 타입 정의 이슈가 남아있으므로 별도 정리가 필요합니다.
- UI 아이콘은 직접 SVG를 만들기보다 `lucide-react`를 기본으로 사용합니다.
