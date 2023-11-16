// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useTranslation } from 'react-i18next';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { useStaking } from 'contexts/Staking';
import { useUi } from 'contexts/UI';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts';
import { Account } from '../Account/Default';
import { Account as PoolAccount } from '../Account/Pool';
import { HeadingWrapper } from './Wrappers';

export const Connected = () => {
  const { t } = useTranslation('library');
  const { isNetworkSyncing } = useUi();
  const { isNominating } = useStaking();
  const { selectedActivePool } = useActivePools();
  const { accountHasSigner } = useImportedAccounts();
  const { activeAccount, activeProxy } = useActiveAccounts();

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
            />
          </HeadingWrapper>

          {/* pool account display / hide if not in pool */}
          {selectedActivePool !== null && !isNetworkSyncing && (
            <HeadingWrapper>
              <PoolAccount
                format="name"
                value={poolAddress}
                pool={selectedActivePool}
                label={t('pool')}
                canClick={false}
                onClick={() => {}}
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
              />
            </HeadingWrapper>
          )}
        </>
      )}
    </>
  );
};
