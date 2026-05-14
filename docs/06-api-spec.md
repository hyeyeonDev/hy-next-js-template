# 06. API Spec

현재 API는 mock 기준으로 정의되어 있으며, 실제 API 연결 시 endpoint와 response shape를 서버 스펙에 맞춰 조정합니다.

## Type Ownership

API 계약 타입은 `src/types`에서 관리합니다.

- request DTO
- response DTO
- query params
- domain model
- pagination/common response

`src/api`는 service 함수만 관리합니다. React Query hook은 `src/hooks/queries`에서 관리합니다. 서버 응답 타입이 바뀌면 먼저 `src/types`를 수정하고, 필요한 경우 `src/api`에서 mapper를 추가합니다.

## Common Response

```ts
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}

interface PagedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}
```

## Auth

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/auth/login` | 로그인 |
| `POST` | `/auth/signup` | 회원가입 |
| `POST` | `/auth/logout` | 로그아웃 |
| `GET` | `/auth/me` | 현재 사용자 |
| `POST` | `/auth/refresh` | 토큰 갱신 |

### Login Request

```ts
interface LoginDto {
  email: string;
  password: string;
}
```

### Login Response

```ts
interface LoginResponse {
  accessToken: string;
  user: AuthUser;
}
```

## Users

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/users` | 사용자 목록 |
| `POST` | `/users` | 사용자 생성 |
| `GET` | `/users/:id` | 사용자 상세 |
| `PATCH` | `/users/:id` | 사용자 수정 |
| `DELETE` | `/users/:id` | 사용자 삭제 |

### Permission

| Feature | Roles |
| --- | --- |
| 사용자 목록/상세 조회 | `admin`, `manager` |
| 사용자 권한/상태 수정 | `admin` |
| 사용자 삭제 | `admin` |

## Content

게시판, 공지사항, 질의, Q&A는 동일한 CRUD 구조를 사용합니다.

| Kind | List Endpoint |
| --- | --- |
| 게시판 | `/boards` |
| 공지사항 | `/notices` |
| 질의 | `/inquiries` |
| Q&A | `/qnas` |

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/{resource}` | 목록 |
| `POST` | `/{resource}` | 생성 |
| `GET` | `/{resource}/:id` | 상세 |
| `PATCH` | `/{resource}/:id` | 수정 |
| `DELETE` | `/{resource}/:id` | 삭제 |

### Content Item

```ts
interface ContentItem {
  id: number;
  kind: "board" | "notice" | "inquiry" | "qna";
  title: string;
  content: string;
  authorName: string;
  status: "draft" | "published" | "answered" | "closed";
  category?: string;
  isPinned?: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}
```

## Comments

댓글 API는 콘텐츠 API와 분리합니다. 실제 API로 교체할 때는 `src/api/comments.api.ts`의 service만 서버 스펙에 맞추면 됩니다.

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/{resource}/:id/comments` | 댓글 목록 |
| `POST` | `/{resource}/:id/comments` | 댓글 작성 |
| `POST` | `/{resource}/:id/comments/:commentId/replies` | 대댓글 작성 |
| `PATCH` | `/{resource}/:id/comments/:commentId` | 댓글/대댓글 수정 |
| `DELETE` | `/{resource}/:id/comments/:commentId` | 댓글/대댓글 삭제 |

공지사항은 댓글은 허용하지만 대댓글 작성 UI를 비활성화합니다. API handler는 준비되어 있으므로 정책이 바뀌면 `content-meta.ts`의 `allowReplies`만 변경합니다.

### Comment Item

```ts
interface ContentComment {
  id: number;
  contentId: number;
  parentId?: number;
  authorId: number;
  authorName: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  replies?: ContentComment[];
}
```

## Real API Switching Checklist

1. `.env`에서 `NEXT_PUBLIC_USE_MOCK_API=false` 설정
2. `NEXT_PUBLIC_API_BASE_URL`을 실제 API 주소로 변경
3. `src/api/*.api.ts` endpoint 확인
4. `src/types` request/response 타입 확인
5. 인증 쿠키명과 token 저장 방식 확인
6. 에러 response 형식 확인
