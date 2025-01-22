// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faUserPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useStaking } from 'contexts/Staking'
import { CallToActionWrapper } from 'library/CallToAction'
import { CallToActionLoader } from 'library/Loader/CallToAction'
import { useTranslation } from 'react-i18next'
import { useOverlay } from 'ui-overlay'
import { usePoolsTabs } from '../context'
import type { NewMemberProps } from './types'
import { useStatusButtons } from './useStatusButtons'

export const NewMember = ({ syncing }: NewMemberProps) => {
  const { t } = useTranslation()
  const { inSetup } = useStaking()
  const { setActiveTab } = usePoolsTabs()
  const { openCanvas } = useOverlay().canvas
  const { getJoinDisabled, getCreateDisabled } = useStatusButtons()

  // Alias for create button disabled state
  const createDisabled = getCreateDisabled() || !inSetup()

  // Disable opening the canvas if data is not ready.
  const joinButtonDisabled = getJoinDisabled() || !inSetup()

  return (
    <CallToActionWrapper>
      <div className="inner">
        {syncing ? (
          <CallToActionLoader />
        ) : (
          <>
            <section className="fixedWidth">
              <div className="buttons">
                <div
                  className={`button primary standalone${joinButtonDisabled ? ` disabled` : ``}${!joinButtonDisabled ? ` pulse` : ``}`}
                >
                  <button
                    onClick={() => {
                      openCanvas({
                        key: 'Pool',
                        options: {},
                        size: 'xl',
                      })
                    }}
                    disabled={joinButtonDisabled}
                  >
                    {t('pools.joinPool', { ns: 'pages' })}
                    <FontAwesomeIcon icon={faUserPlus} />
                  </button>
                </div>
              </div>
            </section>
            <section>
              <div className="buttons">
                <div
                  className={`button standalone secondary ${createDisabled ? ` disabled` : ``}`}
                >
                  <button
                    onClick={() =>
                      openCanvas({
                        key: 'CreatePool',
                        options: {},
                        size: 'xl',
                      })
                    }
                    disabled={createDisabled}
                  >
                    {t('pools.createPool', { ns: 'pages' })}
                  </button>
                </div>
                <div className={`button standalone secondary`}>
                  <button onClick={() => setActiveTab(1)}>
                    {t('pools.browsePools', { ns: 'pages' })}
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
