// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useModal } from 'contexts/Modal';
import { ReactComponent as LanguageSVG } from 'img/language.svg';
import { Title } from 'library/Modal/Title';
import { availableLanguages } from 'locale';
import { changeLanguage } from 'locale/utils';
import { useTranslation } from 'react-i18next';
import { PaddingWrapper } from '../Wrappers';
import { ContentWrapper, LocaleButton } from './Wrapper';

export const ChooseLanguage = () => {
  const { i18n, t } = useTranslation('modals');
  const { setStatus } = useModal();

  return (
    <>
      <Title title={t('chooseLanguage')} Svg={LanguageSVG} />
      <PaddingWrapper>
        <ContentWrapper>
          <div className="item">
            {availableLanguages.map((a: Array<string>, i: number) => {
              const code = a[0];
              const label = a[1];

              return (
                <h3 key={`${code}_${i}`}>
                  <LocaleButton
                    connected={i18n.resolvedLanguage === code}
                    type="button"
                    onClick={() => {
                      changeLanguage(code, i18n);
                      setStatus(2);
                    }}
                  >
                    {label}
                    {i18n.resolvedLanguage === code && (
                      <h4 className="selected">{t('selected')}</h4>
                    )}
                  </LocaleButton>
                </h3>
              );
            })}
          </div>
        </ContentWrapper>
      </PaddingWrapper>
    </>
  );
};
