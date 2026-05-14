# 02. Architecture

## Overview

이 프로젝트는 App Router 기반 Next.js 애플리케이션이며, 화면 계층과 API 계층을 분리합니다.

```text
App Route
  -> Feature Component
    -> UI / Forms / Data Display Component
    -> React Query Hook
      -> API Service
        -> apiClient
          -> mock API or real API
```

## Rendering

- 페이지는 `src/app` 아래에서 관리합니다.
- 인터랙션이 필요한 화면은 Client Component로 구성합니다.
- Next.js 16 기준 보호 라우트 처리는 `src/proxy.ts`를 사용합니다.

## Authentication

인증은 쿠키의 `access_token`을 기준으로 합니다.

1. 보호 라우트 접근
2. `src/proxy.ts`에서 토큰 확인
3. 토큰이 없으면 `/login?next=현재경로`로 redirect
4. 로그인 성공 후 `next` 경로로 복귀

클라이언트 내부 보호는 `AuthGuard`를 사용합니다.

```tsx
<AuthGuard mode="redirect">...</AuthGuard>
<AuthGuard mode="modal">...</AuthGuard>
```

## Server State

서버 상태는 React Query를 사용합니다.

- API service: 순수 비동기 호출
- API hook: query/mutation 래핑
- query key: 캐시 무효화를 위해 기능별 key factory 사용

## Client State

클라이언트 전역 상태는 Zustand를 사용합니다.

- `src/store/ui.store.ts`: sidebar, command palette, global search 같은 UI 상태
- `src/store/auth.store.ts`: 로그인 복귀 경로, 마지막 로그인 시각 같은 클라이언트 인증 보조 상태

서버에서 가져오는 데이터는 Zustand에 중복 저장하지 않습니다. 사용자 정보, 게시글, 댓글처럼 API에서 오는 데이터는 React Query cache를 기준으로 합니다.

## Custom Hooks

화면에서는 가능한 service와 store를 직접 조합하지 않고 커스텀 훅을 사용합니다.

예시:

```text
useAuthSession
  -> useMe/useLogin/useLogout (React Query)
  -> useAuthStore (Zustand)
```

이 패턴으로 화면은 `useAuthSession()`만 호출하고, 내부 상태 관리 방식은 훅 안에 숨깁니다.

## API Switching

`.env` 값으로 mock API와 실제 API를 전환합니다.

```bash
NEXT_PUBLIC_USE_MOCK_API=true
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
```

`NEXT_PUBLIC_USE_MOCK_API=false`일 때 `src/lib/axios.ts`의 fetch client가 실제 API를 호출합니다.

## Error Strategy

오류는 `src/lib/errors.ts`에서 구분합니다.

- API 오류
- 네트워크 오류
- 렌더링 오류

화면은 `components/errors/ErrorPages.tsx`, `app/error.tsx`, `app/global-error.tsx`, `/error-preview`에서 확인합니다.
