// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faCopy } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { useTheme } from 'contexts/Themes'
import { Notifications } from 'controllers/Notifications'
import { Popover } from 'radix-ui'
import { useTranslation } from 'react-i18next'
import { ButtonRow } from 'ui-core/base'
import DefaultAccount from '../Account/DefaultAccount'
import styles from './index.module.scss'

export const Connected = () => {
  const { t } = useTranslation()
  const { themeElementRef } = useTheme()
  const { accountHasSigner } = useImportedAccounts()
  const { activeAccount, activeProxy } = useActiveAccounts()

  return (
    activeAccount && (
      <>
        {/* Default account display. */}
        <Popover.Root>
          <Popover.Trigger>
            <DefaultAccount
              value={activeAccount}
              readOnly={!accountHasSigner(activeAccount)}
            />
          </Popover.Trigger>
          <Popover.Portal container={themeElementRef.current}>
            <Popover.Content className={styles.Content} sideOffset={5}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <h4>Full Address</h4>
                <p>
                  {activeAccount} &nbsp;
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(activeAccount)
                      Notifications.emit({
                        title: t('overview.addressCopied', { ns: 'pages' }),
                        subtitle: activeAccount,
                      })
                    }}
                  >
                    <FontAwesomeIcon icon={faCopy} transform="shrink-3" />
                  </button>
                </p>
              </div>
              <Popover.Arrow className={styles.Arrow} />
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>

        {/* Proxy account display / hide if no proxy. */}
        {activeProxy && (
          <ButtonRow xMargin>
            <DefaultAccount
              value={activeProxy}
              readOnly={!accountHasSigner(activeProxy)}
            />
          </ButtonRow>
        )}
      </>
    )
  )
}
