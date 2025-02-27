// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
  faChevronRight,
  faCircleMinus,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTranslation } from 'react-i18next'
import { ButtonText } from 'ui-buttons'
import { HeadingWrapper } from './Wrappers'
import type { HeadingProps } from './types'

export const Heading = ({
  connectTo,
  title,
  Icon,
  disabled,
  handleReset,
}: HeadingProps) => {
  const { t } = useTranslation('app')

  return (
    <HeadingWrapper>
      <section>
        <h4>
          {Icon && <Icon />}
          <span>
            {connectTo && (
              <>
                {connectTo}{' '}
                <FontAwesomeIcon icon={faChevronRight} transform="shrink-5" />
              </>
            )}
            {title}
          </span>
        </h4>
      </section>
      <section>
        {handleReset && (
          <ButtonText
            text={t('reset')}
            iconLeft={faCircleMinus}
            onClick={() => {
              if (typeof handleReset === 'function') {
                handleReset()
              }
            }}
            disabled={disabled || false}
            marginLeft
          />
        )}
      </section>
    </HeadingWrapper>
  )
}
