// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { isSupportedProxy } from 'config/proxies';
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts';
import { AccountButton } from '../Account';
import { DelegatesWrapper } from './Wrapper';
import type { DelegatesProps } from '../types';

export const Delegates = ({ delegates, delegator }: DelegatesProps) => {
  const { accounts } = useImportedAccounts();
  const { getAccount } = useImportedAccounts();

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
        <DelegatesWrapper>
          {delegatesList.map(({ delegate, proxyType }, i) => (
            <AccountButton
              key={`_del_${i}`}
              address={delegate}
              delegator={delegator}
              proxyType={proxyType}
            />
          ))}
        </DelegatesWrapper>
      ) : null}
    </>
  );
};
