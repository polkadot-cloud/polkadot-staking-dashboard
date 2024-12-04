// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useDotLottieButton } from 'hooks/useDotLottieButton'
import { useTranslation } from 'react-i18next'
import { ItemInnerWrapper, ItemWrapper, ItemsWrapper } from './Wrappers'

export const Syncing = () => {
  const { t } = useTranslation('tips')
  const { icon } = useDotLottieButton('refresh', { autoLoop: true })

  return (
    <ItemsWrapper
      initial="show"
      animate={undefined}
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
        },
      }}
    >
      <ItemWrapper>
        <ItemInnerWrapper>
          <section
            style={{
              marginRight: '0.5rem',
              width: '1.5rem',
              height: '1.5rem',
            }}
          >
            {icon}
          </section>
          <section>
            <div className="desc">
              <button type="button" disabled>
                <h4>{t('module.oneMoment')}...</h4>
              </button>
            </div>
          </section>
        </ItemInnerWrapper>
      </ItemWrapper>
    </ItemsWrapper>
  )
}
