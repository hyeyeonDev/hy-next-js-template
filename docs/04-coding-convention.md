# 04. Coding Convention

## Language

- TypeScript를 기본으로 사용합니다.
- API request/response 타입은 `src/types`에 정의합니다.
- 컴포넌트 props 타입은 해당 컴포넌트 파일 가까이에 둡니다.

## Components

- 재사용 UI는 `components/ui`에 둡니다.
- 폼 조합 컴포넌트는 `components/forms`에 둡니다.
- 특정 업무 기능은 `components/features/{domain}`에 둡니다.
- 아이콘은 `lucide-react`를 사용합니다.

## API

API 파일은 다음 구조를 권장합니다.

```text
service
```

API request/response 타입은 `src/types`에 둡니다. `src/api`는 타입을 정의하지 않고 가져다 씁니다.
`use~`로 시작하는 React Query hook은 `src/hooks/queries`에 둡니다.

React Query hook 네이밍:

| Hook Type | Naming |
| --- | --- |
| 조회 | `use{Domain}Query` |
| 목록 조회 | `use{DomainPlural}Query` |
| 생성/수정/삭제 | `use{Action}{Domain}Mutation` |

예시:

- `useMeQuery`
- `useUsersQuery`
- `useContentQuery`
- `useCreateContentMutation`
- `useUpdateCommentMutation`
- `useDeleteUserMutation`

역할 분리:

| Layer | Role |
| --- | --- |
| `src/types` | API 계약 타입 |
| `src/api` | 순수 service 함수 |
| `src/hooks/queries` | React Query hook |
| `src/constants/queryKeys.ts` | query key factory |
| `src/mocks` | mock endpoint 구현 |

타입 위치 기준:

| Type | Location |
| --- | --- |
| 공통 응답 wrapper | `src/types/api.ts` |
| 인증 request/response | `src/types/auth.ts` |
| 사용자 model/request/params | `src/types/user.ts` |
| 게시판/공지/Q&A model/request/params | `src/types/content.ts` |
| 외부 API response | `src/types/external.ts` |

댓글처럼 하위 리소스가 별도 API로 관리되는 경우 `src/api/comments.api.ts`에 service를, `src/hooks/queries/comments.query.ts`에 hook을 둡니다. 화면은 query hook만 import하고, mock과 실제 API 전환은 service 내부 endpoint 교체로 처리합니다.

## State Management

- 서버 상태는 React Query를 사용합니다.
- 클라이언트 전역 상태는 Zustand를 사용합니다.
- 화면 전용 단기 상태는 `useState`를 사용합니다.
- React Query 데이터를 Zustand에 복제하지 않습니다.
- 두 상태를 함께 써야 하면 `src/hooks/use*.ts` 커스텀 훅에서 조합합니다.

예시:

```ts
const {
  user,
  loginMutation,
  returnTo,
  setReturnTo,
} = useAuthSession();
```

예시:

```ts
// src/api/content.api.ts
export const contentService = {
  getList: async () => {},
};

// src/hooks/queries/content.query.ts
export function useContentsQuery() {
  return useQuery({
    queryKey: QUERY_KEYS.CONTENTS.list(kind, params),
    queryFn: () => contentService.getList(params),
  });
}
```

## Forms

- 실제 제출 폼은 `react-hook-form + zod` 조합을 우선 사용합니다.
- 단순 데모 또는 UI preview는 local state를 허용합니다.
- validation message는 사용자 관점의 문장으로 작성합니다.

## Styling

- Tailwind utility와 `globals.css`의 design token을 사용합니다.
- 라이트/다크 모드를 모두 고려해 `text-text`, `bg-surface`, `border-border` 같은 semantic token을 우선 사용합니다.
- 컴포넌트 내부에 하드코딩 색상을 넣을 때는 디자인 토큰과 충돌하지 않는지 확인합니다.

## Routing

- href는 가능하면 `src/constants/routes.ts`의 상수를 사용합니다.
- 보호 라우트는 `src/proxy.ts` matcher에 추가합니다.

## Before Commit

```bash
npm run build
npm run lint
```

lint와 build를 모두 통과한 상태를 유지합니다.
