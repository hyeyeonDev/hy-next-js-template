import Link from "next/link";

import { FloatingMinimapSample } from "@/components/features/dashboard/WorkspaceSamples";
import { PageWrapper } from "@/components/layout";
import { Button } from "@/components/ui";
import { ROUTES } from "@/constants/routes";

export default function DashboardMinimapSamplePage() {
  return (
    <PageWrapper
      title="플로팅 미니맵"
      description="대시보드 화면 위에서 움직일 수 있는 상태 확인 패널 샘플입니다."
      actions={
        <Link href={`${ROUTES.STORYBOOK}#workspace-ui`}>
          <Button size="sm" variant="outline">
            컴포넌트 모음 보기
          </Button>
        </Link>
      }
    >
      <FloatingMinimapSample />
    </PageWrapper>
  );
}
