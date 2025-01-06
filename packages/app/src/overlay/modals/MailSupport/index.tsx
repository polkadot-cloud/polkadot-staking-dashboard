// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import MailSVG from 'assets/svg/icons/mail.svg?react'
import { MailSupportAddress } from 'consts'
import { Title } from 'library/Modal/Title'
import { useTranslation } from 'react-i18next'
import { Padding } from 'ui-core/modal'
import { SupportWrapper } from './Wrapper'

export const MailSupport = () => {
  const { t } = useTranslation('modals')
  return (
    <>
      <Title />
      <Padding verticalOnly>
        <SupportWrapper>
          <MailSVG />
          <h4>{t('supportEmail')}</h4>
          <h1>{MailSupportAddress}</h1>
        </SupportWrapper>
      </Padding>
    </>
  )
}
