# Auth Pages

## `/login`

- 목적: 아이디/비밀번호 로그인
- 접근: Public
- API: `POST /auth/login`
- 성공: `next` query가 있으면 해당 경로로 이동, 없으면 `/dashboard`

## `/signup`

- 목적: 회원가입
- 접근: Public
- API: `POST /auth/signup`
- 성공: 로그인과 동일하게 token 저장 후 이동

## `/logout`

- 목적: 로그아웃 처리
- 접근: Private
- API: `POST /auth/logout`
- 성공: `access_token` 쿠키 제거 후 `/login` 이동

## 보호 라우트 흐름

1. 사용자가 보호 라우트 접근
2. `src/proxy.ts`에서 `access_token` 쿠키 확인
3. 토큰이 없으면 `/login?next=현재경로`
4. 로그인 성공 후 기존 경로 복귀
