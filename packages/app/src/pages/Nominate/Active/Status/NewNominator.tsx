// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useApi } from 'contexts/Api'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { useNominatorSetups } from 'contexts/NominatorSetups'
import { useActivePool } from 'contexts/Pools/ActivePool'
import { useUi } from 'contexts/UI'
import { CallToActionWrapper } from 'library/CallToAction'
import { CallToActionLoader } from 'library/Loader/CallToAction'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useOverlay } from 'ui-overlay'
import type { NewNominatorProps } from '../types'

export const NewNominator = ({ syncing }: NewNominatorProps) => {
  const { t } = useTranslation()
  const { isReady } = useApi()
  const navigate = useNavigate()
  const { advancedMode } = useUi()
  const { inPool } = useActivePool()
  const { openModal } = useOverlay().modal
  const { openCanvas } = useOverlay().canvas
  const { activeAddress } = useActiveAccounts()
  const { isReadOnlyAccount } = useImportedAccounts()
  const { generateOptimalSetup, setNominatorSetup } = useNominatorSetups()

  const nominateButtonDisabled =
    !isReady || !activeAddress || isReadOnlyAccount(activeAddress) || inPool

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
                      if (advancedMode) {
                        openModal({
                          key: 'StartNominating',
                          options: {},
                          size: 'lg',
                        })
                      } else {
                        // Set optimal nominator setup here, ready for canvas to display summary
                        setNominatorSetup(generateOptimalSetup(), true, 4)
                        openCanvas({
                          key: 'NominatorSetup',
                          options: {
                            simple: true,
                          },
                          size: 'xl',
                        })
                      }
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
