import Link from "next/link";

import { BrowserTabsSample } from "@/components/features/dashboard/WorkspaceSamples";
import { PageWrapper } from "@/components/layout";
import { Button } from "@/components/ui";
import { ROUTES } from "@/constants/routes";

export default function DashboardBrowserTabsSamplePage() {
  return (
    <PageWrapper
      title="브라우저 탭 워크스페이스"
      description="브라우저 창처럼 여러 작업 화면을 탭으로 전환하는 샘플입니다."
      actions={
        <Link href={`${ROUTES.STORYBOOK}#workspace-ui`}>
          <Button size="sm" variant="outline">
            컴포넌트 모음 보기
          </Button>
        </Link>
      }
    >
      <BrowserTabsSample />
    </PageWrapper>
  );
}
