// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { HeadingWrapper } from './Wrappers';
import { useConnect } from '../../contexts/Connect';
import { useModal } from '../../contexts/Modal';
import { Account } from '../Account';
import { useStaking } from '../../contexts/Staking';
import { useBalances } from '../../contexts/Balances';

export const Connected = () => {
  const { activeAccount }: any = useConnect();
  const { openModalWith } = useModal();
  const { isNominating, hasController, isControllerImported } = useStaking();
  const { getBondedAccount }: any = useBalances();
  const controller = getBondedAccount(activeAccount);
  const controllerImported = isControllerImported(controller);

  return (
    <>
      {activeAccount !== '' && (
        <>
          <HeadingWrapper>
            <Account
              canClick
              onClick={() => {
                openModalWith('ConnectAccounts', {}, 'small');
              }}
              value={activeAccount}
              label={isNominating() ? 'Stash' : undefined}
              format="name"
              filled
              wallet
            />
          </HeadingWrapper>
          <HeadingWrapper>
            <Account
              value={controller}
              title={controllerImported ? undefined : 'Not Imported'}
              format="name"
              label="Controller"
              canClick={hasController()}
              onClick={() => {
                if (hasController()) {
                  openModalWith('UpdateController', {}, 'small');
                }
              }}
              filled
            />
          </HeadingWrapper>
        </>
      )}
    </>
  );
};
