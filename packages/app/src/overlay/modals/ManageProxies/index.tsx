// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
  faChevronRight,
  faMinus,
  faPlus,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Polkicon } from '@w3ux/react-polkicon'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { useHelp } from 'contexts/Help'
import { useProxies } from 'contexts/Proxies'
import { AccountInput } from 'library/AccountInput'
import { Fragment, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ButtonHelp, ButtonMonoInvert, ButtonSecondary } from 'ui-buttons'
import { Padding, Title } from 'ui-core/modal'
import { Close, useOverlay } from 'ui-overlay'
import {
  ActionWithButton,
  ManualAccount,
  ManualAccountsWrapper,
} from './Wrappers'

export const ManageProxies = () => {
  const { t } = useTranslation('modals')
  const { openHelp } = useHelp()
  const { accounts, getAccount } = useImportedAccounts()
  const { setModalResize } = useOverlay().modal
  const { handleDeclareDelegate, formatProxiesToDelegates } = useProxies()

  const [inputOpen, setInputOpen] = useState<boolean>(false)

  // Filter delegates to only show those who are imported in the dashboard.
  const delegates = formatProxiesToDelegates()
  const importedDelegates = Object.fromEntries(
    Object.entries(delegates).filter(([delegate]) =>
      accounts.find((a) => a.address === delegate)
    )
  )

  useEffect(() => {
    setModalResize()
  }, [inputOpen, JSON.stringify(delegates)])

  return (
    <>
      <Close />
      <Padding>
        <Title>{t('proxies')}</Title>
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
                setInputOpen(!inputOpen)
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
                  const result = await handleDeclareDelegate(delegator)
                  return result
                }}
              />
            )}
            {Object.entries(importedDelegates).length ? (
              <div className="accounts">
                {Object.entries(importedDelegates).map(
                  ([delegate, delegators], i) => (
                    <Fragment key={`user_delegate_account_${i}}`}>
                      {delegators.map(({ delegator, proxyType }, j) => (
                        <ManualAccount
                          key={`user_delegate_${i}_delegator_${j}`}
                        >
                          <div>
                            <Polkicon address={delegate} fontSize="2.4rem" />
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
      </Padding>
    </>
  )
}
