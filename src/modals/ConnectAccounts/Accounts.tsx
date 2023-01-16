// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faCog } from '@fortawesome/free-solid-svg-icons';
import { ButtonSecondary } from '@rossbulat/polkadot-dashboard-ui';
import { useApi } from 'contexts/Api';
import { useBalances } from 'contexts/Balances';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { forwardRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AnyJson } from 'types';
import { AccountButton } from './Account';
import { ControllerAccount, StashAcount } from './types';
import { AccountWrapper, ContentWrapper, PaddingWrapper } from './Wrappers';

export const Accounts = forwardRef((props: AnyJson, ref: AnyJson) => {
  const { setSection } = props;

  const { isReady } = useApi();
  const { getAccount, activeAccount } = useConnect();
  const {
    getLedgerForController,
    accounts: balanceAccounts,
    ledgers,
  } = useBalances();
  const { connectToAccount } = useConnect();
  const { setStatus } = useModal();
  const { accounts } = useConnect();
  const { t } = useTranslation('modals');

  const _controllers: Array<ControllerAccount> = [];
  const _stashes: Array<StashAcount> = [];

  // store local copy of accounts
  const [localAccounts, setLocalAccounts] = useState(accounts);

  useEffect(() => {
    setLocalAccounts(accounts);
  }, [isReady, accounts]);

  return (
    <ContentWrapper>
      <PaddingWrapper ref={ref}>
        <div className="head">
          <div>
            <h1>{t('accounts')}</h1>
          </div>
          <div>
            <ButtonSecondary
              text={t('extensions')}
              iconLeft={faCog}
              iconTransform="shrink-2"
              onClick={() => setSection(0)}
            />
          </div>
        </div>
        {activeAccount ? (
          <AccountButton
            address={activeAccount}
            meta={getAccount(activeAccount)}
            label={['danger', t('disconnect')]}
            disconnect
          />
        ) : (
          <AccountWrapper>
            <div>
              <div>
                <h3>{t('noAccountConnected')}</h3>
              </div>
              <div />
            </div>
          </AccountWrapper>
        )}
      </PaddingWrapper>
    </ContentWrapper>
  );
});

export default Accounts;
