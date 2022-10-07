// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import i18next from 'i18next';
import { useTranslation, initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import commoncn from './cn/common.json';
import commonen from './en/common.json';
import pagescn from './cn/pages.json';
import pagesen from './en/pages.json';

// context object
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
        common: commonen,
        pages: pagesen,
      },
      cn: {
        common: commoncn,
        pages: pagescn,
      },
    },
  });

// TODO: change into one icon that opens a modal.
export const LanguageButton = () => {
  const { i18n } = useTranslation(['common', 'pages']);
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
