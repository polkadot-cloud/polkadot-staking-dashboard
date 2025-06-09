// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faBug } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import classes from './index.module.scss'

export const ErrorFallbackApp = ({
  resetErrorBoundary,
}: {
  resetErrorBoundary: () => void
}) => {
  const { t } = useTranslation('app')

  return (
    <div className={classNames(classes.wrapper, classes.app)}>
      <h3>
        <FontAwesomeIcon icon={faBug} transform="grow-25" />
      </h3>
      <h1>{t('errorUnknown')}</h1>
      <h2>
        <button
          type="button"
          onClick={() => resetErrorBoundary && resetErrorBoundary()}
        >
          {t('clickToReload')}
        </button>
      </h2>
    </div>
  )
}

export const ErrorFallbackRoutes = ({
  resetErrorBoundary,
}: {
  resetErrorBoundary: () => void
}) => {
  const { t } = useTranslation('app')

  return (
    <div className={classes.wrapper}>
      <h3 className={classes.withMargin}>
        <FontAwesomeIcon icon={faBug} transform="grow-25" />
      </h3>
      <h1>{t('errorUnknown')}</h1>
      <h2>
        <button
          type="button"
          onClick={() => resetErrorBoundary && resetErrorBoundary()}
        >
          {t('clickToReload')}
        </button>
      </h2>
    </div>
  )
}

interface ErrorFallbackProps {
  resetErrorBoundary?: () => void
}
export const ErrorFallbackModal: FC = (props: ErrorFallbackProps) => {
  const { resetErrorBoundary } = props
  const { t } = useTranslation('app')

  return (
    <div className={classNames(classes.wrapper, classes.modal)}>
      <h2>{t('errorUnknown')}</h2>
      <h4>
        <button
          type="button"
          onClick={() => resetErrorBoundary && resetErrorBoundary()}
        >
          {t('clickToReload')}
        </button>
      </h4>
    </div>
  )
}
