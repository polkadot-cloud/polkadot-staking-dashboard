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
import { ellipsisFn, planckToUnit, unitToPlanck } from '@w3ux/utils'
import { getChainIcons } from 'assets'
import BigNumber from 'bignumber.js'
import { getNetworkData } from 'consts/util'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useApi } from 'contexts/Api'
import { useInviteNotification } from 'contexts/InviteNotification'
import { useNetwork } from 'contexts/Network'
import { useActivePool } from 'contexts/Pools/ActivePool'
import { useBondedPools } from 'contexts/Pools/BondedPools'
import { useTransferOptions } from 'contexts/TransferOptions'
import { defaultClaimPermission } from 'global-bus'
import { useBatchCall } from 'hooks/useBatchCall'
import { useBondGreatestFee } from 'hooks/useBondGreatestFee'
import { useCreatePoolAccounts } from 'hooks/useCreatePoolAccounts'
import { useSubmitExtrinsic } from 'hooks/useSubmitExtrinsic'
import { CardWrapper } from 'library/Card/Wrappers'
import { BondFeedback } from 'library/Form/Bond/BondFeedback'
import { getIdentityDisplay } from 'library/List/Utils'
import type { RoleIdentities } from 'overlay/canvas/Pool/types'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import type { ClaimPermission, MaybeAddress } from 'types'
import { ButtonPrimary } from 'ui-buttons'
import { Page } from 'ui-core/base'
import { formatIdentities, formatSuperIdentities } from 'utils'
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
  Wrapper,
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
  const { poolId, network: urlNetwork } = useParams<{
    network: string
    poolId: string
  }>()
  const { network, switchNetwork } = useNetwork()
  const { activeAddress } = useActiveAccounts()
  const location = window.location.search
  const { inPool } = useActivePool()
  const { isReady, serviceApi } = useApi()
  const { bondedPools, updateBondedPools } = useBondedPools()
  const { getTransferOptions } = useTransferOptions()
  const largestTxFee = useBondGreatestFee({ bondFor: 'pool' })
  const { newBatchCall } = useBatchCall()
  const createPoolAccounts = useCreatePoolAccounts()
  const { dismissInvite } = useInviteNotification()

  const [poolDetails, setPoolDetails] = useState<PoolDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [joining, setJoining] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null)
  const [claimPermission] = useState<ClaimPermission>(defaultClaimPermission)
  const [roleIdentities, setRoleIdentities] = useState<RoleIdentities>({
    identities: {},
    supers: {},
  })

  const { units, unit } = getNetworkData(network)
  const TokenIcon = getChainIcons(network).icon

  // Bond amount state
  const [bond, setBond] = useState<{ bond: string }>({ bond: '' })
  const [bondValid, setBondValid] = useState<boolean>(false)
  const [feedbackErrors, setFeedbackErrors] = useState<string[]>([])

  // Get transfer options for the active account
  const transferOptions = activeAddress
    ? getTransferOptions(activeAddress)
    : null

  // Set initial bond value only once when component mounts
  useEffect(() => {
    if (transferOptions && bond.bond === '') {
      const initialBond = planckToUnit(
        transferOptions.transferrableBalance,
        units
      )
      setBond({ bond: initialBond })
    }
  }, [activeAddress, units])

  // Handler to set bond on input change
  const handleSetBond = (value: { bond: BigNumber }) => {
    setBond({ bond: value.bond.toString() })
  }

  // Function to fetch identities for role addresses
  const fetchRoleIdentities = async (addresses: string[]) => {
    if (!addresses.length) {
      return
    }
    try {
      const [identities, supers] = await Promise.all([
        serviceApi.query.identityOfMulti(addresses),
        serviceApi.query.superOfMulti(addresses),
      ])
      setRoleIdentities({
        identities: formatIdentities(addresses, identities),
        supers: formatSuperIdentities(supers),
      })
    } catch (err) {
      console.error('Failed to fetch role identities:', err)
    }
  }

  // Effect to fetch pool details when API is ready
  useEffect(() => {
    const fetchPoolDetails = async () => {
      if (!isReady || !serviceApi || !poolId) {
        return
      }

      setLoading(true)
      setError(null)

      try {
        const details = await getPoolDetails()
        if (details) {
          setPoolDetails(details)

          // Fetch role identities if roles are present
          if (details.roles) {
            const addresses = Object.values(details.roles).filter(
              (address): address is string => !!address
            )
            if (addresses.length > 0) {
              fetchRoleIdentities(addresses)
            }
          }
        }
      } catch (poolError) {
        console.error('Error fetching pool details:', poolError)
        setError(t('errorLoadingPool'))
      } finally {
        setLoading(false)
      }
    }

    // Only attempt to fetch pool details when API is ready
    if (isReady) {
      fetchPoolDetails()
    }
  }, [isReady, serviceApi, poolId])

  // Function to fetch pool details
  const getPoolDetails = async (): Promise<PoolDetails | null> => {
    try {
      if (!serviceApi || !poolId) {
        return null
      }

      const poolIdNum = Number(poolId)

      // Fetch bonded pool data
      const bondedPool = await serviceApi.query.bondedPool(poolIdNum)
      if (!bondedPool) {
        setError(t('poolNotFound'))
        return null
      }

      // Get pool metadata
      const metadataHex = (
        await serviceApi.query.poolMetadataMulti([poolIdNum])
      )[0]
      const metadata = metadataHex
        ? new TextDecoder().decode(Buffer.from(metadataHex.substring(2), 'hex'))
        : ''

      // Get pool stash and reward addresses
      const poolAddresses = createPoolAccounts(poolIdNum)

      // Create addresses object for the pool
      const addresses = {
        stash: poolAddresses.stash,
        reward: poolAddresses.reward,
      }

      // Format pool details
      const details: PoolDetails = {
        id: poolId,
        metadata: metadata || `${t('pool')} #${poolId}`,
        state: bondedPool.state || 'Open',
        memberCount: Number(bondedPool.memberCounter || 0),
        commission: bondedPool.commission
          ? {
              current: bondedPool.commission.current?.[0]
                ? Number(bondedPool.commission.current[0]) / 10000000
                : 0,
              max: bondedPool.commission.max
                ? Number(bondedPool.commission.max) / 10000000
                : 0,
            }
          : undefined,
        totalBonded: planckToUnit(bondedPool.points?.toString() || '0', units),
        addresses,
        roles: {
          root: bondedPool.roles?.root || null,
          nominator: bondedPool.roles?.nominator || null,
          bouncer: bondedPool.roles?.bouncer || null,
          depositor: bondedPool.roles?.depositor || null,
        },
      }

      return details
    } catch (poolError) {
      console.error('Error getting pool details:', poolError)
      setError(t('errorLoadingPool'))
      return null
    }
  }

  // Check if user is already in a pool using the inPool function from useActivePool
  const userAlreadyInPool = inPool()

  // Get the transaction
  const getTx = () => {
    if (!activeAddress || !poolId || !bondValid) {
      return
    }
    // Create a transaction to join the pool with the specified bond amount
    const txs = serviceApi.tx.joinPool(
      Number(poolId),
      unitToPlanck(!bondValid ? 0 : bond.bond, units),
      claimPermission
    )
    if (!txs || !txs.length) {
      return
    }
    return newBatchCall(txs, activeAddress)
  }

  // Set up the transaction submission
  const submitExtrinsic = useSubmitExtrinsic({
    tx: getTx(),
    from: activeAddress,
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

  // Dismiss notification when navigating away
  const handleNavigateAway = () => {
    dismissInvite()
    navigate('/pools')
  }

  // Join the pool
  const handleJoinPool = async () => {
    if (!activeAddress || !poolId) {
      return
    }

    // Submit the transaction
    submitExtrinsic.onSubmit()

    // After successful join, dismiss the notification
    dismissInvite()
  }

  // Format DOT amount for display
  const formatDOT = (amount: string) => {
    const bn = new BigNumber(amount)
    return bn.isNaN() ? '0' : bn.toFormat(3)
  }

  // Whether the form is ready to submit
  const formValid = bondValid && !feedbackErrors.length && !isSubmitting

  // Extract language from URL query parameters and handle network switching
  useEffect(() => {
    // Handle language from URL
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

    // Handle network switching if URL network doesn't match current network
    if (urlNetwork && urlNetwork !== network) {
      // Only switch if the network from URL is valid
      if (['polkadot', 'kusama', 'westend'].includes(urlNetwork)) {
        // Switch to the network specified in the URL
        switchNetwork(urlNetwork as 'polkadot' | 'kusama' | 'westend')
      }
    }
  }, [location, i18n, urlNetwork, network, switchNetwork])

  return (
    <Page.Container>
      <Wrapper>
        <Page.Title title={t('poolInvite')} />

        {loading ? (
          <Page.Row>
            <LoadingState>{t('loadingPoolDetails')}</LoadingState>
          </Page.Row>
        ) : error ? (
          <Page.Row>
            <ErrorState>
              <h3>{t('errorTitle')}</h3>
              <p>{error}</p>
              <ButtonPrimary
                text={t('browsePools')}
                onClick={handleNavigateAway}
              />
            </ErrorState>
          </Page.Row>
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
                      {poolDetails?.addresses?.stash && (
                        <Polkicon
                          address={poolDetails.addresses.stash}
                          fontSize="40px"
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
                          <StatValue>
                            {poolDetails.commission.current}%
                          </StatValue>
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
                    {Object.entries(poolDetails.roles).map(
                      ([role, address]) => {
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
                              <IdentityWrapper
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                }}
                              >
                                <Polkicon address={address} fontSize="24px" />
                                {displayIdentity ? (
                                  <RoleIdentity style={{ marginLeft: '8px' }}>
                                    {displayIdentity}
                                  </RoleIdentity>
                                ) : (
                                  <RoleText style={{ marginLeft: '8px' }}>
                                    {ellipsisFn(address, 6)}
                                  </RoleText>
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
                      }
                    )}
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
      </Wrapper>
    </Page.Container>
  )
}
