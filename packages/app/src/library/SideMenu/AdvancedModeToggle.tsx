// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
  faChartLine,
  faToggleOff,
  faToggleOn,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useUi } from 'contexts/UI'
import type { UIContextInterface } from 'contexts/UI/types'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

const ToggleContainer = styled.div`
  position: relative;
  margin-top: auto;
  padding: 0;
  width: 100%;
`

const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  user-select: none;
  transition: all 0.15s;
  padding: 0.75rem 1rem;
  margin: 0.5rem 0;
  width: 100%;
  box-sizing: border-box;

  &:active {
    transform: scale(0.98);
  }
`

const ToggleLabel = styled.div`
  display: flex;
  align-items: center;
  font-family: InterSemiBold, sans-serif;
  color: var(--text-color-secondary);
  font-size: 1.1rem;

  .icon {
    width: 1.2rem;
    height: 1.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 0.75rem;
    min-width: 1.2rem;
    flex-shrink: 0;
  }
`

export const AdvancedModeToggle = ({ minimised }: { minimised: boolean }) => {
  const { t } = useTranslation('app')
  const { advancedMode, setAdvancedMode }: UIContextInterface = useUi()

  const toggleAdvancedMode = () => {
    setAdvancedMode(!advancedMode)
  }

  // If the sidebar is minimized, don't show the toggle
  if (minimised) {
    return null
  }

  return (
    <ToggleContainer>
      <ToggleWrapper
        onClick={toggleAdvancedMode}
        role="switch"
        aria-checked={advancedMode}
        aria-label={t('advanced')}
      >
        <ToggleLabel>
          <span className="icon" style={{ color: 'var(--text-color-primary)' }}>
            <FontAwesomeIcon icon={faChartLine} />
          </span>
          {t('advanced')}
        </ToggleLabel>
        <FontAwesomeIcon
          icon={advancedMode ? faToggleOn : faToggleOff}
          color={
            advancedMode
              ? 'var(--accent-color-primary)'
              : 'var(--text-color-tertiary)'
          }
          transform="grow-12"
          style={{ marginTop: '1px' }}
        />
      </ToggleWrapper>
    </ToggleContainer>
  )
}
