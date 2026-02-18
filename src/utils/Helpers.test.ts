import { AppConfig } from './AppConfig';
import { getI18nPath } from './Helpers';

describe('Helpers', () => {
  describe('getI18nPath function', () => {
    it('should follow localePrefix rule for default language', () => {
      const url = '/random-url';
      const locale = AppConfig.defaultLocale;

      const expected = AppConfig.localePrefix === 'always'
        ? `/${locale}${url}`
        : url;

      expect(getI18nPath(url, locale)).toBe(expected);
    });

    it('should prepend the locale to the path for non-default language', () => {
      const url = '/random-url';
      const locale = 'fr';

      expect(getI18nPath(url, locale)).toMatch(/^\/fr/);
    });
  });
});
