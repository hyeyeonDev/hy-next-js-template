# Feature Components

## Auth

| Component | Description |
| --- | --- |
| `LoginForm` | 아이디/비밀번호 로그인 |
| `SignupForm` | 회원가입 |
| `AuthGuard` | 인증 필요 UI 보호 |
| `RoleGuard` | 권한별 UI 노출 제어 |

## Content

| Component | Description |
| --- | --- |
| `ContentListPage` | 게시판/공지/질의/Q&A 목록, 작성, 수정, 삭제 |
| `ContentForm` | 콘텐츠 작성/수정 폼 |
| `content-meta` | 콘텐츠 종류별 라벨, 경로, 설명 |

## Data Display

| Component | Description |
| --- | --- |
| `DataTable` | 페이지네이션과 상태 UI 포함 테이블 |
| `StatCard` | 대시보드 지표 카드 |
| `UserProfile` | 사용자 프로필 표시 |

## Guideline

기능 컴포넌트는 특정 도메인 로직을 포함할 수 있습니다. 공통 UI로 승격할 수 있는 부분은 `components/ui` 또는 `components/forms`로 분리합니다.
