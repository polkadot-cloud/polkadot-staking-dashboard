// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import DiscordOutlineSvg from 'assets/svg/brands/discordOutline.svg?react'
import { DiscordSupportUrl } from 'consts'
import { Title } from 'library/Modal/Title'
import { useTranslation } from 'react-i18next'
import { Padding } from 'ui-core/modal'
import { SupportWrapper } from './Wrapper'

export const DiscordSupport = () => {
  const { t } = useTranslation('modals')
  return (
    <>
      <Title />
      <Padding verticalOnly>
        <SupportWrapper>
          <DiscordOutlineSvg />
          <h4>{t('supportDiscord')}</h4>
          <h1>
            <a href={DiscordSupportUrl} target="_blank" rel="noreferrer">
              {t('goToDiscord')} &nbsp;
              <FontAwesomeIcon icon={faExternalLinkAlt} transform="shrink-4" />
            </a>
          </h1>
        </SupportWrapper>
      </Padding>
    </>
  )
}
