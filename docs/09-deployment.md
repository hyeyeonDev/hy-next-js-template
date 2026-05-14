# 09. Deployment

## Build

```bash
npm run build
```

## Start

```bash
npm run start
```

## Required Environment Variables

```bash
NEXT_PUBLIC_USE_MOCK_API=false
NEXT_PUBLIC_API_BASE_URL=https://api.example.com
NEXT_PUBLIC_APP_ENV=production
APP_ENABLED_FEATURES=dashboard,mypage,notices,inquiries,qna
NEXT_PUBLIC_ENABLED_FEATURES=dashboard,mypage,notices,inquiries,qna
```

필요 시 외부 API key를 추가합니다.

```bash
NEXT_PUBLIC_KAKAO_MAP_KEY=
```

## Pre-deployment Checklist

- `npm run build` 통과
- `npm run lint` 확인
- `APP_ENABLED_FEATURES`, `NEXT_PUBLIC_ENABLED_FEATURES`에 배포할 메뉴만 포함했는지 확인
- 로그인/회원가입/로그아웃 확인
- 보호 라우트 redirect 확인
- 게시판/공지/질의/Q&A 목록, 작성, 수정, 삭제 확인
- API 오류, 네트워크 오류, 렌더링 오류 화면 확인
- 라이트/다크 모드 확인
- mock API 비활성화 확인

## Runtime Notes

- Next.js 16에서는 보호 라우트 처리를 `src/proxy.ts`에서 관리합니다.
- `NEXT_PUBLIC_APP_ENV=local` 또는 개발 서버에서는 모든 메뉴와 페이지가 열립니다.
- 배포 환경에서는 `NEXT_PUBLIC_ENABLED_FEATURES`에 등록되지 않은 기능이 사이드바에서 숨겨지고, `APP_ENABLED_FEATURES`에 등록되지 않은 기능의 직접 URL 접근은 404로 차단됩니다.
- feature key는 `src/lib/feature-flags.ts`에서 관리합니다.
- 쿠키 기반 인증을 사용할 경우 서버와 프론트의 쿠키 이름, domain, SameSite, secure 옵션을 배포 환경에 맞춰 조정해야 합니다.
- 실제 API가 httpOnly cookie를 발급한다면 클라이언트에서 `document.cookie`로 토큰을 저장하는 mock 흐름은 제거해야 합니다.
