# Content Pages

게시판, 공지사항, 질의, Q&A는 같은 `ContentListPage`를 재사용합니다.

## Routes

| Route | Kind | API Resource |
| --- | --- | --- |
| `/boards` | `board` | `/boards` |
| `/notices` | `notice` | `/notices` |
| `/inquiries` | `inquiry` | `/inquiries` |
| `/qna` | `qna` | `/qnas` |

상세와 수정은 페이지 이동 방식입니다.

| Route Pattern | Description |
| --- | --- |
| `/{resource}` | 목록 |
| `/{resource}/:id` | 상세보기 |
| `/{resource}/:id/edit` | 수정 |

## Features

- 목록 조회
- 검색
- 페이지네이션
- 작성
- 상세 보기: 페이지 이동
- 수정: 페이지 이동
- 삭제
- 상단 고정
- 상태 관리: 임시저장, 게시, 답변완료, 종료
- 댓글
- 대댓글: 게시판, 질의, Q&A 허용 / 공지사항 비활성

## API Files

- `src/api/content.api.ts`
- `src/api/comments.api.ts`
- `src/types/content.ts`
- `src/mocks/content.mock.ts`
- `src/mocks/content-comments.mock.ts`
- `src/mocks/mock-api.ts`

## Real API Notes

서버에서 resource 이름이 다르면 `content.api.ts`의 `contentPath`만 우선 수정합니다.

응답 구조가 다르면 `ContentItem`, `PagedResponse` 타입과 service return mapper를 조정합니다.
