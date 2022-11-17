// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { DefaultLocale } from 'consts';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { loadDefault } from './default';

const localLng = localStorage.getItem('lng');
const lng = localLng ?? DefaultLocale;

if (!localLng) {
  localStorage.setItem('lng', DefaultLocale);
}

// configure i18n object.
i18next.use(initReactI18next).init({
  debug: process.env.REACT_APP_DEBUG_I18N === '1',
  fallbackLng: DefaultLocale,
  lng,
});

// load the default lanuage.
(async () => {
  const {
    key,
    value: { pages, help },
  } = await loadDefault();

  i18next.addResourceBundle(key, 'pages', pages);
  i18next.addResourceBundle(key, 'help', help);

  if (key !== i18next.resolvedLanguage) {
    i18next.changeLanguage(key);
  }
})();

// export i18next for context.
export { i18next };
