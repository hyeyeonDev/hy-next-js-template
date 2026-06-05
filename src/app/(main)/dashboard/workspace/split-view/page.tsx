import Link from "next/link";

import { SplitViewSample } from "@/components/features/dashboard/WorkspaceSamples";
import { PageWrapper } from "@/components/layout";
import { Button } from "@/components/ui";
import { ROUTES } from "@/constants/routes";

export default function DashboardSplitViewSamplePage() {
  return (
    <PageWrapper
      title="리사이즈 스플릿 뷰"
      description="목록과 상세 화면의 영역 크기를 직접 조절해서 확인하는 샘플입니다."
      actions={
        <Link href={`${ROUTES.STORYBOOK}#workspace-ui`}>
          <Button size="sm" variant="outline">
            컴포넌트 모음 보기
          </Button>
        </Link>
      }
    >
      <SplitViewSample />
    </PageWrapper>
  );
}
