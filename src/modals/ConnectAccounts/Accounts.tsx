// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faCog } from '@fortawesome/free-solid-svg-icons';
import { ButtonSecondary } from '@rossbulat/polkadot-dashboard-ui';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { forwardRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AnyJson } from 'types';
import { AccountButton } from './Account';
import { AccountWrapper, ContentWrapper, PaddingWrapper } from './Wrappers';

export const Accounts = forwardRef((props: AnyJson, ref: AnyJson) => {
  const { setSection } = props;

  const { isReady } = useApi();
  const { getAccount, activeAccount } = useConnect();
  const { accounts } = useConnect();
  const { t } = useTranslation('modals');

  // store local copy of accounts
  const [localAccounts, setLocalAccounts] = useState(accounts);
  const [inactive, setInactive] = useState<string[]>([]);

  useEffect(() => {
    setLocalAccounts(accounts);
  }, [isReady, accounts]);

  useEffect(() => {
    getInactiveAccounts();
  }, [localAccounts]);

  const getInactiveAccounts = () => {
    // construct account groupings
    const _inactive: string[] = [];

    for (const account of localAccounts) {
      if (!_inactive.includes(account.address)) {
        _inactive.push(account.address);
      }
    }
    setInactive(_inactive);
  };

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
        {inactive.length > 0 && (
          <>
            <h3 className="heading">{t('chooseAccount')}</h3>
            {inactive.map((item: string, i: number) => {
              const account = getAccount(item);
              const address = account?.address ?? '';

              return (
                <AccountButton
                  address={address}
                  meta={account}
                  key={`not_staking_${i}`}
                />
              );
            })}
          </>
        )}
      </PaddingWrapper>
    </ContentWrapper>
  );
});

export default Accounts;
