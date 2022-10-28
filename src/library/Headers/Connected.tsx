// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useBalances } from 'contexts/Balances';
import { useConnect } from 'contexts/Connect';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { useStaking } from 'contexts/Staking';
import { useUi } from 'contexts/UI';
import { PoolAccount } from 'library/PoolAccount';
import { clipAddress } from 'Utils';
import { useTranslation } from 'react-i18next';
import { Account } from '../Account';
import { HeadingWrapper } from './Wrappers';

export const Connected = () => {
  const { activeAccount, accountHasSigner } = useConnect();
  const { hasController, getControllerNotImported } = useStaking();
  const { getBondedAccount } = useBalances();
  const controller = getBondedAccount(activeAccount);
  const { selectedActivePool } = useActivePools();
  const { networkSyncing } = useUi();
  const { t } = useTranslation('common');

  let poolAddress = '';
  if (selectedActivePool) {
    const { addresses } = selectedActivePool;
    poolAddress = addresses.stash;
  }

  const activeAccountLabel = networkSyncing
    ? undefined
    : hasController()
    ? 'Stash'
    : undefined;

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
              label={activeAccountLabel}
              format="name"
              filled
            />
          </HeadingWrapper>

          {/* controller account display / hide if no controller present */}
          {hasController() && !networkSyncing && (
            <HeadingWrapper>
              <Account
                value={controller ?? ''}
                readOnly={!accountHasSigner(controller)}
                title={
                  getControllerNotImported(controller)
                    ? controller
                      ? clipAddress(controller)
                      : t('library.not_imported')
                    : undefined
                }
                format="name"
                label="Controller"
                canClick={false}
                filled
              />
            </HeadingWrapper>
          )}

          {/* pool account display / hide if not in pool */}
          {selectedActivePool !== null && !networkSyncing && (
            <HeadingWrapper>
              <PoolAccount
                value={poolAddress}
                pool={selectedActivePool}
                label={t('library.pool')}
                canClick={false}
                onClick={() => {}}
                filled
              />
            </HeadingWrapper>
          )}
        </>
      )}
    </>
  );
};
