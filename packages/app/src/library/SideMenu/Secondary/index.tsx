// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { SecondaryProps } from '../types'
import { BulletWrapper } from '../Wrapper'
import { IconWrapper, MinimisedWrapper, Wrapper } from './Wrappers'

export const Secondary = ({
  bullet,
  classes,
  name,
  icon,
  minimised,
  onClick,
}: SecondaryProps) => {
  const { Svg, size } = icon || {}

  const StyledWrapper = minimised ? MinimisedWrapper : Wrapper

  return (
    <StyledWrapper
      className={classes ? classes.join(' ') : undefined}
      onClick={() => {
        onClick()
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{
        duration: 0.1,
      }}
    >
      <IconWrapper
        $minimised={minimised}
        className="icon"
        style={{ width: size, height: size }}
      >
        {Svg && <Svg width={size} height={size} />}
      </IconWrapper>

      {!minimised && (
        <>
          <div className="name">{name}</div>
          {bullet && (
            <BulletWrapper className={bullet}>
              <FontAwesomeIcon icon={faCircle} transform="shrink-6" />
            </BulletWrapper>
          )}
        </>
      )}
    </StyledWrapper>
  )
}
