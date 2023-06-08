// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {
  faChevronRight,
  faMinus,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  ButtonHelp,
  ButtonMonoInvert,
  ButtonSecondary,
} from '@polkadotcloud/core-ui';
import { useConnect } from 'contexts/Connect';
import type { ExternalAccount } from 'contexts/Connect/types';
import { useHelp } from 'contexts/Help';
import { useModal } from 'contexts/Modal';
import { AccountInput } from 'library/AccountInput';
import { Identicon } from 'library/Identicon';
import { useTranslation } from 'react-i18next';
import {
  ActionWithButton,
  ManualAccount,
  ManualAccountsWrapper,
} from './Wrappers';
import type { ListWithInputProps } from './types';

export const ReadOnly = ({ setInputOpen, inputOpen }: ListWithInputProps) => {
  const { t } = useTranslation('modals');
  const { accounts, forgetAccounts, addExternalAccount } = useConnect();
  const { setResize } = useModal();
  const { openHelp } = useHelp();

  // get all external accounts
  const externalAccountsOnly = accounts.filter(
    ({ source }) => source === 'external'
  ) as ExternalAccount[];

  // get external accounts added by user
  const externalAccounts = externalAccountsOnly.filter(
    ({ addedBy }) => addedBy === 'user'
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
          <ButtonHelp
            marginLeft
            onClick={() => openHelp('Read Only Accounts')}
          />
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
              resetOnSuccess
              defaultLabel={t('inputAddress')}
              successCallback={async (value: string) => {
                addExternalAccount(value, 'user');
                return true;
              }}
            />
          )}
          {externalAccounts.length ? (
            <div className="accounts">
              {externalAccounts.map((a, i) => (
                <ManualAccount key={`user_external_account_${i}`}>
                  <div>
                    <span>
                      <Identicon value={a.address} size={26} />
                    </span>
                    <div className="text">
                      <h4>{a.address}</h4>
                    </div>
                  </div>
                  <ButtonSecondary
                    text={t('forget')}
                    onClick={() => {
                      forgetAccount(a);
                    }}
                  />
                </ManualAccount>
              ))}
            </div>
          ) : (
            <div style={{ padding: '0.5rem' }}>
              <h4>{t('noReadOnlyAdded')}</h4>
            </div>
          )}
        </div>
      </ManualAccountsWrapper>
    </>
  );
};
