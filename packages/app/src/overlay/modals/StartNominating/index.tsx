// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faBolt, faCog } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useNominatorSetups } from 'contexts/NominatorSetups'
import { useTransferOptions } from 'contexts/TransferOptions'
import { useFetchMehods } from 'hooks/useFetchMethods'
import { Title } from 'library/Modal/Title'
import { useTranslation } from 'react-i18next'
import { Padding } from 'ui-core/modal'
import { useOverlay } from 'ui-overlay'
import { ItemsWrapper, ItemWrapper } from './Wrappers'

export const StartNominating = () => {
  const { t } = useTranslation()
  const { fetch } = useFetchMehods()
  const { openCanvas } = useOverlay().canvas
  const { setModalStatus } = useOverlay().modal
  const { activeAddress } = useActiveAccounts()
  const { getTransferOptions } = useTransferOptions()
  const { setNominatorSetup, removeNominatorSetup } = useNominatorSetups()
  const {
    nominate: { totalPossibleBond },
  } = getTransferOptions(activeAddress)

  return (
    <>
      <Title title={t('startNominating', { ns: 'pages' })} />
      <Padding horizontalOnly style={{ marginTop: '1rem' }}>
        <ItemsWrapper>
          <ItemWrapper
            type="button"
            onClick={() => {
              setModalStatus('closing')
              // Set optimal nominator setup here, ready for canvas to display summary
              setNominatorSetup(
                {
                  payee: {
                    destination: 'Staked',
                    account: null,
                  },
                  nominations: fetch('Optimal Selection'),
                  bond: totalPossibleBond.toString(),
                },
                true,
                4
              )
              openCanvas({
                key: 'NominatorSetup',
                options: {
                  simple: true,
                },
                size: 'xl',
              })
            }}
          >
            <FontAwesomeIcon icon={faBolt} size="2x" />
            <h2>One-Click Setup</h2>
            <h3>Stake immediately with an optimised setup</h3>
          </ItemWrapper>
          <ItemWrapper
            type="button"
            onClick={() => {
              setModalStatus('closing')
              removeNominatorSetup(activeAddress)
              openCanvas({
                key: 'NominatorSetup',
                options: {
                  simple: false,
                },
                size: 'xl',
              })
            }}
          >
            <FontAwesomeIcon icon={faCog} size="2x" />
            <h2>Custom Setup</h2>
            <h3>Customise your staking position</h3>
          </ItemWrapper>
        </ItemsWrapper>
      </Padding>
    </>
  )
}
