# Dashboard

## `/dashboard`

- 목적: 서비스 운영 현황 확인
- 접근: Private
- 주요 UI:
  - 통계 카드
  - ECharts 기반 방문/가입 추이 차트
  - ECharts 기반 콘텐츠 처리량 차트
  - 게시판/공지사항/질의/Q&A 바로가기
  - 최근 활동 로그
  - 로그아웃

## API

현재는 mock/static 데이터로 표시합니다. 실제 API 연결 시 대시보드 통계 endpoint를 추가합니다.

예상 endpoint:

- `GET /dashboard/summary`
- `GET /dashboard/logs`

## Notes

운영 화면의 시작점이므로 신규 관리 메뉴가 생기면 대시보드 사이드바와 바로가기 카드에 함께 반영합니다.
