// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
  faCheck,
  faCoins,
  faCopy,
  faPercent,
  faUsers,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Polkicon } from '@w3ux/react-polkicon'
import { ellipsisFn, rmCommas, unitToPlanck } from '@w3ux/utils'
import { JoinPool } from 'api/tx/joinPool'
import BigNumber from 'bignumber.js'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useApi } from 'contexts/Api'
import { useNetwork } from 'contexts/Network'
import { useActivePool } from 'contexts/Pools/ActivePool'
import { useBondedPools } from 'contexts/Pools/BondedPools'
import type { ClaimPermission } from 'contexts/Pools/types'
import { determinePoolDisplay } from 'contexts/Pools/util'
import { useTransferOptions } from 'contexts/TransferOptions'
import { defaultClaimPermission } from 'controllers/ActivePools/defaults'
import { useBondGreatestFee } from 'hooks/useBondGreatestFee'
import { useSubmitExtrinsic } from 'hooks/useSubmitExtrinsic'
import { CardWrapper } from 'library/Card/Wrappers'
import { BondFeedback } from 'library/Form/Bond/BondFeedback'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components'
import type { MaybeAddress } from 'types'
import { ButtonPrimary } from 'ui-buttons'
import { Page } from 'ui-core/base'
import { planckToUnitBn } from 'utils'

// Define interface for pool details
interface PoolDetails {
  id: string
  metadata: string
  state: string
  memberCount: number
  commission?: {
    current: number
    max: number
  }
  totalBonded: string
  addresses: {
    stash: string
    reward: string
  }
  roles?: {
    root: MaybeAddress
    nominator: MaybeAddress
    bouncer: MaybeAddress
    depositor: MaybeAddress
  }
}

