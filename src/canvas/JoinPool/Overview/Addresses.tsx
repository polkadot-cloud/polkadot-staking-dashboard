// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { CardWrapper } from 'library/Card/Wrappers';
import { AddressesWrapper, HeadingWrapper } from '../Wrappers';
import { AddressSection } from './AddressSection';
import type { OverviewSectionProps } from '../types';
import { useTranslation } from 'react-i18next';

export const Addresses = ({
  bondedPool: { addresses },
}: OverviewSectionProps) => {
  const { t } = useTranslation('library');

  return (
    <CardWrapper className="canvas secondary">
      <HeadingWrapper>
        <h3>{t('poolAddresses')}</h3>
      </HeadingWrapper>

      <AddressesWrapper>
        <AddressSection address={addresses.stash} label="Stash" />
        <AddressSection address={addresses.reward} label="Reward" />
      </AddressesWrapper>
    </CardWrapper>
  );
};
