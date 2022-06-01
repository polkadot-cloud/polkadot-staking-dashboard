// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useUi } from 'contexts/UI';
import { StatusButton } from 'library/StatusButton';
import { PaddingWrapper } from '../Wrappers';

export const Settings = () => {
  const { services, toggleService } = useUi();

  return (
    <PaddingWrapper>
      <h2>Toggle Services</h2>
      <StatusButton
        checked={services.includes('subscan')}
        label="Subscan API"
        onClick={() => {
          toggleService('subscan');
        }}
      />
      <StatusButton
        checked={services.includes('binance_spot')}
        label="Binance Spot API"
        onClick={() => {
          toggleService('binance_spot');
        }}
      />
    </PaddingWrapper>
  );
};

export default Settings;
