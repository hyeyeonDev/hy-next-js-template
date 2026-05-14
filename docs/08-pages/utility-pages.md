# Utility Pages

## `/storybook`

- 목적: 공통 컴포넌트 확인
- 접근: Public
- 신규 컴포넌트 추가 시 예시를 함께 추가합니다.

## `/error-preview`

- 목적: API 오류, 네트워크 오류, 렌더링 오류 화면 확인
- 접근: Public
- QA와 기획 리뷰에서 오류 상태 확인용으로 사용합니다.

## `app/error.tsx`

- route segment 내 렌더링 오류 처리

## `app/global-error.tsx`

- 전역 렌더링 오류 처리

## `app/loading.tsx`

- 전역 loading fallback
