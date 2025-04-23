// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Polkicon } from '@w3ux/react-polkicon'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useActivePool } from 'contexts/Pools/ActivePool'
import { useStaking } from 'contexts/Staking'
import { useValidators } from 'contexts/Validators/ValidatorEntries'
import { getIdentityDisplay } from 'library/List/Utils'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import type { Identity, Validator } from 'types'
import { ButtonPrimary } from 'ui-buttons'
import { Padding, Title } from 'ui-core/modal'
import { Close, useOverlay } from 'ui-overlay'
import { useInviteGenerator } from '../hooks/useInviteGenerator'
import { ShareOptions } from './ShareOptions'

// Extend Validator interface to include identity
interface ValidatorWithIdentity extends Validator {
  identity?: Identity
}

export const InviteModal = () => {
  const { t } = useTranslation('invite')
  const { setModalResize } = useOverlay().modal
  const { inPool, activePool } = useActivePool()
  const { inSetup } = useStaking()
  const { activeAccount } = useActiveAccounts()
  const { validatorIdentities, validatorSupers, validatorsFetched } =
    useValidators()

  const [inviteGenerated, setInviteGenerated] = useState(false)
  const [selectedValidators, setSelectedValidators] = useState<string[]>([])

  // Determine invite type based on user's staking status
  const inviteType = useMemo(() => {
    if (inPool()) {
      return 'pool'
    }
    if (!inSetup()) {
      return 'validator'
    }
    return null
  }, [inPool, inSetup])

  const poolInviteGenerator = useInviteGenerator({ type: 'pool' })
  const validatorInviteGenerator = useInviteGenerator({ type: 'validator' })

  // Get the active generator based on the invite type
  const activeGenerator = useMemo(
    () =>
      inviteType === 'pool' ? poolInviteGenerator : validatorInviteGenerator,
    [inviteType, poolInviteGenerator, validatorInviteGenerator]
  )

  // Get nominated validators for the active account
  const nominatedValidators = useMemo(
    () =>
      (validatorInviteGenerator.nominatedValidators ||
        []) as ValidatorWithIdentity[],
    [validatorInviteGenerator.nominatedValidators]
  )

  // Initialize selected validators when nominatedValidators are loaded
  useEffect(() => {
    if (nominatedValidators.length > 0 && selectedValidators.length === 0) {
      setSelectedValidators(nominatedValidators.map((v) => v.address))
    }
  }, [nominatedValidators])

  // Handle generate invite button click
  const handleGenerateInvite = useCallback(() => {
    if (inviteType === 'validator' && selectedValidators.length > 0) {
      validatorInviteGenerator.setSelectedValidators(selectedValidators)
      validatorInviteGenerator.generateInviteUrl()
    } else if (inviteType === 'pool' && activePool?.id) {
      poolInviteGenerator.setSelectedPool(activePool.id.toString())
      poolInviteGenerator.generateInviteUrl()
    }
    setInviteGenerated(true)
  }, [
    inviteType,
    selectedValidators,
    validatorInviteGenerator,
    poolInviteGenerator,
    activePool,
  ])

  // Handle pool selection only - moved inside useEffect to prevent infinite loop
  useEffect(() => {
    if (inviteType === 'pool' && activePool?.id) {
      poolInviteGenerator.setSelectedPool(activePool.id.toString())
      poolInviteGenerator.generateInviteUrl()
      setInviteGenerated(true)
    }
  }, [inviteType, activePool?.id, poolInviteGenerator])

  // Toggle validator selection
  const toggleValidator = useCallback((address: string) => {
    setSelectedValidators((prev) => {
      const newSelection = prev.includes(address)
        ? prev.filter((a) => a !== address)
        : [...prev, address]
      return newSelection
    })
  }, [])

  // Resize modal when content changes
  useEffect(() => {
    // Use requestAnimationFrame to debounce the resize
    const timeoutId = setTimeout(() => {
      setModalResize()
    }, 100)

    return () => clearTimeout(timeoutId)
  }, [inviteGenerated, selectedValidators.length])

  if (!activeAccount) {
    return (
      <>
        <Close />
        <Padding>
          <Title>{t('inviteToStake')}</Title>
          <EmptyState>{t('connectWallet')}</EmptyState>
        </Padding>
      </>
    )
  }

  if (!inviteType) {
    return (
      <>
        <Close />
        <Padding>
          <Title>{t('inviteToStake')}</Title>
          <EmptyState>{t('noCurrentNominations')}</EmptyState>
        </Padding>
      </>
    )
  }

  if (!activePool && inviteType === 'pool') {
    return (
      <>
        <Close />
        <Padding>
          <Title>{t('inviteToStake')}</Title>
          <EmptyState>{t('noPoolsFound')}</EmptyState>
        </Padding>
      </>
    )
  }

  return (
    <>
      <Close />
      <Padding>
        <Title>{t('inviteToStake')}</Title>

        {inviteType === 'pool' ? (
          <>
            <ContentSection>
              <SectionHeader>
                <SectionTitle>{t('poolInvite')}</SectionTitle>
              </SectionHeader>
              {activePool ? (
                <PoolItem>
                  <PoolDisplay>
                    <PoolIcon>
                      <Polkicon
                        address={activePool.addresses.stash}
                        fontSize="2.5rem"
                      />
                    </PoolIcon>
                    <PoolInfo>
                      <PoolName>
                        {activePool.id
                          ? `Pool #${activePool.id}`
                          : activePool.id}
                      </PoolName>
                      <PoolAddress>{activePool.addresses.stash}</PoolAddress>
                    </PoolInfo>
                  </PoolDisplay>
                </PoolItem>
              ) : (
                <EmptyState>{t('noPoolsFound')}</EmptyState>
              )}
            </ContentSection>
            <ShareOptions
              inviteUrl={poolInviteGenerator.inviteUrl}
              copiedToClipboard={poolInviteGenerator.copiedToClipboard}
              copyInviteUrl={poolInviteGenerator.copyInviteUrl}
            />
          </>
        ) : !inviteGenerated ? (
          <>
            <ContentSection>
              <SectionHeader>
                <SectionTitle>{t('selectValidators')}</SectionTitle>
                <SelectedCount>
                  {selectedValidators.length} / {nominatedValidators.length}{' '}
                  {t('selected')}
                </SelectedCount>
              </SectionHeader>
              {nominatedValidators.length > 0 ? (
                <ValidatorList>
                  {nominatedValidators.map((validator) => {
                    const validatorWithIdentity =
                      validator as ValidatorWithIdentity
                    const isSelected = selectedValidators.includes(
                      validatorWithIdentity.address
                    )
                    const identityDisplay =
                      validatorsFetched === 'synced'
                        ? getIdentityDisplay(
                            validatorIdentities[validatorWithIdentity.address],
                            validatorSupers[validatorWithIdentity.address]
                          ).node
                        : null

                    return (
                      <ValidatorItem
                        key={validatorWithIdentity.address}
                        onClick={() =>
                          toggleValidator(validatorWithIdentity.address)
                        }
                        $selected={isSelected}
                      >
                        <ValidatorDisplay>
                          <ValidatorIcon>
                            <Polkicon
                              address={validatorWithIdentity.address}
                              fontSize="2.5rem"
                            />
                          </ValidatorIcon>
                          <ValidatorInfo>
                            <ValidatorName>
                              {identityDisplay ||
                                validatorWithIdentity.address.slice(0, 6) +
                                  '...' +
                                  validatorWithIdentity.address.slice(-6)}
                            </ValidatorName>
                            <ValidatorAddress>
                              {validatorWithIdentity.address}
                            </ValidatorAddress>
                          </ValidatorInfo>
                          <SelectionIndicator $selected={isSelected}>
                            <FontAwesomeIcon icon={faCheck} />
                          </SelectionIndicator>
                        </ValidatorDisplay>
                      </ValidatorItem>
                    )
                  })}
                </ValidatorList>
              ) : (
                <EmptyState>{t('noValidatorsFound')}</EmptyState>
              )}
            </ContentSection>

            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginTop: '1rem',
              }}
            >
              <ButtonPrimary
                text={t('generateInvite')}
                onClick={handleGenerateInvite}
                size="md"
                style={{ padding: '0.75rem 1.5rem' }}
                disabled={selectedValidators.length === 0}
              />
            </div>
          </>
        ) : (
          <>
            <ValidatorSummary>
              <SectionTitle>{t('selectedValidators')}</SectionTitle>
              <SelectedValidatorsList>
                {selectedValidators.map((address) => {
                  const validator = nominatedValidators.find(
                    (v) => v.address === address
                  )
                  const identityDisplay =
                    validatorsFetched === 'synced' && validator
                      ? getIdentityDisplay(
                          validatorIdentities[validator.address],
                          validatorSupers[validator.address]
                        ).node
                      : null
                  return (
                    <SelectedValidatorItem key={address}>
                      <Polkicon address={address} fontSize="1.5rem" />
                      <span>
                        {identityDisplay ||
                          address.slice(0, 6) + '...' + address.slice(-6)}
                      </span>
                    </SelectedValidatorItem>
                  )
                })}
              </SelectedValidatorsList>
            </ValidatorSummary>
            <ShareOptions
              inviteUrl={activeGenerator.inviteUrl}
              copiedToClipboard={activeGenerator.copiedToClipboard}
              copyInviteUrl={activeGenerator.copyInviteUrl}
            />
          </>
        )}
      </Padding>
    </>
  )
}

