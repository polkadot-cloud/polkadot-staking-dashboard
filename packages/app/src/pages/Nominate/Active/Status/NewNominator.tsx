// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useApi } from 'contexts/Api'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { useNetwork } from 'contexts/Network'
import { useActivePool } from 'contexts/Pools/ActivePool'
import { CallToActionWrapper } from 'library/CallToAction'
import { CallToActionLoader } from 'library/Loader/CallToAction'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useOverlay } from 'ui-overlay'
import { registerSaEvent } from 'utils'
import type { NewNominatorProps } from '../types'

export const NewNominator = ({ syncing }: NewNominatorProps) => {
  const { t } = useTranslation()
  const { isReady } = useApi()
  const navigate = useNavigate()
  const { network } = useNetwork()
  const { inPool } = useActivePool()
  const { openCanvas } = useOverlay().canvas
  const { activeAddress } = useActiveAccounts()
  const { isReadOnlyAccount } = useImportedAccounts()

  const nominateButtonDisabled =
    !isReady || !activeAddress || isReadOnlyAccount(activeAddress) || inPool()

  return (
    <CallToActionWrapper>
      <div className="inner">
        {syncing ? (
          <CallToActionLoader />
        ) : (
          <>
            <section className="standalone">
              <div className="buttons">
                <div
                  className={`button primary standalone${nominateButtonDisabled ? ` disabled` : ` pulse`}`}
                >
                  <button
                    onClick={() => {
                      registerSaEvent(
                        `${network.toLowerCase()}_nominate_setup_button_pressed`
                      )

                      openCanvas({
                        key: 'NominatorSetup',
                        options: {},
                        size: 'xl',
                      })
                    }}
                    disabled={nominateButtonDisabled}
                  >
                    {t('startNominating', { ns: 'pages' })}
                  </button>
                </div>
              </div>
            </section>
            <section>
              <div className="buttons">
                <div className={`button secondary standalone`}>
                  <button onClick={() => navigate('/validators')}>
                    {t('browseValidators', { ns: 'app' })}
                    <FontAwesomeIcon
                      icon={faChevronRight}
                      transform="shrink-4"
                    />
                  </button>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </CallToActionWrapper>
  )
}
