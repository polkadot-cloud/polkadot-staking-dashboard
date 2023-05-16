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
import { useProxies } from 'contexts/Proxies';
import { Identicon } from 'library/Identicon';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { AccountInput } from './AccountInput';
import { ActionWithButton, ManualAccountsWrapper } from './Wrappers';
import type { ListWithInputProps } from './types';

export const Proxies = ({ setInputOpen, inputOpen }: ListWithInputProps) => {
  const { t } = useTranslation('modals');
  const { addExternalAccount } = useConnect();
  const { delegates } = useProxies();

  return (
    <>
      <ActionWithButton>
        <div>
          <FontAwesomeIcon icon={faChevronRight} transform="shrink-4" />
          <h3>Proxy Delegate Accounts</h3>
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
            <>
              <AccountInput
                successCallback={async (value: string) => {
                  addExternalAccount(value, 'user');
                  return true;
                }}
              />
            </>
          )}
          {Object.entries(delegates).length ? (
            <div className="accounts">
              {Object.entries(delegates).map(([delegate, delegators], i) => (
                <React.Fragment key={`user_delegate_account_${i}}`}>
                  {delegators.map(({ delegator, proxyType }, j) => {
                    return (
                      <div
                        key={`user_delegate_${i}_delegator_${j}`}
                        className="account"
                      >
                        <div>
                          <span>
                            <Identicon value={delegate} size={26} />
                          </span>
                          <h4>{delegate}</h4>
                          <h4>
                            {delegator} / {proxyType}
                          </h4>
                        </div>
                        <div />
                        <ButtonSecondary text="Imported" disabled />
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          ) : null}
        </div>
      </ManualAccountsWrapper>
    </>
  );
};
