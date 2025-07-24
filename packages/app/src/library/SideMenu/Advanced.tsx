// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
  faSlidersH,
  faToggleOff,
  faToggleOn,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useUi } from 'contexts/UI'
import { useTranslation } from 'react-i18next'
import { AdvancedToggleWrapper } from './Wrapper'

export const AdvancedToggle = ({ minimised }: { minimised: boolean }) => {
  const { t } = useTranslation('app')
  const { advancedMode, setAdvancedMode } = useUi()

  return (
    <AdvancedToggleWrapper
      onClick={() => setAdvancedMode(!advancedMode)}
      role="switch"
      aria-checked={advancedMode}
      aria-label={t('advanced')}
    >
      <span style={{ color: 'var(--text-color-primary)' }}>
        <FontAwesomeIcon icon={faSlidersH} />
      </span>
      {!minimised && <h4>{t('advanced')}</h4>}

      <FontAwesomeIcon
        className="toggle"
        icon={advancedMode ? faToggleOn : faToggleOff}
        style={{
          marginLeft: minimised ? '0.75rem' : 0,
          color: advancedMode
            ? 'var(--accent-color-primary)'
            : 'var(--text-color-tertiary)',
        }}
      />
    </AdvancedToggleWrapper>
  )
}
