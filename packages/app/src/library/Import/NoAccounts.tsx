// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import type { FunctionComponent, ReactNode, SVGProps } from 'react'
import { useTranslation } from 'react-i18next'
import { ButtonSecondary } from 'ui-buttons'
import { useOverlay } from 'ui-overlay'
import { NoAccountsWrapper } from './Wrappers'

export const NoAccounts = ({
  children,
  text,
  Icon,
}: {
  children: ReactNode
  text: string
  Icon: FunctionComponent<SVGProps<SVGSVGElement>>
}) => {
  const { t } = useTranslation('modals')
  const { replaceModal } = useOverlay().modal

  return (
    <>
      <div style={{ display: 'flex', padding: '1rem' }}>
        <h1>
          <ButtonSecondary
            text={t('back')}
            iconLeft={faChevronLeft}
            iconTransform="shrink-3"
            onClick={async () =>
              replaceModal({ key: 'Connect', options: { disableScroll: true } })
            }
          />
        </h1>
      </div>
      <NoAccountsWrapper>
        <Icon className="icon" />
        <h3>{text}</h3>
        {children}
      </NoAccountsWrapper>
    </>
  )
}
