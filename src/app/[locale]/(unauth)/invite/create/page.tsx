import { Loader2Icon } from 'lucide-react';
import { Suspense } from 'react';

import InviteCreatePageClient from './CreateInvitePageClient';

const LoadingFallback = () => {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg items-center justify-center gap-2 text-sm text-muted-foreground">
      <Loader2Icon className="size-4 animate-spin" />
      초대장 작성 화면을 불러오는 중입니다...
    </div>
  );
};

export default function InviteCreatePage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <InviteCreatePageClient />
    </Suspense>
  );
}
