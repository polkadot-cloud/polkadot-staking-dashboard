// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import MailSVG from 'img/mail.svg?react';
import { Title } from 'library/Modal/Title';
import { ModalPadding } from 'kits/Overlay/structure/ModalPadding';
import { MailSupportAddress } from 'consts';
import { SupportWrapper } from './Wrapper';
import { useTranslation } from 'react-i18next';

export const MailSupport = () => {
  const { t } = useTranslation('modals');
  return (
    <>
      <Title />
      <ModalPadding verticalOnly>
        <SupportWrapper>
          <MailSVG />
          <h4>{t('supportEmail')}</h4>
          <h1>{MailSupportAddress}</h1>
        </SupportWrapper>
      </ModalPadding>
    </>
  );
};
