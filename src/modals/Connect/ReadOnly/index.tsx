// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { ButtonMonoInvert } from '@polkadotcloud/core-ui';
import { useConnect } from 'contexts/Connect';
import type { ExternalAccount, ImportedAccount } from 'contexts/Connect/types';
import { useModal } from 'contexts/Modal';
import { useTranslation } from 'react-i18next';
import { ReadOnlyInput } from '../ReadOnlyInput';
import type { ReadOnlyProps } from '../types';
import { Wrapper } from './Wrapper';

export const ReadOnly = ({ setReadOnlyOpen, readOnlyOpen }: ReadOnlyProps) => {
  const { t } = useTranslation('modals');
  const { accounts, forgetAccounts } = useConnect();
  const { setResize } = useModal();

  // get all external accounts
  const externalAccountsOnly = accounts.filter(
    (a: ImportedAccount) => a.source === 'external'
  ) as Array<ExternalAccount>;

  // get external accounts added by user
  const externalAccountsByUser = externalAccountsOnly.filter(
    (a: ExternalAccount) => a.addedBy === 'user'
  );

  // forget account
  const forgetAccount = (account: ExternalAccount) => {
    forgetAccounts([account]);
    setResize();
  };
  return (
    <Wrapper>
      <h3>
        <ButtonMonoInvert
          iconLeft={readOnlyOpen ? faMinus : faPlus}
          text={!readOnlyOpen ? t('add') : t('hide')}
          onClick={() => {
            setReadOnlyOpen(!readOnlyOpen);
          }}
        />
      </h3>
      <div className="content">
        {readOnlyOpen && (
          <>
            <ReadOnlyInput />
            {externalAccountsByUser.length > 0 && (
              <h5>
                {t('readOnlyAccount', { count: externalAccountsByUser.length })}
              </h5>
            )}
          </>
        )}
        {externalAccountsByUser.length ? (
          <div className="accounts">
            {externalAccountsByUser.map((a: ExternalAccount, i: number) => (
              <div key={`user_external_account_${i}`} className="account">
                <div>{a.address}</div>
                <ButtonMonoInvert
                  text={t('forget')}
                  onClick={() => {
                    forgetAccount(a);
                  }}
                />
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </Wrapper>
  );
};
