// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ProxyDelegate } from 'contexts/Accounts/Proxies/type';
import { useConnect } from 'contexts/Connect';
import { AccountButton } from './Account';
import { AccountGroupWrapper } from './Wrappers';
import type { DelegatesProps } from './types';

export const Delegates = ({ delegates, delegator }: DelegatesProps) => {
  const { getAccount } = useConnect();
  const delegatesList = delegates?.delegates || [];

  return (
    <>
      {delegatesList.length ? (
        <AccountGroupWrapper>
          {delegatesList.map(({ delegate, proxyType }: ProxyDelegate) => {
            return (
              <AccountButton
                key={`_del_${delegator}_${delegate}`}
                address={delegate}
                meta={getAccount(delegate)}
                badge={`${proxyType} Proxy`}
              />
            );
          })}
        </AccountGroupWrapper>
      ) : null}
    </>
  );
};
