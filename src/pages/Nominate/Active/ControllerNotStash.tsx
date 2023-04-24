// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { stringUpperFirst } from '@polkadot/util';
import { ButtonPrimary, PageRow } from '@polkadotcloud/core-ui';
import { useBalances } from 'contexts/Accounts/Balances';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { useStaking } from 'contexts/Staking';
import { useUi } from 'contexts/UI';
import { CardHeaderWrapper, CardWrapper } from 'library/Graphs/Wrappers';

export const ControllerNotStash = () => {
  const { network } = useApi();
  const { activeAccount, isReadOnlyAccount } = useConnect();
  const { addressDifferentToStash } = useStaking();
  const { getBondedAccount } = useBalances();
  const { openModalWith } = useModal();
  const { isSyncing } = useUi();
  const controller = getBondedAccount(activeAccount);

  return (
    <>
      {addressDifferentToStash(controller)
        ? !isSyncing &&
          !isReadOnlyAccount(activeAccount) && (
            <PageRow>
              <CardWrapper warning>
                <CardHeaderWrapper>
                  <h3>Controller Accounts are Being Deprecated</h3>
                  <h4>
                    Staking dashboard will soon remove support for controller
                    accounts in favour of proxies. Switch your controller
                    account to your stash account to continue using the
                    dashboard and to help in this transition to a better{' '}
                    {stringUpperFirst(network.name)}.
                  </h4>
                </CardHeaderWrapper>
                <div>
                  <ButtonPrimary
                    text="Update Controller To Stash"
                    onClick={() =>
                      openModalWith('UpdateController', {}, 'large')
                    }
                  />
                </div>
              </CardWrapper>
            </PageRow>
          )
        : null}
    </>
  );
};
