// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import MailSVG from 'img/mail.svg?react';
import { Title } from 'library/Modal/Title';
import { ModalPadding } from 'kits/Overlay/structure/ModalPadding';
import { MailSupportAddress } from 'consts';
import { SupportWrapper } from './Wrapper';

export const MailSupport = () => (
  <>
    <Title />
    <ModalPadding verticalOnly>
      <SupportWrapper>
        <MailSVG />
        <h4>
          We provide dedicated email support for Staking Dashboard users.
          Contact us, and our team will strive to respond promptly to assist
          you.
        </h4>
        <h1>{MailSupportAddress}</h1>
      </SupportWrapper>
    </ModalPadding>
  </>
);
