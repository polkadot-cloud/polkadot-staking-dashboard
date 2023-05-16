// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {
  faChevronRight,
  faMinus,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ButtonMonoInvert, ButtonSecondary } from '@polkadotcloud/core-ui';
import { useConnect } from 'contexts/Connect';
import type { ExternalAccount } from 'contexts/Connect/types';
import { useModal } from 'contexts/Modal';
import { Identicon } from 'library/Identicon';
import { useTranslation } from 'react-i18next';
import { AccountInput } from './AccountInput';
import { ActionWithButton, ManualAccountsWrapper } from './Wrappers';
import type { ListWithInputProps } from './types';

export const ReadOnly = ({ setInputOpen, inputOpen }: ListWithInputProps) => {
  const { t } = useTranslation('modals');
  const { accounts, forgetAccounts, addExternalAccount } = useConnect();
  const { setResize } = useModal();

  // get all external accounts
  const externalAccountsOnly = accounts.filter(
    (a) => a.source === 'external'
  ) as ExternalAccount[];

  // get external accounts added by user
  const externalAccounts = externalAccountsOnly.filter(
    (a) => a.addedBy === 'user'
  );

  // forget account
  const forgetAccount = (account: ExternalAccount) => {
    forgetAccounts([account]);
    setResize();
  };
  return (
    <>
      <ActionWithButton>
        <div>
          <FontAwesomeIcon icon={faChevronRight} transform="shrink-4" />
          <h3>{t('readOnlyAccounts')}</h3>
        </div>
        <div>
          <ButtonMonoInvert
            iconLeft={inputOpen ? faMinus : faPlus}
            text={!inputOpen ? t('add') : t('hide')}
            onClick={() => {
              setInputOpen(!inputOpen);
            }}
          />
        </div>
      </ActionWithButton>
      <ManualAccountsWrapper>
        <div className="content">
          {inputOpen && (
            <AccountInput
              successCallback={async (value: string) => {
                addExternalAccount(value, 'user');
                return true;
              }}
            />
          )}
          {externalAccounts.length ? (
            <div className="accounts">
              {externalAccounts.map((a, i) => (
                <div key={`user_external_account_${i}`} className="account">
                  <div>
                    <span>
                      <Identicon value={a.address} size={26} />
                    </span>
                    <h4>{a.address}</h4>
                  </div>
                  <ButtonSecondary
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
      </ManualAccountsWrapper>
    </>
  );
};
