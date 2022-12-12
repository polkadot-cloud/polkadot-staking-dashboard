// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Title } from 'library/Modal/Title';
import { useTranslation } from 'react-i18next';
import { PaddingWrapper } from '../Wrappers';

const lngs: any = {
  en: { Name: 'EN' },
  cn: { Name: 'CN' },
};

export const Languages = () => {
  const { i18n } = useTranslation();

  return (
    <>
      <Title title="Toggle Languages" />
      <PaddingWrapper>
        {Object.keys(lngs).map((lng) => (
          <h3>
            <button
              key={lng}
              style={{
                fontWeight: i18n.resolvedLanguage === lng ? 'bold' : 'normal',
              }}
              type="submit"
              onClick={() => i18n.changeLanguage(lng)}
            >
              {lngs[lng].Name}
            </button>
          </h3>
        ))}
      </PaddingWrapper>
    </>
  );
};
