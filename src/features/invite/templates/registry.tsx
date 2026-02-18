import { BananaTemplate } from './BananaTemplate';
import { DefaultTemplate } from './DefaultTemplate';
import type { InviteTemplateProps } from './types';

export const TemplateRegistry: Record<string, React.ComponentType<InviteTemplateProps>> = {
  default: DefaultTemplate,
  banana: BananaTemplate,
};

export const getTemplateComponent = (templateId: string) => {
  return TemplateRegistry[templateId] || DefaultTemplate;
};
