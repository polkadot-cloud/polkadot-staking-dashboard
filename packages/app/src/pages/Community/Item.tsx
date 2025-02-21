// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faTwitter } from '@fortawesome/free-brands-svg-icons'
import {
  faEnvelope,
  faExternalLink,
  faServer,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useNetwork } from 'contexts/Network'
import { Suspense, lazy, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useOverlay } from 'ui-overlay'
import { ItemWrapper } from './Wrappers'
import { useCommunitySections } from './context'
import type { ItemProps } from './types'

export const Item = ({ item, actionable }: ItemProps) => {
  const { t } = useTranslation('pages')
  const { openModal } = useOverlay().modal
  const { network } = useNetwork()

  const {
    bio,
    name,
    email,
    x,
    website,
    icon,
    validators: entityAllValidators,
  } = item
  const validatorCount = entityAllValidators[network]?.length ?? 0

  const { setActiveSection, setActiveItem, setScrollPos } =
    useCommunitySections()

  const listItem = {
    hidden: {
      opacity: 0,
      y: 25,
      transition: {
        duration: 0.4,
      },
    },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        type: 'spring',
        bounce: 0.2,
      },
    },
  }

  const Thumbnail = useMemo(
    () => lazy(() => import(`../../config/validators/${icon}.tsx`)),
    []
  )

  return (
    <ItemWrapper
      whileHover={{ scale: 1.005 }}
      transition={{ duration: 0.15 }}
      variants={listItem}
    >
      <div className="inner">
        <section>
          <Suspense fallback={<div />}>
            <Thumbnail />
          </Suspense>
        </section>
        <section>
          <h3>
            {name}
            <button
              type="button"
              onClick={() => openModal({ key: 'Bio', options: { name, bio } })}
              className="active"
            >
              <span>{t('bio')}</span>
            </button>
          </h3>

          <div className="stats">
            <button
              className={actionable ? 'active' : undefined}
              disabled={!actionable}
              type="button"
              onClick={() => {
                if (actionable) {
                  setActiveSection(1)
                  setActiveItem(item)
                  setScrollPos(window.scrollY)
                }
              }}
            >
              <FontAwesomeIcon
                icon={faServer}
                className="icon-left"
                transform="shrink-1"
              />
              <h4>
                {t('validator', {
                  count: validatorCount,
                })}
              </h4>
            </button>
            {email !== undefined && (
              <button
                type="button"
                className="active"
                onClick={() => {
                  window.open(`mailto:${email}`, '_blank')
                }}
              >
                <FontAwesomeIcon
                  icon={faEnvelope}
                  transform="shrink-1"
                  className="icon-left"
                />
                <h4>{t('email')}</h4>
                <FontAwesomeIcon
                  icon={faExternalLink}
                  className="icon-right"
                  transform="shrink-3"
                />
              </button>
            )}
            {x !== undefined && (
              <button
                type="button"
                className="active"
                onClick={() => {
                  window.open(`https://twitter.com/${x}`, '_blank')
                }}
              >
                <FontAwesomeIcon icon={faTwitter} className="icon-left" />
                <h4>{x}</h4>
                <FontAwesomeIcon
                  icon={faExternalLink}
                  className="icon-right"
                  transform="shrink-3"
                />
              </button>
            )}
            {website !== undefined && (
              <button
                type="button"
                className="active"
                onClick={() => {
                  window.open(website, '_blank')
                }}
              >
                <h4>{t('website')}</h4>
                <FontAwesomeIcon
                  icon={faExternalLink}
                  className="icon-right"
                  transform="shrink-3"
                />
              </button>
            )}
          </div>
        </section>
      </div>
    </ItemWrapper>
  )
}
