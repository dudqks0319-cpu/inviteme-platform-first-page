import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

import type { Template } from '../types';

type TemplateCardProps = {
  template: Template;
  onSelect: (templateId: string) => void;
  isSelected?: boolean;
};

export function TemplateCard({ template, onSelect, isSelected = false }: TemplateCardProps) {
  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-lg ${
        isSelected ? 'ring-2 ring-primary' : ''
      }`}
      style={{
        backgroundColor: template.backgroundColor,
        borderColor: template.primaryColor,
      }}
      onClick={() => onSelect(template.id)}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle
            className="text-lg font-bold"
            style={{ color: template.primaryColor }}
          >
            {template.name}
          </CardTitle>
          {template.isPremium && (
            <Badge variant="default" className="bg-amber-500 hover:bg-amber-600">
              프리미엄
            </Badge>
          )}
        </div>
        <CardDescription>{template.description}</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">스타일:</span>
            <Badge variant="outline">{template.style}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">폰트:</span>
            <span className="font-medium" style={{ fontFamily: template.fontFamily }}>
              {template.fontFamily}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button
          variant={isSelected ? 'default' : 'outline'}
          className="w-full"
          style={
            isSelected
              ? { backgroundColor: template.primaryColor }
              : { borderColor: template.primaryColor, color: template.primaryColor }
          }
        >
          {isSelected ? '선택됨' : '선택하기'}
        </Button>
      </CardFooter>
    </Card>
  );
}
