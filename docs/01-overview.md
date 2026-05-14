# 01. Overview

## Purpose

DGIS Template은 업무용 웹 애플리케이션을 빠르게 시작하기 위한 Next.js 기반 프론트엔드 템플릿입니다.

초기 개발 단계에서는 mock API로 화면과 상태 흐름을 먼저 완성하고, 실제 API 스펙이 확정되면 API client와 endpoint만 교체해 사용할 수 있도록 구성합니다.

## Main Features

- 아이디/비밀번호 기반 로그인, 회원가입, 로그아웃
- 보호 라우트와 로그인 후 기존 페이지 복귀
- 대시보드
- 사용자 관리: 가입 사용자 목록, 상세, 수정, 권한/상태 관리
- 게시판, 공지사항, 질의/문의, Q&A CRUD
- 공통 UI 컴포넌트
- 폼 컴포넌트와 react-hook-form + zod 기반 validation 준비
- mock API와 React Query 기반 서버 상태 관리
- Zustand 기반 클라이언트 전역 상태 관리
- API, 네트워크, 렌더링 오류 구분 화면
- 라이트/다크 모드 디자인 토큰

## Key Routes

| Route | Description | Auth |
| --- | --- | --- |
| `/` | 홈 | Public |
| `/login` | 로그인 | Public |
| `/signup` | 회원가입 | Public |
| `/logout` | 로그아웃 처리 | Private |
| `/dashboard` | 대시보드 | Private |
| `/users` | 사용자 관리 | Private, admin/manager |
| `/users/:id` | 사용자 상세 | Private, admin/manager |
| `/users/:id/edit` | 사용자 수정 | Private, admin |
| `/boards` | 게시판 | Private |
| `/notices` | 공지사항 | Private |
| `/inquiries` | 질의/문의 | Private |
| `/qna` | Q&A | Private |
| `/storybook` | 컴포넌트 확인 | Public |
| `/error-preview` | 에러 화면 확인 | Public |

## Development Policy

- 새 공통 컴포넌트는 `/storybook`에 예시를 추가합니다.
- 새 API는 `src/api`, `src/mocks`, `src/types`, `src/constants/queryKeys.ts`를 함께 갱신합니다.
- 실제 API 연결 전까지는 mock API로 화면 흐름과 예외 상태를 먼저 검증합니다.
- 산출물 기준 문서는 README보다 `docs/`를 우선 갱신합니다.
