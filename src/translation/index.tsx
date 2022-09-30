// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import i18next from 'i18next';
import { useTranslation, initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import cn from './cn/page.json';
import en from './en/page.json';

i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    interpolation: { escapeValue: false },
    lng: 'en',
    fallbackLng: 'en',
    debug: true,
    resources: {
      en: {
        common: en,
      },
      cn: {
        common: cn,
      },
    },
  });

export const TranslationButtons = () => {
  const { i18n } = useTranslation('common');
  return (
    <>
      {i18n.resolvedLanguage === 'en' ? (
        <button type="button" onClick={() => i18n.changeLanguage('cn')}>
          CN
        </button>
      ) : (
        <button type="button" onClick={() => i18n.changeLanguage('en')}>
          EN
        </button>
      )}
    </>
  );
};

export default i18next;
