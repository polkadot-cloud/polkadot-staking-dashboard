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
import { ProxyInput } from './AccountInput/Proxy';
import {
  ActionWithButton,
  ManualAccountBasic,
  ManualAccountsWrapper,
} from './Wrappers';
import type { ListWithInputProps } from './types';

export const Proxies = ({ setInputOpen, inputOpen }: ListWithInputProps) => {
  const { t } = useTranslation('modals');
  const { getAccount } = useConnect();
  const { delegates, handleDeclareDelegate } = useProxies();

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
            text={!inputOpen ? 'Declare' : t('hide')}
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
              <ProxyInput
                successCallback={async (delegator) => {
                  const result = await handleDeclareDelegate(delegator);
                  return result;
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
                                <span>{proxyType} Proxy</span>
                                {delegateAccount?.name || delegate}
                              </h4>
                              <h4 className="subtitle">
                                for {delegatorAccount?.name || delegator}
                              </h4>
                            </div>
                          </div>
                          <div />
                          <ButtonSecondary text="Declared" disabled />
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
