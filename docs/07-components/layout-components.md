# Layout Components

페이지 공통 골격을 구성하는 컴포넌트입니다.

| Component | Description |
| --- | --- |
| `Container` | 화면 최대 폭과 좌우 여백을 관리 |
| `Header` / `Topbar` | 상단 타이틀과 액션 영역 |
| `Footer` | 하단 정보 영역 |
| `MainLayout` | 사이드바, 상단바, 본문, 푸터를 조합하는 앱 레이아웃 |
| `PageWrapper` | 페이지 제목, 설명, 액션, 본문 간격 관리 |
| `Section` | 페이지 내부 섹션 제목, 설명, 액션, 본문 관리 |
| `Sidebar` | 좌측 메뉴, 로고, 푸터 영역 |

## Usage

```tsx
<MainLayout
  sidebar={{
    logo: <Logo />,
    items,
  }}
  topbar={<Header title="대시보드" actions={<Actions />} />}
>
  <PageWrapper title="대시보드" description="운영 현황을 확인합니다.">
    <Section title="주요 지표">...</Section>
  </PageWrapper>
</MainLayout>
```

## Notes

- 업무형 페이지는 `MainLayout + PageWrapper + Section` 조합을 기본으로 사용합니다.
- 단순 공개 페이지는 `Container`만 사용해도 됩니다.
- 메뉴 active 처리는 `Sidebar`가 현재 pathname을 기준으로 자동 처리합니다.
