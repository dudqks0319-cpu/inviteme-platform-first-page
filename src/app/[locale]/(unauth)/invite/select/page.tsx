'use client';

import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';

import { TemplateCard } from '@/features/invite/components/TemplateCard';
import { TEMPLATES } from '@/features/invite/data/templates';
import type { InviteType } from '@/features/invite/types';
import { getI18nPath } from '@/utils/Helpers';

const sections: Array<{ type: InviteType; title: string }> = [
  { type: 'wedding', title: '💐 청첩장' },
  { type: 'doljanchi', title: '🎂 돌잔치' },
  { type: 'birthday', title: '🎉 생일 초대장' },
  { type: 'housewarming', title: '🏠 집들이' },
  { type: 'hwangap', title: '🎊 환갑잔치' },
  { type: 'general', title: '🎈 기타 초대장' },
];

export default function TemplateSelectPage() {
  const locale = useLocale();
  const router = useRouter();

  const handleSelectTemplate = (templateId: string) => {
    const path = getI18nPath(`/invite/create?template=${templateId}`, locale);
    router.push(path);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold">초대장 템플릿 선택</h1>
        <p className="mt-2 text-muted-foreground">
          마음에 드는 템플릿을 선택하고 나만의 초대장을 만들어보세요.
        </p>
      </div>

      <div className="space-y-12">
        {sections.map(section => (
          <section key={section.type}>
            <h2 className="mb-4 text-2xl font-bold">{section.title}</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {TEMPLATES.filter(template => template.type === section.type).map(template => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onSelect={handleSelectTemplate}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
