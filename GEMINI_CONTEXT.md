# 제미나이 작업 컨텍스트

## 프로젝트 정보
- 경로: /Users/jyb-m3max/Desktop/codex/InviteMe-Platform
- 기술: Next.js 14 + TypeScript + Shadcn UI
- 서버: http://localhost:3000 (실행 중)

## 작업: 초대장 생성 페이지 만들기

### 파일 생성 위치
```
src/app/[locale]/(unauth)/invite/create/page.tsx
```

### 주요 요구사항
1. URL 쿼리에서 template ID 추출
2. React Hook Form + Zod 검증
3. Shadcn UI 컴포넌트 사용
4. 실시간 미리보기
5. 타입별 동적 폼 필드

### 참고 파일들
- `src/features/invite/types/index.ts` - 타입 정의
- `src/features/invite/data/templates.ts` - 템플릿 헬퍼
- `src/components/ui/*` - Shadcn UI 컴포넌트

### 템플릿 타입별 필드

**wedding (청첩장)**:
- groomName, brideName
- eventDate, eventTime
- venueName, venueAddress
- greeting

**doljanchi (돌잔치)**:
- babyName, babyGender
- eventDate, eventTime
- venueName, venueAddress
- greeting

**birthday (생일)**:
- name, age
- eventDate, eventTime
- venueName, venueAddress
- greeting

### 예제 코드 구조

```typescript
'use client';

import { useSearchParams } from 'next/navigation';
import { getTemplateById } from '@/features/invite/data/templates';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Zod 스키마
const inviteSchema = z.object({
  // 타입별 필드 정의
});

export default function InviteCreatePage() {
  const searchParams = useSearchParams();
  const templateId = searchParams.get('template');
  const template = templateId ? getTemplateById(templateId) : null;

  const form = useForm({
    resolver: zodResolver(inviteSchema),
  });

  // 나머지 구현...
}
```

### 스타일 가이드
- Client Component: 'use client' 필수
- Tailwind CSS 사용
- 반응형: grid, flex 활용
- 색상: template.primaryColor, backgroundColor 활용
