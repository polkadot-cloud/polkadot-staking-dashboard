// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useState } from 'react'
import styled from 'styled-components'

const ToggleWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: stretch;
  margin-left: 0.8rem;
  background: var(--button-primary-background);
  border-radius: 999px;
  box-shadow: var(--card-shadow);
  border: 1.5px solid var(--accent-color-primary);
  height: 2.8rem;
  min-width: 220px;
  width: 220px;
  padding: 0;
  overflow: hidden;
`

const Slider = styled.div<{ mode: 'easy' | 'advanced' }>`
  position: absolute;
  top: 0;
  left: ${({ mode }) => (mode === 'easy' ? '0' : '50%')};
  width: 50%;
  height: 100%;
  background: var(--accent-color-primary);
  border-radius: 999px;
  transition: left 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1;
`

const ToggleButton = styled.button<{ $active: boolean }>`
  position: relative;
  z-index: 2;
  flex: 1 1 50%;
  border: none !important;
  outline: none !important;
  background: transparent;
  font-family: InterSemiBold, sans-serif;
  font-size: 1.1rem;
  padding: 0 1.2rem;
  margin: 0;
  cursor: pointer;
  border-radius: 0;
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ $active }) =>
    $active ? 'white' : 'var(--text-color-secondary)'};
  transition: color 0.2s;
  height: 100%;
  box-shadow: none;

  &:focus {
    outline: none !important;
    border: none !important;
    box-shadow: none;
  }
  &:focus-visible {
    outline: none !important;
    border: none !important;
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.08);
  }
`

export const ToggleMode = () => {
  const [mode, setMode] = useState<'easy' | 'advanced'>('easy')

  return (
    <ToggleWrapper aria-label="Display mode toggle" role="group" tabIndex={0}>
      <Slider mode={mode} aria-hidden />
      <ToggleButton
        $active={mode === 'easy'}
        aria-pressed={mode === 'easy'}
        aria-label="Easy mode"
        onClick={() => setMode('easy')}
        type="button"
      >
        Easy
      </ToggleButton>
      <ToggleButton
        $active={mode === 'advanced'}
        aria-pressed={mode === 'advanced'}
        aria-label="Advanced mode"
        onClick={() => setMode('advanced')}
        type="button"
      >
        Advanced
      </ToggleButton>
    </ToggleWrapper>
  )
}
