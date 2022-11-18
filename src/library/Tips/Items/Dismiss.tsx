// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {
  ButtonPrimary,
  ButtonSecondary,
} from '@rossbulat/polkadot-dashboard-ui';
import { useTips } from 'contexts/Tips';
import { useUi } from 'contexts/UI';
import { useTranslation } from 'react-i18next';
import { TipWrapper } from '../Wrappers';

export const Dismiss = () => {
  const { closeTip } = useTips();
  const { toggleService } = useUi();
  const { t } = useTranslation('common');
  return (
    <TipWrapper>
      <div>
        <h1>{t('library.dismiss_tips')}</h1>
      </div>
      <div>
        <h4>{t('library.dismiss_result')}</h4>
        <h4>{t('library.re-enable')}</h4>
        <div className="buttons">
          <ButtonPrimary
            marginRight
            text={t('library.disable_dashboard_tips')}
            onClick={() => {
              toggleService('tips');
              closeTip();
            }}
          />
          <ButtonSecondary
            text={t('library.cancel')}
            onClick={() => closeTip()}
          />
        </div>
      </div>
    </TipWrapper>
  );
};
