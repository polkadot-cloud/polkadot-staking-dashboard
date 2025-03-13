// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useBalances } from 'contexts/Balances'
import { useNetwork } from 'contexts/Network'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { styled } from 'styled-components'
import { ButtonPrimary, ButtonSecondary } from 'ui-buttons'
import { CardHeader } from 'ui-core/base'
import { planckToUnitBn } from 'utils'

// Define the minimum balance required for direct nomination
const DIRECT_NOMINATION_MINIMUM = 250

// Styled components for the recommendation UI
const RecommendationWrapper = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  height: 100%;
`

const RecommendationHeader = styled.div`
  margin-bottom: 1.5rem;
`

const BalanceDisplay = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 1.1rem;

  span.amount {
    font-weight: 600;
    margin-left: 0.5rem;
  }
`

const RecommendationBox = styled.div`
  background: var(--button-primary-background);
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;

  h3 {
    color: var(--text-color-primary);
    margin-top: 0;
    margin-bottom: 0.75rem;
    display: flex;
    align-items: center;
    font-size: 1.2rem;
  }
`

const BulletList = styled.ul`
  list-style-type: none;
  padding-left: 0;
  margin-bottom: 1.5rem;

  li {
    position: relative;
    padding-left: 1.5rem;
    margin-bottom: 0.75rem;
    line-height: 1.4;

    &:before {
      content: '•';
      position: absolute;
      left: 0.25rem;
      color: var(--network-color-primary);
      font-weight: bold;
    }
  }
`

const AlternativeBox = styled.div`
  background: var(--background-primary);
  border: 1px solid var(--border-primary-color);
  border-radius: 1rem;
  padding: 1.5rem;
  margin-top: 1rem;

  h4 {
    margin-top: 0;
    margin-bottom: 0.75rem;
    font-size: 1.1rem;
  }

  p {
    margin-bottom: 1rem;
    opacity: 0.85;
  }
`

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  flex-wrap: wrap;
`

export const StakingRecommendation = () => {
  const { t } = useTranslation('pages')
  const { activeAccount } = useActiveAccounts()
  const { getBalance } = useBalances()
  const navigate = useNavigate()
  const {
    networkData: { units, unit },
  } = useNetwork()

  const balance = getBalance(activeAccount)
  const { free } = balance
  const freeBalance = planckToUnitBn(free, units)

  // Determine if the user has enough balance for direct nomination
  const hasEnoughForDirectNomination = freeBalance.isGreaterThanOrEqualTo(
    DIRECT_NOMINATION_MINIMUM
  )

  return (
    <>
      <CardHeader>
        <h4>{t('smartStakingRecommendation')}</h4>
      </CardHeader>
      <RecommendationWrapper>
        {!activeAccount ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              padding: '2rem',
            }}
          >
            <p style={{ fontSize: '1.1rem', textAlign: 'center' }}>
              {t('connectWalletForRecommendation')}
            </p>
          </div>
        ) : (
          <>
            <RecommendationHeader>
              <BalanceDisplay>
                {t('yourBalance')}:{' '}
                <span className="amount">
                  {freeBalance.toFormat()} {unit}
                </span>
              </BalanceDisplay>
            </RecommendationHeader>

            {hasEnoughForDirectNomination ? (
              // Recommendation for balance >= 250 DOT
              <>
                <RecommendationBox>
                  <h3>{t('recommendedDirectNomination')}</h3>
                  <BulletList>
                    <li>{t('directNominationBenefit1')}</li>
                    <li>{t('directNominationBenefit2')}</li>
                    <li>{t('directNominationBenefit3')}</li>
                  </BulletList>

                  <ActionButtons>
                    <ButtonPrimary
                      text={t('startDirectNomination')}
                      onClick={() => navigate('/nominate')}
                    />
                  </ActionButtons>
                </RecommendationBox>

                <AlternativeBox>
                  <h4>{t('wantToTryPoolStaking')}</h4>
                  <p>{t('poolStakingAlternativeIntro')}</p>
                  <BulletList>
                    <li>{t('poolStakingBenefit1')}</li>
                    <li>{t('poolStakingBenefit2')}</li>
                    <li>{t('poolStakingBenefit3')}</li>
                  </BulletList>

                  <ButtonSecondary
                    text={t('explorePoolStaking')}
                    onClick={() => navigate('/pools')}
                  />
                </AlternativeBox>
              </>
            ) : (
              // Recommendation for balance < 250 DOT
              <>
                <RecommendationBox>
                  <h3>{t('recommendedPoolStaking')}</h3>
                  <BulletList>
                    <li>{t('poolStakingRecommendBenefit1')}</li>
                    <li>{t('poolStakingRecommendBenefit2')}</li>
                    <li>{t('poolStakingRecommendBenefit3')}</li>
                  </BulletList>

                  <ActionButtons>
                    <ButtonPrimary
                      text={t('joinStakingPool')}
                      onClick={() => navigate('/pools')}
                    />
                  </ActionButtons>
                </RecommendationBox>

                <AlternativeBox>
                  <h4>{t('aboutDirectNomination')}</h4>
                  <p>{t('directNominationUnavailable')}</p>
                  <BulletList>
                    <li>
                      {t('directNominationRequirement', {
                        minimum: DIRECT_NOMINATION_MINIMUM,
                        unit,
                      })}
                    </li>
                    <li>
                      {t('yourCurrentBalance', {
                        balance: freeBalance.toFormat(),
                        unit,
                      })}
                    </li>
                    <li>{t('considerPoolStaking')}</li>
                  </BulletList>
                </AlternativeBox>
              </>
            )}
          </>
        )}
      </RecommendationWrapper>
    </>
  )
}
