// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {
  faArrowRight,
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
import {
  ActionWithButton,
  ManualAccountBasic,
  ManualAccountsWrapper,
} from './Wrappers';
import type { ListWithInputProps } from './types';

export const Proxies = ({ setInputOpen, inputOpen }: ListWithInputProps) => {
  const { t } = useTranslation('modals');
  const { addExternalAccount, getAccount } = useConnect();
  const { delegates } = useProxies();

  return (
    <>
      <ActionWithButton>
        <div>
          <FontAwesomeIcon icon={faChevronRight} transform="shrink-4" />
          <h3>Proxy Accounts</h3>
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
              {Object.entries(delegates).map(([delegate, delegators], i) => {
                const delegateAccount = getAccount(delegate);

                return (
                  <React.Fragment key={`user_delegate_account_${i}}`}>
                    {delegators.map(({ delegator, proxyType }, j) => {
                      const delegatorAccount = getAccount(delegator);

                      return (
                        <ManualAccountBasic
                          key={`user_delegate_${i}_delegator_${j}`}
                        >
                          <div>
                            <span>
                              <Identicon value={delegate} size={26} />
                            </span>
                            <div className="text">
                              <h4 className="title">
                                {delegateAccount?.name || delegate}
                                <FontAwesomeIcon
                                  icon={faArrowRight}
                                  transform="shrink-3"
                                />
                                <span>{proxyType} Proxy</span>
                              </h4>
                              <h4 className="subtitle">
                                for {delegatorAccount?.name || delegator}
                              </h4>
                            </div>
                          </div>
                          <div />
                          <ButtonSecondary text="Imported" disabled />
                        </ManualAccountBasic>
                      );
                    })}
                  </React.Fragment>
                );
              })}
            </div>
          ) : null}
        </div>
      </ManualAccountsWrapper>
    </>
  );
};
