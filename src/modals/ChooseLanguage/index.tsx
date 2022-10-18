// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Title } from 'library/Modal/Title';
import { useTranslation } from 'react-i18next';
import { availableLanguages } from 'locale';
import { useModal } from 'contexts/Modal';
import { ReactComponent as LanguageSVG } from 'img/language.svg';
import { PaddingWrapper } from '../Wrappers';
import { ContentWrapper, LocaleButton } from './Wrapper';

export const ChooseLanguage = () => {
  const { i18n, t } = useTranslation(['common', 'pages', 'help']);
  const { setStatus } = useModal();
  return (
    <>
      <Title title={t('modals.choose_language')} Svg={LanguageSVG} />
      <PaddingWrapper>
        <ContentWrapper>
          <div className="item">
            {availableLanguages.map((l: string, i: number) => (
              <h3 key={`${l}_{i}`}>
                <LocaleButton
                  connected={i18n.resolvedLanguage === l}
                  type="button"
                  onClick={() => {
                    i18n.changeLanguage(l);
                    setStatus(2);
                    localStorage.setItem('locale', l);
                  }}
                >
                  {availableLanguages[i].toUpperCase()}
                  {i18n.resolvedLanguage === l && (
                    <h4 className="selected">{t('modals.selected')}</h4>
                  )}
                </LocaleButton>
              </h3>
            ))}
          </div>
        </ContentWrapper>
      </PaddingWrapper>
    </>
  );
};
