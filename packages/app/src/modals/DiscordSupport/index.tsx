// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import DiscordOutlineSvg from 'assets/svg/discordOutline.svg?react'
import { DiscordSupportUrl } from 'consts'
import { ModalPadding } from 'kits/Overlay/structure/ModalPadding'
import { Title } from 'library/Modal/Title'
import { useTranslation } from 'react-i18next'
import { SupportWrapper } from './Wrapper'

export const DiscordSupport = () => {
  const { t } = useTranslation('modals')
  return (
    <>
      <Title />
      <ModalPadding verticalOnly>
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
      </ModalPadding>
    </>
  )
}
