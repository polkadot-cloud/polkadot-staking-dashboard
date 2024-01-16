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
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { useHelp } from 'contexts/Help';
import { useProxies } from 'contexts/Proxies';
import { AccountInput } from 'library/AccountInput';
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts';
import {
  ActionWithButton,
  ManualAccount,
  ManualAccountsWrapper,
} from './Wrappers';
import type { ListWithInputProps } from './types';

export const Proxies = ({ setInputOpen, inputOpen }: ListWithInputProps) => {
  const { t } = useTranslation('modals');
  const { openHelp } = useHelp();
  const { accounts, getAccount } = useImportedAccounts();
  const { handleDeclareDelegate, formatProxiesToDelegates } = useProxies();

  // Filter delegates to only show those who are imported in the dashboard.
  const delegates = formatProxiesToDelegates();
  const importedDelegates = Object.fromEntries(
    Object.entries(delegates).filter(([delegate]) =>
      accounts.find((a) => a.address === delegate)
    )
  );

  return (
    <>
      <ActionWithButton>
        <div>
          <FontAwesomeIcon icon={faChevronRight} transform="shrink-4" />
          <h3>{t('proxyAccounts')}</h3>
          <ButtonHelp marginLeft onClick={() => openHelp('Proxy Accounts')} />
        </div>
        <div>
          <ButtonMonoInvert
            iconLeft={inputOpen ? faMinus : faPlus}
            text={!inputOpen ? t('declare') : t('hide')}
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
              defaultLabel={t('inputDelegatorAddress')}
              successCallback={async (delegator) => {
                const result = await handleDeclareDelegate(delegator);
                return result;
              }}
            />
          )}
          {Object.entries(importedDelegates).length ? (
            <div className="accounts">
              {Object.entries(importedDelegates).map(
                ([delegate, delegators], i) => (
                  <Fragment key={`user_delegate_account_${i}}`}>
                    {delegators.map(({ delegator, proxyType }, j) => (
                      <ManualAccount key={`user_delegate_${i}_delegator_${j}`}>
                        <div>
                          <span>
                            <Polkicon address={delegate} size={26} />
                          </span>
                          <div className="text">
                            <h4 className="title">
                              <span>
                                {proxyType} {t('proxy')}
                              </span>
                              {getAccount(delegate)?.name || delegate}
                            </h4>
                            <h4 className="subtitle">
                              {t('for', {
                                who: getAccount(delegator)?.name || delegator,
                              })}
                            </h4>
                          </div>
                        </div>
                        <div />
                        <ButtonSecondary text={t('declared')} disabled />
                      </ManualAccount>
                    ))}
                  </Fragment>
                )
              )}
            </div>
          ) : (
            <div style={{ padding: '0.5rem' }}>
              <h4>{t('noProxyAccountsDeclared')}</h4>
            </div>
          )}
        </div>
      </ManualAccountsWrapper>
    </>
  );
};
