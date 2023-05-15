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
import type { ReadOnlyProps } from '../types';
import { Input } from './Input';
import { ActionWithButton, Wrapper } from './Wrapper';

export const ReadOnly = ({ setReadOnlyOpen, readOnlyOpen }: ReadOnlyProps) => {
  const { t } = useTranslation('modals');
  const { accounts, forgetAccounts } = useConnect();
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
            iconLeft={readOnlyOpen ? faMinus : faPlus}
            text={!readOnlyOpen ? t('add') : t('hide')}
            onClick={() => {
              setReadOnlyOpen(!readOnlyOpen);
            }}
          />
        </div>
      </ActionWithButton>
      <Wrapper>
        <div className="content">
          {readOnlyOpen && (
            <>
              <Input />
              {externalAccounts.length > 0 && (
                <h5>
                  {t('readOnlyAccount', {
                    count: externalAccounts.length,
                  })}
                </h5>
              )}
            </>
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
      </Wrapper>
    </>
  );
};