const ContentSection = styled.div`
  margin: 1rem 0;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
`

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`

const SectionTitle = styled.h3`
  font-size: 1.1rem;
  margin: 0;
  font-family: InterSemiBold, sans-serif;
`

const SelectedCount = styled.div`
  font-size: 0.9rem;
  color: var(--text-color-secondary);
`

const ValidatorList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
  max-height: 400px;
  overflow-y: auto;
`

const ValidatorItem = styled.div<{ $selected: boolean }>`
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  background-color: var(--button-secondary-background);
  border: 1.5px solid
    ${({ $selected }) =>
      $selected
        ? 'var(--accent-color-primary)'
        : 'var(--border-primary-color)'};
  cursor: pointer;
  transition: all var(--transition-duration);

  &:hover {
    border-color: var(--accent-color-transparent);
    background-color: var(--button-hover-background);
  }
`

const ValidatorDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`

const ValidatorIcon = styled.div`
  flex-shrink: 0;
`

const ValidatorInfo = styled.div`
  flex: 1;
  min-width: 0;
`

const ValidatorName = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
  font-family: InterSemiBold, sans-serif;
  color: var(--text-color-primary);
`

const ValidatorAddress = styled.div`
  font-family: monospace;
  font-size: 0.8rem;
  color: var(--text-color-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const SelectionIndicator = styled.div<{ $selected: boolean }>`
  width: 24px;
  height: 24px;
  border-radius: 0.25rem;
  background-color: ${({ $selected }) =>
    $selected
      ? 'var(--accent-color-primary)'
      : 'var(--button-secondary-background)'};
  color: ${({ $selected }) => ($selected ? 'white' : 'transparent')};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all var(--transition-duration);
