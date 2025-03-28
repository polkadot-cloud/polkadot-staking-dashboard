// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useValidators } from 'contexts/Validators/ValidatorEntries'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { ButtonPrimary } from 'ui-buttons'
import { Padding, Title } from 'ui-core/modal'
import { Close, useOverlay } from 'ui-overlay'
import { useInviteGenerator } from '../hooks/useInviteGenerator'
import { ShareOptions } from './ShareOptions'

// Define types for validator data
interface ValidatorIdentity {
  display?: string
}

interface Validator {
  address: string
  identity?: ValidatorIdentity
}

export const InviteModal = () => {
  const { t } = useTranslation('invite')
  const { setModalResize } = useOverlay().modal

  const [activeTab, setActiveTab] = useState<'pool' | 'validator'>('pool')
  const [inviteGenerated, setInviteGenerated] = useState(false)

  const poolInviteGenerator = useInviteGenerator({ type: 'pool' })
  const validatorInviteGenerator = useInviteGenerator({ type: 'validator' })

  const { getValidators } = useValidators()

  // Get validators
  const validators = getValidators()

  // Get the active generator based on the selected tab
  const activeGenerator =
    activeTab === 'pool' ? poolInviteGenerator : validatorInviteGenerator

  // Generate the invite URL
  const handleGenerateInvite = () => {
    activeGenerator.generateInviteUrl()
    setInviteGenerated(true)
  }

  // Get entity name and address for display in share options
  const getEntityDetails = useCallback(() => {
    if (activeTab === 'pool' && poolInviteGenerator.selectedPool) {
      const poolDetails = poolInviteGenerator.getPoolDetails(
        poolInviteGenerator.selectedPool
      )
      return {
        name: poolDetails.name || `Pool #${poolInviteGenerator.selectedPool}`,
        address:
          poolDetails.addresses?.stash || poolInviteGenerator.selectedPool,
      }
    } else if (
      activeTab === 'validator' &&
      validatorInviteGenerator.selectedValidators.length > 0
    ) {
      const validatorAddress = validatorInviteGenerator.selectedValidators[0]
      const validator = validators.find(
        (v) => v.address === validatorAddress
      ) as Validator | undefined

      return {
        name: validator?.identity?.display || validatorAddress,
        address: validatorAddress,
      }
    }
    return { name: '', address: '' }
  }, [
    activeTab,
    poolInviteGenerator,
    validatorInviteGenerator.selectedValidators,
    validators,
  ])

  // Use useMemo to calculate entityDetails only when dependencies change
  const entityDetails = useMemo(() => getEntityDetails(), [getEntityDetails])

  // Resize modal when content changes
  useEffect(() => {
    setModalResize()
  }, [inviteGenerated, activeTab])

  // Get nominated validators for the active account
  const nominatedValidators = validatorInviteGenerator.nominatedValidators || []

  return (
    <>
      <Close />
      <Padding>
        <Title>{t('inviteToStake')}</Title>

        {!inviteGenerated ? (
          <>
            <TabContainer>
              <TabButton
                active={activeTab === 'pool'}
                onClick={() => setActiveTab('pool')}
              >
                {t('poolInvite')}
              </TabButton>
              <TabButton
                active={activeTab === 'validator'}
                onClick={() => setActiveTab('validator')}
              >
                {t('validatorInvite')}
              </TabButton>
            </TabContainer>

            <ContentSection>
              {activeTab === 'pool' ? (
                <>
                  <SectionTitle>{t('selectPool')}</SectionTitle>
                  {poolInviteGenerator.userPools.length > 0 ? (
                    <SelectWrapper>
                      <label>{t('selectPoolLabel')}</label>
                      <StyledSelect
                        value={poolInviteGenerator.selectedPool || ''}
                        onChange={(e) =>
                          poolInviteGenerator.setSelectedPool(e.target.value)
                        }
                      >
                        <option value="" disabled>
                          {t('selectPoolPlaceholder')}
                        </option>
                        {poolInviteGenerator.userPools.map((pool) => (
                          <option key={pool.id} value={pool.id}>
                            {`Pool #${pool.id}`}
                          </option>
                        ))}
                      </StyledSelect>
                    </SelectWrapper>
                  ) : (
                    <EmptyState>{t('noPoolsFound')}</EmptyState>
                  )}
                </>
              ) : (
                <>
                  <SectionTitle>{t('selectValidators')}</SectionTitle>
                  {nominatedValidators.length > 0 ? (
                    <ValidatorList>
                      {nominatedValidators.map((validator: Validator) => (
                        <ValidatorItem key={validator.address}>
                          <ValidatorDisplay>
                            <ValidatorAddress>
                              {validator.address}
                            </ValidatorAddress>
                            {validator.identity?.display && (
                              <ValidatorName>
                                {validator.identity.display}
                              </ValidatorName>
                            )}
                          </ValidatorDisplay>
                        </ValidatorItem>
                      ))}
                    </ValidatorList>
                  ) : (
                    <EmptyState>{t('noValidatorsFound')}</EmptyState>
                  )}
                </>
              )}
            </ContentSection>

            <ButtonContainer>
              <GenerateButton
                text={t('generateInvite')}
                disabled={
                  (activeTab === 'pool' && !poolInviteGenerator.selectedPool) ||
                  (activeTab === 'validator' &&
                    validatorInviteGenerator.selectedValidators.length === 0)
                }
                onClick={handleGenerateInvite}
              />
            </ButtonContainer>
          </>
        ) : (
          <ShareOptions
            inviteUrl={activeGenerator.inviteUrl}
            copiedToClipboard={activeGenerator.copiedToClipboard}
            copyInviteUrl={activeGenerator.copyInviteUrl}
            type={activeTab}
            entityName={entityDetails.name}
            entityAddress={entityDetails.address}
          />
        )}
      </Padding>
    </>
  )
}

