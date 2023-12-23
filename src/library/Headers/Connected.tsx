// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useTranslation } from 'react-i18next';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { useStaking } from 'contexts/Staking';
import { useUi } from 'contexts/UI';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts';
import { useBondedPools } from 'contexts/Pools/BondedPools';
import DefaultAccount from '../Account/DefaultAccount';
import PoolAccount from '../Account/PoolAccount';
import { HeadingWrapper } from './Wrappers';

export const Connected = () => {
  const { t } = useTranslation('library');
  const { isNetworkSyncing } = useUi();
  const { isNominating } = useStaking();
  const { poolsMetaData } = useBondedPools();
  const { selectedActivePool } = useActivePools();
  const { accountHasSigner } = useImportedAccounts();
  const { activeAccount, activeProxy } = useActiveAccounts();

  return (
    activeAccount && (
      <>
        {/* Default account display / stash label if actively nominating. */}
        <HeadingWrapper>
          <DefaultAccount
            value={activeAccount}
            label={
              isNetworkSyncing
                ? undefined
                : isNominating()
                  ? 'Nominator'
                  : undefined
            }
            readOnly={!accountHasSigner(activeAccount)}
          />
        </HeadingWrapper>

        {/* Pool account display / hide if not in pool or if syncing. */}
        {selectedActivePool !== null && !isNetworkSyncing && (
          <HeadingWrapper>
            <PoolAccount
              label={t('pool')}
              pool={selectedActivePool}
              syncing={!Object.values(poolsMetaData).length}
            />
          </HeadingWrapper>
        )}

        {/* Proxy account display / hide if no proxy. */}
        {activeProxy && (
          <HeadingWrapper>
            <DefaultAccount
              value={activeProxy}
              label={t('proxy')}
              readOnly={!accountHasSigner(activeProxy)}
            />
          </HeadingWrapper>
        )}
      </>
    )
  );
};
