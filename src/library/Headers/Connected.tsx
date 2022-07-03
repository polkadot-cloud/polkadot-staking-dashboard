// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { PoolAccount } from 'library/PoolAccount';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { useStaking } from 'contexts/Staking';
import { useBalances } from 'contexts/Balances';
import { useActivePool } from 'contexts/Pools/ActivePool';
import { useUi } from 'contexts/UI';
import { clipAddress } from 'Utils';
import { Account } from '../Account';
import { HeadingWrapper } from './Wrappers';

export const Connected = () => {
  const { activeAccount, accounts, accountHasSigner } = useConnect();
  const { openModalWith } = useModal();
  const { hasController, getControllerNotImported } = useStaking();
  const { getBondedAccount } = useBalances();
  const controller = getBondedAccount(activeAccount);
  const { activeBondedPool } = useActivePool();
  const { isSyncing } = useUi();

  let poolAddress = '';
  if (activeBondedPool !== undefined) {
    const { addresses } = activeBondedPool;
    poolAddress = addresses.stash;
  }

  const activeAccountLabel = isSyncing
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
              canClick
              onClick={() => {
                openModalWith(
                  'ConnectAccounts',
                  { section: accounts.length ? 1 : 0 },
                  'large'
                );
              }}
              value={activeAccount}
              readOnly={!accountHasSigner(activeAccount)}
              label={activeAccountLabel}
              format="name"
              filled
              wallet
            />
          </HeadingWrapper>

          {/* controller account display / hide if no controller present */}
          {hasController() && !isSyncing && (
            <HeadingWrapper>
              <Account
                value={controller ?? ''}
                readOnly={!accountHasSigner(controller)}
                title={
                  getControllerNotImported(controller)
                    ? controller
                      ? clipAddress(controller)
                      : 'Not Imported'
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
                pool={activeBondedPool}
                label="Pool"
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