const TabContainer = styled.div`
  display: flex;
  margin-bottom: 1.5rem;
  border-radius: 0.75rem;
  overflow: hidden;
  background-color: var(--background-primary);
`

const TabButton = styled.button<{ active: boolean }>`
  flex: 1;
  padding: 0.75rem;
  border: none;
  background-color: ${({ active }) =>
    active ? 'var(--accent-color-primary)' : 'transparent'};
  color: ${({ active }) =>
    active ? 'var(--text-color-invert)' : 'var(--text-color-primary)'};
  font-weight: ${({ active }) => (active ? '600' : '400')};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ active }) =>
      active ? 'var(--accent-color-primary)' : 'var(--background-secondary)'};
  }
`

const ContentSection = styled.div`
  margin-bottom: 1.5rem;
`

const SectionTitle = styled.h3`
  margin: 0 0 1rem 0;
  font-size: 1rem;
`

const SelectWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;

  label {
    font-size: 0.9rem;
    color: var(--text-color-secondary);
  }
`

const StyledSelect = styled.select`
  width: 100%;
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid var(--border-primary-color);
  background-color: var(--background-primary);
  color: var(--text-color-primary);
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: var(--accent-color-primary);
  }
`

const EmptyState = styled.div`
  padding: 2rem;
  text-align: center;
  background-color: var(--background-primary);
  border-radius: 0.75rem;
  color: var(--text-color-secondary);
`

const ValidatorList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 300px;
  overflow-y: auto;
  padding: 0.5rem;
  background-color: var(--background-primary);
  border-radius: 0.75rem;
`

const ValidatorItem = styled.div`
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: var(--background-secondary);
`

const ValidatorDisplay = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`

const ValidatorAddress = styled.div`
  font-family: monospace;
  font-size: 0.8rem;
  color: var(--text-color-secondary);
`

const ValidatorName = styled.div`
  font-weight: 500;
`

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`

const GenerateButton = styled(ButtonPrimary)`
  padding: 0.75rem 1.5rem;
`
