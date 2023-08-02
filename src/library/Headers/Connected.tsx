// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useTranslation } from 'react-i18next';
import { useConnect } from 'contexts/Connect';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { useStaking } from 'contexts/Staking';
import { useUi } from 'contexts/UI';
import { PoolAccount } from 'library/PoolAccount';
import { Account } from '../Account';
import { HeadingWrapper } from './Wrappers';

export const Connected = () => {
  const { t } = useTranslation('library');
  const { activeAccount, activeProxy, accountHasSigner } = useConnect();
  const { isNominating } = useStaking();
  const { selectedActivePool } = useActivePools();
  const { isNetworkSyncing } = useUi();

  let poolAddress = '';
  if (selectedActivePool) {
    const { addresses } = selectedActivePool;
    poolAddress = addresses.stash;
  }

  return (
    <>
      {activeAccount && (
        <>
          {/* default account display / stash label if actively nominating */}
          <HeadingWrapper>
            <Account
              canClick={false}
              value={activeAccount}
              readOnly={!accountHasSigner(activeAccount)}
              label={
                isNetworkSyncing
                  ? undefined
                  : isNominating()
                  ? 'Nominator'
                  : undefined
              }
              format="name"
              filled
            />
          </HeadingWrapper>

          {/* pool account display / hide if not in pool */}
          {selectedActivePool !== null && !isNetworkSyncing && (
            <HeadingWrapper>
              <PoolAccount
                value={poolAddress}
                pool={selectedActivePool}
                label={t('pool')}
                canClick={false}
                onClick={() => {}}
                filled
              />
            </HeadingWrapper>
          )}

          {/* proxy account display / hide if no proxy */}
          {activeProxy && (
            <HeadingWrapper>
              <Account
                canClick={false}
                value={activeProxy}
                readOnly={!accountHasSigner(activeProxy)}
                label={t('proxy')}
                format="name"
                filled
              />
            </HeadingWrapper>
          )}
        </>
      )}
    </>
  );
};
