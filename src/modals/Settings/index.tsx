// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useUi } from 'contexts/UI';
import { StatusButton } from 'library/StatusButton';
import { PaddingWrapper } from '../Wrappers';

export const Settings = () => {
  const { services, toggleService } = useUi();

  // fetch flag to disable fiat
  const REACT_APP_DISABLE_FIAT = process.env.REACT_APP_DISABLE_FIAT ?? false;

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
      {!REACT_APP_DISABLE_FIAT && (
        <StatusButton
          checked={services.includes('binance_spot')}
          label="Binance Spot API"
          onClick={() => {
            toggleService('binance_spot');
          }}
        />
      )}
    </PaddingWrapper>
  );
};

export default Settings;
