// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

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
  Polkicon,
} from '@polkadot-cloud/react';
import { useTranslation } from 'react-i18next';
import { useHelp } from 'contexts/Help';
import { AccountInput } from 'library/AccountInput';
import { useOverlay } from '@polkadot-cloud/react/hooks';
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts';
import { useOtherAccounts } from 'contexts/Connect/OtherAccounts';
import type { ExternalAccount } from '@polkadot-cloud/react/types';
import { useExternalAccounts } from 'contexts/Connect/ExternalAccounts';
import {
  ActionWithButton,
  ManualAccount,
  ManualAccountsWrapper,
} from './Wrappers';
import type { ListWithInputProps } from './types';

export const ReadOnly = ({ setInputOpen, inputOpen }: ListWithInputProps) => {
  const { t } = useTranslation('modals');
  const { openHelp } = useHelp();
  const { accounts } = useImportedAccounts();
  const { setModalResize } = useOverlay().modal;
  const { addExternalAccount, forgetExternalAccounts } = useExternalAccounts();
  const { forgetOtherAccounts, addOrReplaceOtherAccount } = useOtherAccounts();

  // get all external accounts
  const externalAccountsOnly = accounts.filter(
    ({ source }) => source === 'external'
  ) as ExternalAccount[];

  // get external accounts added by user
  const externalAccounts = externalAccountsOnly.filter(
    ({ addedBy }) => addedBy === 'user'
  );

  const handleForgetExternalAccount = (account: ExternalAccount) => {
    forgetExternalAccounts([account]);
    // forget the account from state only if it has not replaced by a `system` external account.
    if (account.addedBy === 'user') {
      forgetOtherAccounts([account]);
    }
    setModalResize();
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
                const result = addExternalAccount(value, 'user');
                if (result) {
                  addOrReplaceOtherAccount(result.account, result.type);
                }

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
                      <Polkicon address={a.address} size={26} />
                    </span>
                    <div className="text">
                      <h4>{a.address}</h4>
                    </div>
                  </div>
                  <ButtonSecondary
                    text={t('forget')}
                    onClick={() => handleForgetExternalAccount(a)}
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
