// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { clipAddress } from '@polkadotcloud/utils';
import { useBalances } from 'contexts/Accounts/Balances';
import { useConnect } from 'contexts/Connect';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { useStaking } from 'contexts/Staking';
import { useUi } from 'contexts/UI';
import { PoolAccount } from 'library/PoolAccount';
import { useTranslation } from 'react-i18next';
import { Account } from '../Account';
import { HeadingWrapper } from './Wrappers';

export const Connected = () => {
  const { t } = useTranslation('library');
  const { activeAccount, accountHasSigner } = useConnect();
  const { hasController, getControllerNotImported } = useStaking();
  const { getBondedAccount } = useBalances();
  const controller = getBondedAccount(activeAccount);
  const { selectedActivePool } = useActivePools();
  const { isNetworkSyncing } = useUi();

  let poolAddress = '';
  if (selectedActivePool) {
    const { addresses } = selectedActivePool;
    poolAddress = addresses.stash;
  }

  const activeAccountLabel = isNetworkSyncing
    ? undefined
    : hasController()
    ? controller !== activeAccount
      ? 'Stash'
      : t('nominator')
    : undefined;

  return (
    <>
      {activeAccount ? (
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
          {hasController() &&
          controller !== activeAccount &&
          !isNetworkSyncing ? (
            <HeadingWrapper>
              <Account
                value={controller ?? ''}
                readOnly={!accountHasSigner(controller)}
                title={
                  getControllerNotImported(controller)
                    ? controller
                      ? clipAddress(controller)
                      : `${t('notImported')}`
                    : undefined
                }
                format="name"
                label="Controller"
                canClick={false}
                filled
              />
            </HeadingWrapper>
          ) : null}

          {/* pool account display / hide if not in pool */}
          {selectedActivePool !== null && !isNetworkSyncing && (
            <HeadingWrapper>
              <PoolAccount
                value={poolAddress}
                pool={selectedActivePool}
                label={`${t('pool')}`}
                canClick={false}
                onClick={() => {}}
                filled
              />
            </HeadingWrapper>
          )}
        </>
      ) : null}
    </>
  );
};
