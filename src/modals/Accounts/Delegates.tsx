// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { isSupportedProxy } from 'config/proxies';
import { useConnect } from 'contexts/Connect';
import { AccountButton } from './Account';
import { AccountGroupWrapper } from './Wrappers';
import type { DelegatesProps } from './types';

export const Delegates = ({ delegates, delegator }: DelegatesProps) => {
  const { getAccount, accounts } = useConnect();

  // Filter delegates that are external or not imported. Default to empty array if there are no
  // delegates for this address.
  const delegatesList =
    delegates?.delegates.filter(
      ({ delegate, proxyType }) =>
        accounts.find(({ address }) => address === delegate) !== undefined &&
        isSupportedProxy(proxyType) &&
        getAccount(delegate || null)?.source !== 'external'
    ) || [];

  return (
    <>
      {delegatesList.length ? (
        <AccountGroupWrapper>
          {delegatesList.map(({ delegate, proxyType }) => (
            <AccountButton
              key={`_del_${delegator}_${delegate}`}
              address={delegate}
              delegator={delegator}
              proxyType={proxyType}
            />
          ))}
        </AccountGroupWrapper>
      ) : null}
    </>
  );
};
