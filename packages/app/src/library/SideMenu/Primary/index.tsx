// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faCircle, faHouseUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useUi } from 'contexts/UI'
import { useDotLottieButton } from 'hooks/useDotLottieButton'
import { Link } from 'react-router-dom'
import type { PrimaryProps } from '../types'
import { BulletWrapper } from '../Wrapper'
import { Wrapper } from './Wrappers'

export const Primary = ({
  name,
  active,
  to,
  bullet,
  minimised,
  lottie,
}: PrimaryProps) => {
  const { setSideMenu } = useUi()

  const { icon, play } = useDotLottieButton(lottie)

  return (
    <Link
      to={to}
      onClick={() => {
        if (!active) {
          play()
          setSideMenu(false)
        }
      }}
    >
      <Wrapper
        className={`${active ? `active` : `inactive`}${
          minimised ? ` minimised` : ``
        }${bullet ? ` ${bullet}` : ``}`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{
          duration: 0.1,
        }}
      >
        <div className={`dotlottie${minimised ? ` minimised` : ``}`}>
          {name === 'Home' ? (
            <button
              type="button"
              style={{
                height: 'inherit',
                width: 'inherit',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FontAwesomeIcon
                icon={faHouseUser}
                style={{ fontSize: '1.2rem' }}
              />
            </button>
          ) : (
            icon
          )}
        </div>
        {!minimised && (
          <>
            <h4 className="name">{name}</h4>
            {bullet && (
              <BulletWrapper className={bullet}>
                <FontAwesomeIcon icon={faCircle} transform="shrink-6" />
              </BulletWrapper>
            )}
          </>
        )}
      </Wrapper>
    </Link>
  )
}
