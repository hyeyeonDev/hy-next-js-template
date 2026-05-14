# User Pages

사용자 관리는 가입된 사용자 목록과 정보를 확인하고, 관리자 권한으로 권한/상태를 수정하는 화면입니다.

## Routes

| Route | Description | Roles |
| --- | --- | --- |
| `/users` | 사용자 목록 | `admin`, `manager` |
| `/users/:id` | 사용자 상세 | `admin`, `manager` |
| `/users/:id/edit` | 사용자 수정 | `admin` |

## Features

- 사용자 목록 조회
- 이름/이메일 검색
- 페이지네이션
- 사용자 상세 정보 확인
- 관리자 전용 이름, 권한, 상태 수정
- 관리자 전용 사용자 삭제

## API Files

- `src/api/user.api.ts`
- `src/types/user.ts`
- `src/mocks/users.mock.ts`
- `src/mocks/mock-api.ts`

## Permission Rule

- `manager`는 사용자 목록과 상세를 볼 수 있습니다.
- `admin`은 사용자 권한, 상태 수정과 삭제를 할 수 있습니다.
- 일반 `user`는 사용자 관리 화면에 접근할 수 없습니다.
