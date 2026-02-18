import { Loader2Icon } from 'lucide-react';
import { Suspense } from 'react';

import InvitePreviewPageClient from './InvitePreviewPageClient';

const LoadingFallback = () => {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg items-center justify-center gap-2 text-sm text-muted-foreground">
      <Loader2Icon className="size-4 animate-spin" />
      초대장 미리보기 화면을 불러오는 중입니다...
    </div>
  );
};

export default function InvitePreviewPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <InvitePreviewPageClient />
    </Suspense>
  );
}
