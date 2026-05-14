# 03. Folder Structure

```text
src/
├── api/
├── app/
├── components/
├── constants/
├── hooks/
├── lib/
├── mocks/
├── store/
├── styles/
└── types/
```

## `src/api`

순수 API service를 관리합니다. React Query hook은 이 폴더에 두지 않습니다.

```text
auth.api.ts
content.api.ts
external.api.ts
user.api.ts
```

API request/response 타입은 이 폴더에 두지 않고 `src/types`에 둡니다.

## `src/hooks/queries`

React Query 기반 `use~` hook을 관리합니다.

```text
auth.query.ts
comments.query.ts
content.query.ts
external.query.ts
users.query.ts
```

컴포넌트는 API service를 직접 import하지 않고 query hook을 사용합니다.

## `src/store`

Zustand store를 관리합니다.

```text
auth.store.ts
ui.store.ts
index.ts
```

API 응답 데이터는 store에 복제하지 않습니다. React Query cache와 Zustand store의 책임을 분리합니다.

## `src/app`

App Router 페이지와 전역 에러/로딩 파일을 관리합니다.

```text
dashboard/
boards/
notices/
inquiries/
qna/
login/
signup/
logout/
storybook/
error-preview/
error.tsx
global-error.tsx
loading.tsx
layout.tsx
```

## `src/components`

공통 컴포넌트와 기능 단위 컴포넌트를 분리합니다.

```text
auth/
data-display/
errors/
features/
feedback/
forms/
layout/
navigation/
ui/
```

### `components/layout`

페이지 공통 골격을 관리합니다.

```text
Container.tsx
Footer.tsx
Header.tsx
MainLayout.tsx
PageWrapper.tsx
Section.tsx
Sidebar.tsx
```

## `src/components/features`

도메인 또는 화면 기능 단위 컴포넌트입니다.

```text
auth/
content/
```

## `src/mocks`

mock API 데이터와 handler를 관리합니다.

```text
content.mock.ts
handlers/
mock-api.ts
mock-store.ts
mock-utils.ts
users.mock.ts
```

- `mock-api.ts`: mock request router
- `handlers/*`: 도메인별 endpoint handler
- `mock-store.ts`: mock runtime state
- `*.mock.ts`: 초기 seed data

## `docs`

프로젝트 산출물과 인수인계 문서를 관리합니다.

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
