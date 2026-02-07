import type { Template } from '../types';

// templates.json을 TypeScript로 import
import templatesJson from './templates.json';

export const TEMPLATES: Template[] = templatesJson as Template[];

// 타입별 템플릿 필터링
export const getTemplatesByType = (type: string) => {
  return TEMPLATES.filter(template => template.type === type);
};

// 프리미엄/무료 필터링
export const getFreeTemplates = () => {
  return TEMPLATES.filter(template => !template.isPremium);
};

export const getPremiumTemplates = () => {
  return TEMPLATES.filter(template => template.isPremium);
};

// ID로 템플릿 찾기
export const getTemplateById = (id: string) => {
  return TEMPLATES.find(template => template.id === id);
};

// 통계
export const getTemplateStats = () => {
  return {
    total: TEMPLATES.length,
    free: getFreeTemplates().length,
    premium: getPremiumTemplates().length,
    byType: {
      wedding: getTemplatesByType('wedding').length,
      doljanchi: getTemplatesByType('doljanchi').length,
      birthday: getTemplatesByType('birthday').length,
      housewarming: getTemplatesByType('housewarming').length,
      hwangap: getTemplatesByType('hwangap').length,
      general: getTemplatesByType('general').length,
    },
  };
};
