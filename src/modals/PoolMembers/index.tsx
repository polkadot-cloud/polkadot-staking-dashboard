// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ModalPadding, ModalSeparator } from '@polkadot-cloud/react';
import { Close } from 'library/Modal/Close';
import { Members } from 'pages/Pools/Home/Members';

export const PoolMembers = () => (
  // const { t } = useTranslation('modals');

  <>
    <Close />
    <ModalPadding>
      <h2 className="title unbounded">Pool Members</h2>
      <ModalSeparator />
      <Members />
    </ModalPadding>
  </>
);
