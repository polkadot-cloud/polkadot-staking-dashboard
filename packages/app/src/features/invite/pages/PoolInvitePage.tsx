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
import type { ChainId, SystemChainId } from 'common-types'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useApi } from 'contexts/Api'
import { useNetwork } from 'contexts/Network'
import { useActivePool } from 'contexts/Pools/ActivePool'
import { useBondedPools } from 'contexts/Pools/BondedPools'
import type { ClaimPermission } from 'contexts/Pools/types'
import { determinePoolDisplay } from 'contexts/Pools/util'
import { useTransferOptions } from 'contexts/TransferOptions'
import { defaultClaimPermission } from 'controllers/ActivePools/defaults'
import { Apis } from 'controllers/Apis'
import { Identities } from 'controllers/Identities'
import { useBondGreatestFee } from 'hooks/useBondGreatestFee'
import { useSubmitExtrinsic } from 'hooks/useSubmitExtrinsic'
import { CardWrapper } from 'library/Card/Wrappers'
import { BondFeedback } from 'library/Form/Bond/BondFeedback'
import { getIdentityDisplay } from 'library/List/Utils'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import type { MaybeAddress } from 'types'
import { ButtonPrimary } from 'ui-buttons'
import { Page } from 'ui-core/base'
import { planckToUnitBn } from 'utils'
import {
  ActionSection,
  AddressesSection,
  AddressItem,
  AddressLabel,
  AddressText,
  AddressValue,
  BondInputWrapper,
  BondSection,
  CopyButton,
  ErrorState,
  IdentityWrapper,
  InviteHeader,
  LoadingState,
  PoolCard,
  PoolHeader,
  PoolIcon,
  PoolId,
  PoolInfo,
  PoolState,
  PoolStats,
  PoolWarningMessage,
  RoleIdentity,
  RoleItem,
  RoleLabel,
  RolesSection,
  RoleText,
  RoleValue,
  SectionTitle,
  StatContent,
  StatIcon,
  StatItem,
  StatLabel,
  StatValue,
} from './Wrappers'

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
  const { t, i18n } = useTranslation('invite')
  const navigate = useNavigate()
  const { poolId } = useParams<{
    network: string
    poolId: string
  }>()
  const location = window.location.search
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
  const [roleIdentities, setRoleIdentities] = useState<{
    identities: Record<string, unknown>
    supers: Record<string, unknown>
  }>({
    identities: {},
    supers: {},
  })

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

  // Function to fetch identities for role addresses
  const fetchRoleIdentities = async (addresses: string[]) => {
    if (!addresses.length) {
      return
    }

    const peopleApiId = `people-${network}` as ChainId
    const peopleApiClient = Apis.getClient(peopleApiId as SystemChainId)

    if (peopleApiClient) {
      try {
        const { identities, supers } = await Identities.fetch(
          peopleApiId,
          addresses
        )
        setRoleIdentities({ identities, supers })
      } catch (err) {
        console.error('Failed to fetch role identities:', err)
      }
    }
  }

  // Get pool details
  useEffect(() => {
    let isMounted = true

    const getPoolDetails = async () => {
      if (!poolId || !isReady) {
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
          return
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

          // Format bonded amount - this must match the format used in the details object
          const bondedAmount = planckToUnitBn(
            new BigNumber(rmCommas(pool.points)),
            units
          )
            .decimalPlaces(3)
            .toString()

          // Format commission if available
          const commission = pool.commission?.current
            ? {
                current: parseFloat(pool.commission.current[0]),
                max: pool.commission.max
                  ? parseFloat(pool.commission.max.toString())
                  : 100,
              }
            : undefined

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

          // Fetch role identities
          if (pool.roles) {
            fetchRoleIdentities(
              Object.values(pool.roles).filter(Boolean) as string[]
            )
          }

          setLoading(false)
          setError(null)
        } else if (isMounted) {
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

    return () => {
      isMounted = false
    }
  }, [poolId, isReady, bondedPools, poolsMetaData, t, units])

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
    return bn.isNaN() ? '0' : bn.toFormat(3)
  }

  // Whether the form is ready to submit
  const formValid = bondValid && feedbackErrors.length === 0

  // Extract language from URL query parameters
  useEffect(() => {
    if (location) {
      const params = new URLSearchParams(location)
      const langParam = params.get('l')

      // Change language if valid and different from current
      if (
        langParam &&
        i18n.language !== langParam &&
        i18n.languages.includes(langParam)
      ) {
        i18n.changeLanguage(langParam)
      }
    }
  }, [location, i18n])

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
              <InviteHeader>
                <h2>{t('invitedToJoinPool')}</h2>
                <p>{t('poolInviteDescription')}</p>
              </InviteHeader>
            </CardWrapper>
          </Page.RowSection>

          <Page.RowSection>
            <CardWrapper>
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
                    <PoolId>
                      <span>ID:</span> {poolId}
                    </PoolId>
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
                        <StatValue>{poolDetails.commission.current}%</StatValue>
                        <StatLabel>{t('commission')}</StatLabel>
                      </StatContent>
                    </StatItem>
                  )}
                </PoolStats>
              </PoolCard>
            </CardWrapper>
          </Page.RowSection>

          <Page.RowSection>
            <CardWrapper>
              <AddressesSection>
                <SectionTitle>{t('addresses')}</SectionTitle>
                <AddressItem>
                  <AddressLabel>{t('stash')}</AddressLabel>
                  <AddressValue>
                    <IdentityWrapper>
                      <Polkicon
                        address={poolDetails?.addresses.stash || ''}
                        fontSize="24px"
                      />
                      <AddressText>
                        {ellipsisFn(poolDetails?.addresses.stash || '', 6)}
                      </AddressText>
                    </IdentityWrapper>
                    <CopyButton
                      onClick={() =>
                        handleCopyAddress(poolDetails?.addresses.stash || '')
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
                    <IdentityWrapper>
                      <Polkicon
                        address={poolDetails?.addresses.reward || ''}
                        fontSize="24px"
                      />
                      <AddressText>
                        {ellipsisFn(poolDetails?.addresses.reward || '', 6)}
                      </AddressText>
                    </IdentityWrapper>
                    <CopyButton
                      onClick={() =>
                        handleCopyAddress(poolDetails?.addresses.reward || '')
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
            </CardWrapper>
          </Page.RowSection>

          {poolDetails?.roles && (
            <Page.RowSection>
              <CardWrapper>
                <RolesSection>
                  <SectionTitle>{t('roles')}</SectionTitle>
                  {Object.entries(poolDetails.roles).map(([role, address]) => {
                    if (!address) {
                      return null
                    }

                    // Get identity display for this address
                    const displayIdentity = getIdentityDisplay(
                      roleIdentities.identities[address],
                      roleIdentities.supers[address]
                    )?.data?.display

                    return (
                      <RoleItem key={role}>
                        <RoleLabel>{t(role)}</RoleLabel>
                        <RoleValue>
                          <IdentityWrapper>
                            <Polkicon address={address} fontSize="24px" />
                            {displayIdentity ? (
                              <RoleIdentity>{displayIdentity}</RoleIdentity>
                            ) : (
                              <RoleText>{ellipsisFn(address, 6)}</RoleText>
                            )}
                          </IdentityWrapper>
                          <CopyButton
                            onClick={() => handleCopyAddress(address)}
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
                  })}
                </RolesSection>
              </CardWrapper>
            </Page.RowSection>
          )}

          {userAlreadyInPool && (
            <Page.RowSection>
              <CardWrapper>
                <PoolWarningMessage>{t('alreadyInPool')}</PoolWarningMessage>
              </CardWrapper>
            </Page.RowSection>
          )}

          <Page.RowSection>
            <CardWrapper>
              <BondSection>
                <h4>{t('bondAmount', { unit })}</h4>
                <BondInputWrapper>
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
                </BondInputWrapper>

                <ActionSection>
                  <ButtonPrimary
                    text={joining ? t('joining') : t('joinPool')}
                    disabled={userAlreadyInPool || isSubmitting || !formValid}
                    onClick={handleJoinPool}
                  />
                </ActionSection>
              </BondSection>
            </CardWrapper>
          </Page.RowSection>
        </Page.Row>
      )}
    </>
  )
}
