// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useActivePool } from 'contexts/Pools/ActivePool'
import { useStaking } from 'contexts/Staking'
import type { Validator } from 'contexts/Validators/types'
import { useValidators } from 'contexts/Validators/ValidatorEntries'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import type { Identity } from 'types'
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

  const [inviteGenerated, setInviteGenerated] = useState(false)

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

  // Set the active pool as the selected pool
  useEffect(() => {
    if (activePool?.id) {
      poolInviteGenerator.setSelectedPool(activePool.id.toString())
      handleGenerateInvite()
    }
  }, [activePool])

  const { getValidators } = useValidators()

  // Get validators
  const validators = getValidators()

  // Get the active generator based on the invite type
  const activeGenerator =
    inviteType === 'pool' ? poolInviteGenerator : validatorInviteGenerator

  // Generate the invite URL
  const handleGenerateInvite = () => {
    activeGenerator.generateInviteUrl()
    setInviteGenerated(true)
  }

  // Get entity name and address for display in share options
  const getEntityDetails = useCallback(() => {
    if (inviteType === 'pool' && activePool) {
      return {
        name: `Pool #${activePool.id}`,
        address: activePool.addresses?.stash || '',
      }
    } else if (
      inviteType === 'validator' &&
      validatorInviteGenerator.selectedValidators.length > 0
    ) {
      const validatorAddress = validatorInviteGenerator.selectedValidators[0]
      const validator = validators.find(
        (v) => v.address === validatorAddress
      ) as ValidatorWithIdentity | undefined

      return {
        name:
          validator?.identity?.info?.display?.value?.asText() ||
          validatorAddress,
        address: validatorAddress,
      }
    }
    return { name: '', address: '' }
  }, [
    inviteType,
    activePool,
    validatorInviteGenerator.selectedValidators,
    validators,
  ])

  // Use useMemo to calculate entityDetails only when dependencies change
  const entityDetails = useMemo(() => getEntityDetails(), [getEntityDetails])

  // Resize modal when content changes
  useEffect(() => {
    setModalResize()
  }, [inviteGenerated, inviteType])

  // Get nominated validators for the active account and cast to ValidatorWithIdentity[]
  const nominatedValidators = (validatorInviteGenerator.nominatedValidators ||
    []) as ValidatorWithIdentity[]

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
          <ShareOptions
            inviteUrl={activeGenerator.inviteUrl}
            copiedToClipboard={activeGenerator.copiedToClipboard}
            copyInviteUrl={activeGenerator.copyInviteUrl}
            type={inviteType}
            entityName={entityDetails.name}
            entityAddress={entityDetails.address}
          />
        ) : (
          <>
            <ContentSection>
              <SectionTitle>{t('selectValidators')}</SectionTitle>
              {nominatedValidators.length > 0 ? (
                <ValidatorList>
                  {nominatedValidators.map((validator) => {
                    const validatorWithIdentity =
                      validator as ValidatorWithIdentity
                    return (
                      <ValidatorItem key={validatorWithIdentity.address}>
                        <ValidatorDisplay>
                          <ValidatorAddress>
                            {validatorWithIdentity.address}
                          </ValidatorAddress>
                          {validatorWithIdentity.identity?.info?.display?.value?.asText() && (
                            <ValidatorName>
                              {validatorWithIdentity.identity.info.display.value.asText()}
                            </ValidatorName>
                          )}
                        </ValidatorDisplay>
                      </ValidatorItem>
                    )
                  })}
                </ValidatorList>
              ) : (
                <EmptyState>{t('noValidatorsFound')}</EmptyState>
              )}
            </ContentSection>

            <ButtonContainer>
              <GenerateButton
                text={t('generateInvite')}
                disabled={
                  validatorInviteGenerator.selectedValidators.length === 0
                }
                onClick={handleGenerateInvite}
              />
            </ButtonContainer>
          </>
        )}
      </Padding>
    </>
  )
}

const ContentSection = styled.div`
  margin: 1rem 0;
`

const SectionTitle = styled.h3`
  margin-bottom: 1rem;
  font-size: 1.1rem;
`

const ValidatorList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
`

const ValidatorItem = styled.div`
  padding: 0.75rem;
  border-radius: 0.5rem;
  background-color: var(--background-primary);
  border: 1px solid var(--border-primary-color);
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

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--text-color-secondary);
  background-color: var(--background-primary);
  border-radius: 0.5rem;
  margin: 1rem 0;
`