`

const EmptyState = styled.div`
  text-align: center;
  padding: 1.5rem;
  color: var(--text-color-secondary);
  background-color: var(--button-secondary-background);
  border-radius: 0.75rem;
  margin: 1rem 0;
  border: 1.5px solid var(--border-primary-color);
`

const ValidatorSummary = styled.div`
  margin: 1rem 0;
  padding: 1rem;
  background: var(--button-secondary-background);
  border-radius: 0.75rem;
  border: 1.5px solid var(--border-primary-color);
`

const SelectedValidatorsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.75rem;
  margin-top: 1rem;
  max-height: 200px;
  overflow-y: auto;
`

const SelectedValidatorItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  padding: 0.5rem 0.75rem;
  background: var(--button-secondary-background);
  border-radius: 0.25rem;

  > span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--text-color-secondary);
  }
`

const PoolItem = styled.div`
  background: var(--button-secondary-background);
  border-radius: 0.75rem;
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1.5px solid var(--border-primary-color);
  transition: all var(--transition-duration);

  &:hover {
    border-color: var(--accent-color-transparent);
    background-color: var(--button-hover-background);
  }
`

const PoolDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`

const PoolIcon = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.75rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`

const PoolInfo = styled.div`
  flex: 1;
  min-width: 0;
`

const PoolName = styled.div`
  font-size: 0.95rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
  display: flex;
  align-items: center;
  font-family: InterSemiBold, sans-serif;
  color: var(--text-color-primary);
`

const PoolAddress = styled.div`
  font-family: monospace;
  font-size: 0.8rem;
  color: var(--text-color-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`
