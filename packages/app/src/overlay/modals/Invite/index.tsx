// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faClipboard, faLink } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Title } from 'library/Modal/Title'
import { useTranslation } from 'react-i18next'
import { Padding } from 'ui-core/modal'
import { SupportWrapper } from './Wrapper'

export const Invite = () => {
  const { t } = useTranslation('modals')

  const generateInviteLink = (type: string) => {
    // Add link generation logic here
    const link = `https://staking.polkadot.cloud/invite/${type}/123`
    navigator.clipboard.writeText(link)
  }

  return (
    <>
      <Title />
      <Padding verticalOnly>
        <SupportWrapper>
          <FontAwesomeIcon icon={faLink} transform="shrink-0" />
          <h4>{t('generateInviteLink')}</h4>
          <h1>
            <button type="button" onClick={() => generateInviteLink('pool')}>
              {t('generatePoolInvite')} &nbsp;
              <FontAwesomeIcon icon={faClipboard} transform="shrink-4" />
            </button>
          </h1>
          <h1>
            <button
              type="button"
              onClick={() => generateInviteLink('validator')}
            >
              {t('generateValidatorInvite')} &nbsp;
              <FontAwesomeIcon icon={faClipboard} transform="shrink-4" />
            </button>
          </h1>
        </SupportWrapper>
      </Padding>
    </>
  )
}
