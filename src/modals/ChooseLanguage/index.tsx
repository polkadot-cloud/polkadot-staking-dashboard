// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Title } from 'library/Modal/Title';
import { useTranslation } from 'react-i18next';
import { availableLanguages } from 'locale';
import { useModal } from 'contexts/Modal';
import { ReactComponent as LanguageSVG } from 'img/language.svg';
import { PaddingWrapper } from '../Wrappers';

export const ChooseLanguage = () => {
  const { i18n } = useTranslation(['common', 'pages', 'help']);
  const { setStatus } = useModal();
  return (
    <>
      <Title title="Choose Language" Svg={LanguageSVG} />
      <PaddingWrapper>
        {availableLanguages.map((l: string, i: number) => (
          <h3 key={`${l}_{i}`}>
            <button
              style={{
                fontWeight: i18n.resolvedLanguage === l ? 'bold' : 'normal',
              }}
              type="submit"
              onClick={() => {
                i18n.changeLanguage(l);
                setStatus(2);
                localStorage.setItem('locale', l);
              }}
            >
              {availableLanguages[i].toUpperCase()}
            </button>
          </h3>
        ))}
      </PaddingWrapper>
    </>
  );
};
