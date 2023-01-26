// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ButtonSubmit } from '@rossbulat/polkadot-dashboard-ui';
import { useModal } from 'contexts/Modal';
import { useUi } from 'contexts/UI';
import { Title } from 'library/Modal/Title';
import { PaddingWrapper } from 'modals/Wrappers';
import { useTranslation } from 'react-i18next';

export const DismissTips = () => {
  const { toggleService } = useUi();
  const { setStatus } = useModal();
  const { t } = useTranslation('tips');

  return (
    <>
      <Title title={t('module.dismissTips')} />
      <PaddingWrapper horizontalOnly>
        <div
          style={{
            padding: '0 0.5rem 1.25rem 0.5rem',
            width: '100%',
          }}
        >
          <div>
            <h4>{t('module.dismissResult')}</h4>
            <h4>{t('module.reEnable')}</h4>
          </div>
          <div className="buttons">
            <ButtonSubmit
              marginRight
              text={t('module.disableDashboardTips')}
              onClick={() => {
                toggleService('tips');
                setStatus(2);
              }}
            />
          </div>
        </div>
      </PaddingWrapper>
    </>
  );
};
