// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faWarning } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { OnlineStatus } from 'controllers/OnlineStatus'
import { isCustomEvent } from 'controllers/utils'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Offline as Wrapper } from 'ui-core/base'
import { useEventListener } from 'usehooks-ts'

export const Offline = () => {
  const { t } = useTranslation('base')
  const [offline, setOffline] = useState<boolean>(false)

  const handleOnlineStatus = (e: Event): void => {
    if (isCustomEvent(e)) {
      const { online } = e.detail
      setOffline(!online)
    }
  }

  useEffect(() => {
    OnlineStatus.initOnlineEvents()
  }, [])

  useEventListener(
    'online-status',
    handleOnlineStatus,
    useRef<Document>(document)
  )

  if (!offline) {
    return null
  }
  return (
    <Wrapper>
      <FontAwesomeIcon icon={faWarning} transform="grow-4" />
      <h3>{t('offline')}</h3>
    </Wrapper>
  )
}