export const PoolInvitePage = () => {
  const { t } = useTranslation('invite')
  const navigate = useNavigate()
  const { network: urlNetwork, poolId } = useParams<{
    network: string
    poolId: string
  }>()
  const {
    networkData: {
      units,
      unit,
      brand: { token: TokenIcon },
    },
    network,
  } = useNetwork()
  const { activeAccount } = useActiveAccounts()
  const { activePool } = useActivePool()
  const { isReady } = useApi()
  const { bondedPools, poolsMetaData, updateBondedPools } = useBondedPools()
  const { getTransferOptions } = useTransferOptions()
  const largestTxFee = useBondGreatestFee({ bondFor: 'pool' })

  const [poolDetails, setPoolDetails] = useState<PoolDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [joining, setJoining] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null)
  const [claimPermission] = useState<ClaimPermission>(defaultClaimPermission)

  // Bond amount state
  const [bond, setBond] = useState<{ bond: string }>({ bond: '' })
  const [bondValid, setBondValid] = useState<boolean>(false)
  const [feedbackErrors, setFeedbackErrors] = useState<string[]>([])

  // Get transfer options for the active account
  const transferOptions = activeAccount
    ? getTransferOptions(activeAccount)
    : null

  // Set initial bond value only once when component mounts
  useEffect(() => {
    if (transferOptions && bond.bond === '') {
      // Use transferrableBalance instead of availableBalance
      const initialBond = planckToUnitBn(
        transferOptions.transferrableBalance,
        units
      ).toString()
      setBond({ bond: initialBond })
    }
  }, [activeAccount, units])

  // Handler to set bond on input change
  const handleSetBond = (value: { bond: BigNumber }) => {
    setBond({ bond: value.bond.toString() })
  }

  // Get pool details
  useEffect(() => {
    let isMounted = true

    const getPoolDetails = async () => {
      if (!poolId || !isReady) {
        return
      }

      // Validate network matches
      if (network !== urlNetwork) {
        if (isMounted) {
          setError(
            t('wrongNetwork', { expected: urlNetwork, current: network })
          )
          setLoading(false)
        }
        return
      }

      try {
        if (isMounted) {
          setLoading(true)
        }

        // Find the pool in bondedPools by converting poolId to number
        const numericPoolId = parseInt(poolId, 10)

        // If bondedPools is empty, wait for data to load
        if (bondedPools.length === 0) {
          return // Don't set any state, just wait for the next effect run when bondedPools is populated
        }

        // Try to find the pool by ID
        let pool = bondedPools.find((p) => p.id === numericPoolId)

        // If pool not found by direct ID comparison, try string conversion as fallback
        if (!pool) {
          pool = bondedPools.find((p) => p.id.toString() === poolId)
        }

        if (pool && isMounted) {
          // Get pool display name from metadata
          const poolName = determinePoolDisplay(
            pool.addresses?.stash,
            poolsMetaData[numericPoolId]
          )

          // Format bonded amount
          const bondedAmount = planckToUnitBn(
            new BigNumber(rmCommas(pool.points?.toString() || '0')),
            units
          ).toFormat(3)

          // Format commission if available
          const commission = pool.commission?.current
            ? {
                current: parseFloat(pool.commission.current[0]),
                max: pool.commission.max
                  ? parseFloat(pool.commission.max.toString())
                  : 100, // Default to 100% if max is not set
              }
            : undefined

          // If found in bonded pools, use that data
          const details: PoolDetails = {
            id: poolId,
            metadata: poolName,
            state: pool.state?.toString() || 'Open',
            memberCount: parseInt(pool.memberCounter?.toString() || '0', 10),
            commission,
            totalBonded: bondedAmount,
            addresses: {
              stash: pool.addresses?.stash || '',
              reward: pool.addresses?.reward || '',
            },
            roles: pool.roles
              ? {
                  root: pool.roles.root || null,
                  nominator: pool.roles.nominator || null,
                  bouncer: pool.roles.bouncer || null,
                  depositor: pool.roles.depositor || null,
                }
              : undefined,
          }

          setPoolDetails(details)
          setLoading(false)
          // Clear any previous errors
          setError(null)
        } else if (isMounted) {
          // If not found in bonded pools
          setError(t('poolNotFound'))
          setLoading(false)
        }
      } catch (err) {
        console.error('Error fetching pool details:', err)
        if (isMounted) {
          setError(t('errorFetchingPool'))
          setLoading(false)
        }
      }
    }

    getPoolDetails()

    // Return cleanup function
    return () => {
      isMounted = false
    }
  }, [
    poolId,
    network,
    urlNetwork,
    isReady,
    bondedPools,
    poolsMetaData,
    t,
    units,
  ])

  // Check if user is already in a pool
  const userAlreadyInPool = activePool !== null

  // Get the transaction
  const getTx = () => {
    if (!activeAccount || !poolId || !bondValid) {
      return null
    }

    // Create a transaction to join the pool with the specified bond amount
    const bondAmount = unitToPlanck(bond.bond, units)

    return new JoinPool(
      network,
      Number(poolId),
      bondAmount,
      claimPermission
    ).tx()
  }

  // Set up the transaction submission
  const submitExtrinsic = useSubmitExtrinsic({
    tx: getTx(),
    from: activeAccount,
    shouldSubmit: bondValid,
    callbackSubmit: () => {
      setJoining(true)
      setIsSubmitting(true)
    },
    callbackInBlock: () => {
      // Refresh pools data
      updateBondedPools(bondedPools)

      // Navigate to pools page after successful transaction
      setTimeout(() => {
        navigate('/pools')
      }, 2000)
    },
  })

  // Handle address copy
  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address)
    setCopiedAddress(address)
    setTimeout(() => setCopiedAddress(null), 3000)
  }

  // Handle joining the pool
  const handleJoinPool = () => {
    if (!activeAccount || !poolId) {
      return
    }

    // Submit the transaction
    submitExtrinsic.onSubmit()
  }

  // Format DOT amount for display
  const formatDOT = (amount: string) => {
    const bn = new BigNumber(amount)
    return bn.isNaN() ? '0' : bn.toFormat(2)
  }

  // Whether the form is ready to submit
  const formValid = bondValid && feedbackErrors.length === 0

  return (
    <>
      <Page.Title title={t('poolInvite')} />

      {loading ? (
        <LoadingState>{t('loadingPoolDetails')}</LoadingState>
      ) : error ? (
        <ErrorState>
          <h3>{t('errorTitle')}</h3>
          <p>{error}</p>
          <ButtonPrimary
            text={t('browsePools')}
            onClick={() => navigate('/pools')}
          />
        </ErrorState>
      ) : (
        <Page.Row>
          <Page.RowSection>
            <CardWrapper>
              <InviteContainer>
                <InviteHeader>
                  <h2>{t('invitedToJoinPool')}</h2>
                  <p>{t('poolInviteDescription')}</p>
                </InviteHeader>

                <PoolCard>
                  <PoolHeader>
                    <PoolIcon>
                      {poolDetails?.addresses.stash && (
                        <Polkicon
                          address={poolDetails.addresses.stash}
                          fontSize="48px"
                        />
                      )}
                    </PoolIcon>
                    <PoolInfo>
                      <h3>{poolDetails?.metadata}</h3>
                      <PoolId>ID: {poolId}</PoolId>
                      <PoolState $state={poolDetails?.state || ''}>
                        {poolDetails?.state}
                      </PoolState>
                    </PoolInfo>
                  </PoolHeader>

                  <PoolStats>
                    <StatItem>
                      <StatIcon>
                        <FontAwesomeIcon icon={faUsers} />
                      </StatIcon>
                      <StatContent>
                        <StatValue>{poolDetails?.memberCount}</StatValue>
                        <StatLabel>{t('members')}</StatLabel>
                      </StatContent>
                    </StatItem>

                    <StatItem>
                      <StatIcon>
                        <FontAwesomeIcon icon={faCoins} />
                      </StatIcon>
                      <StatContent>
                        <StatValue>
                          {poolDetails?.totalBonded && (
                            <>
                              {formatDOT(poolDetails.totalBonded)}{' '}
                              <TokenIcon
                                style={{ width: '1rem', height: '1rem' }}
                              />
                            </>
                          )}
                        </StatValue>
                        <StatLabel>{t('totalBonded')}</StatLabel>
                      </StatContent>
                    </StatItem>

                    {poolDetails?.commission && (
                      <StatItem>
                        <StatIcon>
                          <FontAwesomeIcon icon={faPercent} />
                        </StatIcon>
                        <StatContent>
                          <StatValue>
                            {poolDetails.commission.current}%
                          </StatValue>
                          <StatLabel>{t('commission')}</StatLabel>
                        </StatContent>
                      </StatItem>
                    )}
                  </PoolStats>

                  <SectionDivider />

                  <AddressesSection>
                    <SectionTitle>{t('addresses')}</SectionTitle>
                    <AddressItem>
                      <AddressLabel>{t('stash')}</AddressLabel>
                      <AddressValue>
                        {ellipsisFn(poolDetails?.addresses.stash || '', 6)}
                        <CopyButton
                          onClick={() =>
                            handleCopyAddress(
                              poolDetails?.addresses.stash || ''
                            )
                          }
                        >
                          {copiedAddress === poolDetails?.addresses.stash ? (
                            <FontAwesomeIcon icon={faCheck} />
                          ) : (
                            <FontAwesomeIcon icon={faCopy} />
                          )}
                        </CopyButton>
                      </AddressValue>
                    </AddressItem>
                    <AddressItem>
                      <AddressLabel>{t('reward')}</AddressLabel>
                      <AddressValue>
                        {ellipsisFn(poolDetails?.addresses.reward || '', 6)}
                        <CopyButton
                          onClick={() =>
                            handleCopyAddress(
                              poolDetails?.addresses.reward || ''
                            )
                          }
                        >
                          {copiedAddress === poolDetails?.addresses.reward ? (
                            <FontAwesomeIcon icon={faCheck} />
                          ) : (
                            <FontAwesomeIcon icon={faCopy} />
                          )}
                        </CopyButton>
                      </AddressValue>
                    </AddressItem>
                  </AddressesSection>

                  {poolDetails?.roles && (
                    <>
                      <SectionDivider />
                      <RolesSection>
                        <SectionTitle>{t('roles')}</SectionTitle>
                        {Object.entries(poolDetails.roles).map(
                          ([role, address]) => (
                            <RoleItem key={role}>
                              <RoleLabel>{t(role)}</RoleLabel>
                              <RoleValue>
                                {ellipsisFn(address || '', 6)}
                                <CopyButton
                                  onClick={() =>
                                    handleCopyAddress(address || '')
                                  }
                                >
                                  {copiedAddress === address ? (
                                    <FontAwesomeIcon icon={faCheck} />
                                  ) : (
                                    <FontAwesomeIcon icon={faCopy} />
                                  )}
                                </CopyButton>
                              </RoleValue>
                            </RoleItem>
                          )
                        )}
                      </RolesSection>
                    </>
                  )}

                  {userAlreadyInPool && (
                    <WarningMessage>{t('alreadyInPool')}</WarningMessage>
                  )}

                  <SectionDivider />

                  <h4>{t('bondAmount', { unit })}</h4>
                  <div style={{ margin: '1rem 0' }}>
                    <BondFeedback
                      joiningPool
                      displayFirstWarningOnly
                      syncing={largestTxFee.isZero()}
                      bondFor={'pool'}
                      listenIsValid={(valid, errors) => {
                        setBondValid(valid)
                        setFeedbackErrors(errors)
                      }}
                      defaultBond={null}
                      setters={[handleSetBond]}
                      txFees={BigInt(largestTxFee.toString())}
                    />
                  </div>

                  <ActionSection>
                    <ButtonPrimary
                      text={joining ? t('joining') : t('joinPool')}
                      disabled={userAlreadyInPool || isSubmitting || !formValid}
                      onClick={handleJoinPool}
                    />
                  </ActionSection>
                </PoolCard>
              </InviteContainer>
            </CardWrapper>
          </Page.RowSection>
        </Page.Row>
      )}
    </>
  )
}

