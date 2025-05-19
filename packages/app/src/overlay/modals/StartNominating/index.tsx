// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faBolt, faCog } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Title } from 'library/Modal/Title'
import { useTranslation } from 'react-i18next'
import { Padding } from 'ui-core/modal'
import { ItemsWrapper, ItemWrapper } from './Wrappers'

export const StartNominating = () => {
  const { t } = useTranslation()

  return (
    <>
      <Title title={t('startNominating', { ns: 'pages' })} />
      <Padding horizontalOnly style={{ marginTop: '1rem' }}>
        <ItemsWrapper>
          <ItemWrapper>
            <FontAwesomeIcon icon={faBolt} size="2x" />
            <h2>One-Click Setup</h2>
            <h3>Stake immediately with an optimised setup</h3>
          </ItemWrapper>
          <ItemWrapper>
            <FontAwesomeIcon icon={faCog} size="2x" />
            <h2>Custom Setup</h2>
            <h3>Customise your staking position</h3>
          </ItemWrapper>
        </ItemsWrapper>
      </Padding>
    </>
  )
}
