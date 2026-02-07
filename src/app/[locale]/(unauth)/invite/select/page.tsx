'use client';

import { useRouter } from 'next/navigation';
import { TemplateCard } from '@/features/invite/components/TemplateCard';
import { TEMPLATES } from '@/features/invite/data/templates';

export default function TemplateSelectPage() {
  const router = useRouter();
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold">초대장 템플릿 선택</h1>
        <p className="mt-2 text-muted-foreground">
          마음에 드는 템플릿을 선택하고 나만의 초대장을 만들어보세요
        </p>
      </div>

      {/* 타입별 섹션 */}
      <div className="space-y-12">
        {/* 청첩장 */}
        <section>
          <h2 className="mb-4 text-2xl font-bold">💐 청첩장</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {TEMPLATES.filter(t => t.type === 'wedding').map(template => (
              <TemplateCard
                key={template.id}
                template={template}
                onSelect={(id) => {
                  // 템플릿 선택 후 생성 페이지로 이동
                  router.push(`/en/invite/create?template=${id}`);
                }}
              />
            ))}
          </div>
        </section>

        {/* 돌잔치 */}
        <section>
          <h2 className="mb-4 text-2xl font-bold">🎂 돌잔치</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {TEMPLATES.filter(t => t.type === 'doljanchi').map(template => (
              <TemplateCard
                key={template.id}
                template={template}
                onSelect={(id) => {
                  router.push(`/en/invite/create?template=${id}`);
                }}
              />
            ))}
          </div>
        </section>

        {/* 생일초대장 */}
        <section>
          <h2 className="mb-4 text-2xl font-bold">🎉 생일초대장</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {TEMPLATES.filter(t => t.type === 'birthday').map(template => (
              <TemplateCard
                key={template.id}
                template={template}
                onSelect={(id) => {
                  router.push(`/en/invite/create?template=${id}`);
                }}
              />
            ))}
          </div>
        </section>

        {/* 집들이 */}
        <section>
          <h2 className="mb-4 text-2xl font-bold">🏠 집들이</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {TEMPLATES.filter(t => t.type === 'housewarming').map(template => (
              <TemplateCard
                key={template.id}
                template={template}
                onSelect={(id) => {
                  router.push(`/en/invite/create?template=${id}`);
                }}
              />
            ))}
          </div>
        </section>

        {/* 환갑잔치 */}
        <section>
          <h2 className="mb-4 text-2xl font-bold">🎊 환갑잔치</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {TEMPLATES.filter(t => t.type === 'hwangap').map(template => (
              <TemplateCard
                key={template.id}
                template={template}
                onSelect={(id) => {
                  router.push(`/en/invite/create?template=${id}`);
                }}
              />
            ))}
          </div>
        </section>

        {/* 기타 */}
        <section>
          <h2 className="mb-4 text-2xl font-bold">🎈 기타 초대장</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {TEMPLATES.filter(t => t.type === 'general').map(template => (
              <TemplateCard
                key={template.id}
                template={template}
                onSelect={(id) => {
                  router.push(`/en/invite/create?template=${id}`);
                }}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
