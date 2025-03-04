// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faArrowRight, faCircleNotch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Polkicon } from '@w3ux/react-polkicon'
import { rmCommas } from '@w3ux/utils'
import BigNumber from 'bignumber.js'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useBalances } from 'contexts/Balances'
import { useNetwork } from 'contexts/Network'
import { useBondedPools } from 'contexts/Pools/BondedPools'
import { determinePoolDisplay } from 'contexts/Pools/util'
import { useStaking } from 'contexts/Staking'
import { usePoolCommission } from 'hooks/usePoolCommission'
import { CopyAddress } from 'library/ListItem/Labels/CopyAddress'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { BondedPool } from 'types'
import { ButtonPrimary } from 'ui-buttons'
import { Page } from 'ui-core/base'
import { Interface } from 'ui-core/canvas'
import { Identity } from 'ui-identity'
import { useOverlay } from 'ui-overlay'
import { planckToUnitBn } from 'utils'
import {
  AddressRow,
  AddressesSection,
  ConnectWalletCard,
  LoadingWrapper,
  PoolFlag,
  PoolHeader,
  PoolHeaderCard,
  PoolInfo,
  SectionTitle,
  StatColumn,
  StatsSection,
} from './Wrappers'

export const PoolInvitePage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { openCanvas } = useOverlay().canvas
  const { activeAccount } = useActiveAccounts()
  const { isBonding } = useStaking()
  const { getPoolMembership } = useBalances()
  const { getBondedPool, poolsMetaData } = useBondedPools()
  const { getCurrentCommission } = usePoolCommission()
  const {
    networkData: { units, unit },
  } = useNetwork()

  // Memoize membership to avoid unnecessary re-renders
  const membership = useCallback(
    () => getPoolMembership(activeAccount),
    [getPoolMembership, activeAccount]
  )()

  const [loading, setLoading] = useState(true)
  const [poolData, setPoolData] = useState<BondedPool | null>(null)
  const [invalidPool, setInvalidPool] = useState(false)
  const [loadingTime, setLoadingTime] = useState(0)

  // Memoize commission and metadata to avoid unnecessary re-renders
  const commission = useCallback(
    () => (id ? getCurrentCommission(Number(id)) : 0),
    [id, getCurrentCommission]
  )()

  const metadata = useCallback(
    () => (id ? poolsMetaData[Number(id)] || null : null),
    [id, poolsMetaData]
  )()

  // Use a separate effect for the loading timer
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null

    if (loading) {
      // Start a timer that increments loadingTime every second
      timer = setInterval(() => {
        setLoadingTime((prev) => prev + 1)
      }, 1000)
    }

    return () => {
      if (timer) {
        clearInterval(timer)
      }
    }
  }, [loading])

  useEffect(() => {
    const fetchPoolData = async () => {
      if (id) {
        try {
          const data = getBondedPool(Number(id))

          // If we got data, update state
          if (data) {
            setPoolData(data)
            setLoading(false)
            setInvalidPool(false)
          } else if (loadingTime > 15) {
            // Only mark as invalid after 15 seconds of loading
            setInvalidPool(true)
            setLoading(false)
          }
        } catch (error) {
          console.error('Error fetching pool data:', error)
          // Only mark as invalid if we've been loading for a while
          if (loadingTime > 15) {
            setInvalidPool(true)
            setLoading(false)
          }
        }
      }
    }

    // Run the fetch function every second while loading
    if (loading) {
      fetchPoolData()
    }
  }, [id, getBondedPool, loading, loadingTime])

  const handleJoinPool = () => {
    if (id) {
      openCanvas({
        key: 'Pool',
        options: {
          id: Number(id),
          fromInvite: true,
        },
      })
      navigate('/pools', { replace: true })
    }
  }

  // Render loading state with dynamic message based on loading time
  if (loading) {
    return (
      <Page.Container>
        <Page.Title title="You've Been Invited to Join a Pool" />
        <Interface
          Main={
            <PoolHeaderCard className="canvas">
              <LoadingWrapper>
                <div className="spinner">
                  <FontAwesomeIcon icon={faCircleNotch} />
                </div>
                <h3>Loading Pool Details</h3>
                <p>
                  {loadingTime < 5
                    ? 'Please wait while we fetch information about this pool...'
                    : 'This is taking longer than expected. Still trying to fetch pool data...'}
                </p>
                {loadingTime > 10 && (
                  <p
                    style={{
                      marginTop: '0.5rem',
                      fontSize: '0.8rem',
                      opacity: 0.7,
                    }}
                  >
                    If this continues, the pool may not exist or the network
                    might be experiencing issues.
                  </p>
                )}
              </LoadingWrapper>
            </PoolHeaderCard>
          }
        />
      </Page.Container>
    )
  }

  // Render invalid pool state
  if (invalidPool || !poolData) {
    return (
      <Page.Container>
        <Page.Title title="Pool Not Found" />
        <Interface
          Main={
            <PoolHeaderCard className="canvas">
              <LoadingWrapper>
                <h3>Pool Not Found</h3>
                <p>
                  This pool invite link appears to be invalid or the pool no
                  longer exists.
                </p>
                <ButtonPrimary
                  text="Browse Available Pools"
                  onClick={() => navigate('/pools')}
                  style={{ marginTop: '1rem' }}
                />
              </LoadingWrapper>
            </PoolHeaderCard>
          }
        />
      </Page.Container>
    )
  }

  const bonded = planckToUnitBn(
    new BigNumber(rmCommas(poolData.points)),
    units
  ).decimalPlaces(3)

  // Extract pool name and flag from metadata
  const poolName = determinePoolDisplay(poolData.addresses.stash, metadata)
  const hasFlag =
    poolName.includes('|') &&
    (poolName.includes('🇬🇧') ||
      poolName.includes('🇺🇸') ||
      poolName.includes('🇪🇺'))

  // Split pool name and flag if needed
  let displayName = poolName
  let flag = ''

  if (hasFlag) {
    const lastSpaceIndex = poolName.lastIndexOf(' ')
    if (lastSpaceIndex !== -1) {
      displayName = poolName.substring(0, lastSpaceIndex)
      flag = poolName.substring(lastSpaceIndex + 1)
    }
  }

  return (
    <Page.Container>
      <Page.Title title="You've Been Invited to Join a Pool" />
      <Interface
        Main={
          <>
            <PoolHeaderCard className="canvas">
              <PoolHeader>
                <Polkicon
                  address={poolData.addresses.stash}
                  background="transparent"
                  fontSize="2.5rem"
                />
                <div>
                  <h2>
                    {displayName}
                    {flag && <PoolFlag>{flag}</PoolFlag>}
                  </h2>
                  <PoolInfo>
                    Pool #{poolData.id} · {commission}% Commission
                  </PoolInfo>
                </div>
              </PoolHeader>

              <StatsSection>
                <StatColumn>
                  <h4>Total Bonded</h4>
                  <p>
                    {bonded.toFormat()} {unit}
                  </p>
                </StatColumn>
                <StatColumn>
                  <h4>Members</h4>
                  <p>{poolData.memberCounter}</p>
                </StatColumn>
              </StatsSection>

              <SectionTitle>Reward History</SectionTitle>
            </PoolHeaderCard>

            <PoolHeaderCard className="canvas">
              <SectionTitle>Pool Addresses</SectionTitle>
              <AddressesSection>
                <AddressRow>
                  <div>Stash</div>
                  <div>
                    <Identity
                      address={poolData.addresses.stash}
                      Action={
                        <CopyAddress address={poolData.addresses.stash} />
                      }
                      iconSize="1.6rem"
                      title="Stash"
                    />
                  </div>
                </AddressRow>
                <AddressRow>
                  <div>Reward</div>
                  <div>
                    <Identity
                      address={poolData.addresses.reward}
                      Action={
                        <CopyAddress address={poolData.addresses.reward} />
                      }
                      iconSize="1.6rem"
                      title="Reward"
                    />
                  </div>
                </AddressRow>
              </AddressesSection>
            </PoolHeaderCard>
          </>
        }
        Side={
          <ConnectWalletCard className="canvas">
            {!activeAccount ? (
              <>
                <h3>Connect Wallet</h3>
                <p>Connect your wallet to join this pool.</p>
              </>
            ) : (
              <>
                <h3>Join This Pool</h3>
                {membership && (
                  <div className="warning">
                    Note: You are already a member of a pool. Joining this pool
                    will require leaving your current pool first.
                  </div>
                )}
                {isBonding() && !membership && (
                  <div className="warning">
                    Note: You are currently staking directly. Joining a pool
                    requires unbonding your current stake first.
                  </div>
                )}
                <ButtonPrimary
                  text="Join Pool"
                  onClick={handleJoinPool}
                  iconRight={faArrowRight}
                  disabled={poolData.state !== 'Open'}
                  style={{ marginTop: '1rem' }}
                />
              </>
            )}
          </ConnectWalletCard>
        }
      />
    </Page.Container>
  )
}
