// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { availableLanguages } from 'locale';
import { changeLanguage } from 'locale/utils';
import { useTranslation } from 'react-i18next';
import { extractUrlValue } from 'Utils';

export const useUrlVars = () => {
  const { i18n } = useTranslation();

  const initialise = () => {
    const lngFromUrl = extractUrlValue('l');

    if (availableLanguages.find((n: any) => n[0] === lngFromUrl)) {
      changeLanguage(lngFromUrl as string, i18n);
    }
  };
  return { initialise };
};
