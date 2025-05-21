// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
  faAdd,
  faArrowDown,
  faCircleDown,
  faCircleXmark,
  faCoins,
  faUnlock,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTranslation } from 'react-i18next'
import type { BondFor } from 'types'
import { QuickAction } from 'ui-buttons'
import type { ButtonQuickActionProps } from 'ui-buttons/types'
import { useOverlay } from 'ui-overlay'

export const Staking = ({ bondFor }: { bondFor: BondFor }) => {
  const { t } = useTranslation('pages')
  const { openModal } = useOverlay().modal

  const actions: ButtonQuickActionProps[] = []

  if (bondFor === 'pool') {
    actions.push(
      ...[
        {
          onClick: () => {
            openModal({
              key: 'ClaimReward',
              options: { claimType: 'withdraw' },
              size: 'sm',
            })
          },
          disabled: false,
          Icon: () => (
            <FontAwesomeIcon transform="grow-2" icon={faCircleDown} />
          ),
          label: t('withdraw'),
        },
        {
          onClick: () => {
            openModal({
              key: 'ClaimReward',
              options: { claimType: 'bond' },
              size: 'sm',
            })
          },
          disabled: false,
          Icon: () => <FontAwesomeIcon transform="grow-2" icon={faCoins} />,
          label: t('compound'),
        },
      ]
    )
  } else {
    actions.push({
      onClick: () => {
        openModal({
          key: 'ClaimPayouts',
          size: 'sm',
        })
      },
      disabled: false,
      Icon: () => <FontAwesomeIcon transform="grow-2" icon={faCircleDown} />,
      label: t('claim', { ns: 'modals' }),
    })
  }

  actions.push(
    ...[
      {
        onClick: () => {
          openModal({
            key: 'Bond',
            options: { bondFor },
            size: 'sm',
          })
        },
        disabled: false,
        Icon: () => <FontAwesomeIcon transform="grow-2" icon={faAdd} />,
        label: t('unstake', { ns: 'pages' }),
      },
      {
        onClick: () => {
          openModal({
            key: 'Unbond',
            options: { bondFor },
            size: 'sm',
          })
        },
        disabled: false,
        Icon: () => <FontAwesomeIcon transform="grow-2" icon={faUnlock} />,
        label: t('unstake', { ns: 'pages' }),
      },
    ]
  )

  if (bondFor === 'nominator') {
    actions.push(
      ...[
        {
          onClick: () => {
            openModal({ key: 'UpdatePayee', size: 'sm' })
          },
          disabled: false,
          Icon: () => <FontAwesomeIcon transform="grow-2" icon={faArrowDown} />,
          label: t('payee.label', { ns: 'app' }),
        },
        {
          onClick: () => {
            openModal({
              key: 'Unstake',
              size: 'sm',
            })
          },
          disabled: false,
          Icon: () => (
            <FontAwesomeIcon transform="grow-2" icon={faCircleXmark} />
          ),
          label: t('stop', { ns: 'pages' }),
        },
      ]
    )
  } else {
    actions.push({
      onClick: () => {
        openModal({
          key: 'LeavePool',
          size: 'sm',
        })
      },
      disabled: false,
      Icon: () => <FontAwesomeIcon transform="grow-2" icon={faCircleXmark} />,
      label: t('stop', { ns: 'pages' }),
    })
  }

  return (
    <QuickAction.Container>
      {actions.map((action, i) => (
        <QuickAction.Button key={`action-${i}`} {...action} />
      ))}
    </QuickAction.Container>
  )
}
