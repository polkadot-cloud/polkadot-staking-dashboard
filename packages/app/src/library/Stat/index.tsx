// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Odometer } from '@w3ux/react-odometer'
import { Polkicon } from '@w3ux/react-polkicon'
import type { AnyJson } from '@w3ux/types'
import { applyWidthAsPadding, minDecimalPlaces } from '@w3ux/utils'
import { useHelp } from 'contexts/Help'
import { useNetwork } from 'contexts/Network'
import { useEffect, useLayoutEffect, useRef } from 'react'
import { ButtonHelp, ButtonPrimary, ButtonSecondary } from 'ui-buttons'
import { Wrapper } from './Wrapper'
import type { StatAddress, StatProps } from './types'

export const Stat = ({
  label,
  stat,
  buttons,
  helpKey,
  icon,
  dimmed = false,
  type = 'string',
  buttonType = 'primary',
}: StatProps) => {
  const {
    brand: { token: Token },
  } = useNetwork().networkData
  const { openHelp } = useHelp()

  const containerRef = useRef<HTMLDivElement | null>(null)
  const subjectRef = useRef<HTMLDivElement | null>(null)

  const handleAdjustLayout = () => {
    applyWidthAsPadding(subjectRef, containerRef)
  }

  useLayoutEffect(() => {
    handleAdjustLayout()
  })

  useEffect(() => {
    window.addEventListener('resize', handleAdjustLayout)
    return () => {
      window.removeEventListener('resize', handleAdjustLayout)
    }
  }, [])

  const Button = buttonType === 'primary' ? ButtonPrimary : ButtonSecondary

  let display
  switch (type) {
    case 'address':
      display = stat.display
      break
    case 'odometer':
      display = (
        <h2>
          <Token
            style={{
              width: '1.9rem',
              height: '1.9rem',
              marginRight: '0.55rem',
            }}
          />
          <Odometer
            value={minDecimalPlaces(stat.value, 2)}
            spaceAfter="0.4rem"
            zeroDecimals={2}
          />
          {stat?.unit ? stat.unit : null}
        </h2>
      )
      break
    default:
      display = stat
  }

  return (
    <Wrapper
      $isAddress={type === 'address'}
      style={dimmed ? { opacity: 0.5 } : undefined}
    >
      <h4>
        {label}
        {helpKey !== undefined ? (
          <ButtonHelp marginLeft onClick={() => openHelp(helpKey)} />
        ) : null}
      </h4>
      <div className={`content${buttons ? ' withButtons' : ''}`}>
        <div className="text" ref={containerRef}>
          {icon ? (
            <>
              <FontAwesomeIcon icon={icon} transform="shrink-4" />
              &nbsp;
            </>
          ) : null}
          {type === 'address' ? (
            <div className="icon" style={{ maxWidth: '2.4rem' }}>
              <Polkicon
                address={(stat as StatAddress)?.address || ''}
                fontSize="2.4rem"
              />
            </div>
          ) : null}
          {display}
          {buttons ? (
            <span ref={subjectRef}>
              {buttons.map((btn: AnyJson, index: number) => (
                <span key={`stat_${index}`}>
                  <Button
                    key={`btn_${index}_${Math.random()}`}
                    text={btn.title}
                    size={btn.large ? 'lg' : undefined}
                    iconLeft={btn.icon ?? undefined}
                    iconTransform={btn.transform ?? undefined}
                    disabled={btn.disabled ?? false}
                    onClick={() => btn.onClick()}
                    marginRight
                  />
                </span>
              ))}
            </span>
          ) : null}
        </div>
      </div>
    </Wrapper>
  )
}
