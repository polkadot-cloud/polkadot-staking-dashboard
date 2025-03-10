// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { ButtonPrimary } from 'ui-buttons'
import { CardHeader } from 'ui-core/base'
import { Wrapper } from './Wrappers'

export const StakingOptions = () => {
  const { t } = useTranslation('pages')
  const navigate = useNavigate()

  return (
    <>
      <CardHeader>
        <h4>{t('stakingOptions')}</h4>
      </CardHeader>
      <Wrapper>
        <div className="content">
          <div className="options-container">
            <div className="option">
              <h2>{t('nominationPools')}</h2>
              <p>{t('nominationPoolsDescription')}</p>
              <p>{t('nominationPoolsBenefits')}</p>
              <div className="key-points">
                <h3>{t('keyPoints')}</h3>
                <ul>
                  <li>{t('poolKeyPoint1')}</li>
                  <li>{t('poolKeyPoint2')}</li>
                  <li>{t('poolKeyPoint3')}</li>
                </ul>
              </div>
              <div className="actions">
                <ButtonPrimary
                  text={t('explorePools')}
                  onClick={() => navigate('/pools')}
                />
              </div>
            </div>

            <div className="option">
              <h2>{t('soloNominating')}</h2>
              <p>{t('soloNominatingDescription')}</p>
              <p>{t('soloNominatingBenefits')}</p>
              <div className="key-points">
                <h3>{t('keyPoints')}</h3>
                <ul>
                  <li>{t('soloKeyPoint1')}</li>
                  <li>{t('soloKeyPoint2')}</li>
                  <li>{t('soloKeyPoint3')}</li>
                </ul>
              </div>
              <div className="actions">
                <ButtonPrimary
                  text={t('exploreNominating')}
                  onClick={() => navigate('/nominate')}
                />
              </div>
            </div>
          </div>
        </div>
      </Wrapper>
    </>
  )
}
