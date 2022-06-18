// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { PoolAccount } from 'library/PoolAccount';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { useStaking } from 'contexts/Staking';
import { useBalances } from 'contexts/Balances';
import { useActivePool } from 'contexts/Pools/ActivePool';
import { useUi } from 'contexts/UI';
import { ConnectContextInterface } from 'types/connect';
import { ActivePoolContextState } from 'types/pools';
import { BalancesContextInterface } from 'types/balances';
import { StakingContextInterface } from 'types/staking';
import { Account } from '../Account';
import { HeadingWrapper } from './Wrappers';

export const Connected = () => {
  const { activeAccount, accounts } = useConnect() as ConnectContextInterface;
  const { openModalWith } = useModal();
  const { hasController, getControllerNotImported } =
    useStaking() as StakingContextInterface;
  const { getBondedAccount } = useBalances() as BalancesContextInterface;
  const controller = getBondedAccount(activeAccount);
  const { activeBondedPool } = useActivePool() as ActivePoolContextState;
  const { isSyncing } = useUi();

  let poolAddress = '';
  if (activeBondedPool !== undefined) {
    const { addresses } = activeBondedPool;
    poolAddress = addresses.stash;
  }

  const activeAccountLabel = `${hasController() && !isSyncing ? 'Stash' : ''}`;

  return (
    <>
      {activeAccount && (
        <>
          {/* default account display / stash label if actively nominating */}
          <HeadingWrapper>
            <Account
              canClick
              value={activeAccount}
              label={activeAccountLabel}
              format="name"
              filled
            />
          </HeadingWrapper>

          {/* controller account display / hide if no controller present */}
          {hasController() && !isSyncing && (
            <HeadingWrapper>
              <Account
                value={controller ?? ''}
                title={
                  getControllerNotImported(controller)
                    ? 'Not Imported'
                    : undefined
                }
                format="name"
                label="Controller"
                canClick={hasController()}
                onClick={() => {
                  if (hasController()) {
                    openModalWith('UpdateController', {}, 'large');
                  }
                }}
                filled
              />
            </HeadingWrapper>
          )}

          {/* pool account display / hide if not in pool */}
          {activeBondedPool !== undefined && !isSyncing && (
            <HeadingWrapper>
              <PoolAccount
                value={poolAddress}
                title={
                  getControllerNotImported(controller)
                    ? 'Not Imported'
                    : undefined
                }
                pool={activeBondedPool}
                label="Pool"
                canClick={hasController()}
                onClick={() => {}}
                filled
              />
            </HeadingWrapper>
          )}
          <HeadingWrapper>
            <Account
              canClick
              onClick={() => {
                openModalWith(
                  'ConnectAccounts',
                  { section: accounts.length ? 1 : 0 },
                  'large'
                );
              }}
              value="Accounts"
              format="text"
              filled
              wallet
            />
          </HeadingWrapper>
        </>
      )}
    </>
  );
};