const InviteContainer = styled.div`
  width: 100%;
  padding: 1rem;
`

const InviteHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;

  h2 {
    font-size: 1.8rem;
    margin-bottom: 0.5rem;
  }

  p {
    color: var(--text-color-secondary);
  }
`

const PoolCard = styled.div`
  padding: 1.5rem;
`

const PoolHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
`

const PoolIcon = styled.div`
  margin-right: 1rem;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`

const PoolInfo = styled.div`
  h3 {
    font-size: 1.4rem;
    margin-bottom: 0.25rem;
  }
`

const PoolId = styled.div`
  font-size: 0.9rem;
  color: var(--text-color-secondary);
  margin-bottom: 0.5rem;
`

const PoolState = styled.div<{ $state: string }>`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.8rem;
  font-weight: 600;
  background-color: ${({ $state }) =>
    $state === 'Open'
      ? 'var(--status-success-color-transparent)'
      : $state === 'Blocked'
        ? 'var(--status-warning-color-transparent)'
        : 'var(--status-danger-color-transparent)'};
  color: ${({ $state }) =>
    $state === 'Open'
      ? 'var(--status-success-color)'
      : $state === 'Blocked'
        ? 'var(--status-warning-color)'
        : 'var(--status-danger-color)'};
`

const PoolStats = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
`

const StatItem = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 150px;
`

const StatIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--background-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.75rem;
  color: var(--text-color-primary);
`

const StatContent = styled.div``

const StatValue = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: var(--text-color-secondary);
`

const SectionDivider = styled.div`
  height: 1px;
  background-color: var(--border-primary-color);
  margin: 1.5rem 0;
`

const SectionTitle = styled.h4`
  font-size: 1.1rem;
  margin-bottom: 1rem;
  color: var(--text-color-primary);
`

const AddressesSection = styled.div`
  margin-bottom: 1.5rem;
`

const AddressItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: var(--background-primary);

  &:last-child {
    margin-bottom: 0;
  }
`

const AddressLabel = styled.div`
  font-weight: 600;
  color: var(--text-color-secondary);
  text-transform: capitalize;
`

const AddressValue = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: monospace;
`

const CopyButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-color-secondary);
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;

  &:hover {
    color: var(--accent-color-primary);
  }
`

const RolesSection = styled.div`
  margin-bottom: 1.5rem;
`

const RoleItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: var(--background-primary);

  &:last-child {
    margin-bottom: 0;
  }
`

const RoleLabel = styled.div`
  font-weight: 600;
  color: var(--text-color-secondary);
  text-transform: capitalize;
`

const RoleValue = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: monospace;
`

const WarningMessage = styled.div`
  background-color: var(--status-warning-color-transparent);
  color: var(--status-warning-color);
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
`

const ActionSection = styled.div`
  display: flex;
  justify-content: center;
`

const LoadingState = styled.div`
  text-align: center;
  padding: 3rem 0;
  color: var(--text-color-secondary);
  font-size: 1.2rem;
`

const ErrorState = styled.div`
  text-align: center;
  padding: 3rem 0;

  h3 {
    color: var(--status-danger-color);
    margin-bottom: 1rem;
    font-size: 1.4rem;
  }

  p {
    margin-bottom: 2rem;
    color: var(--text-color-secondary);
  }
`
