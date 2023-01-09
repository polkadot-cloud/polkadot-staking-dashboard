// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { usePlugins } from 'contexts/Plugins';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { useBondedPools } from 'contexts/Pools/BondedPools';
import { usePoolMemberships } from 'contexts/Pools/PoolMemberships';
import { useStaking } from 'contexts/Staking';
import { useUi } from 'contexts/UI';
import { getUnixTime } from 'date-fns';
import { CardWrapper } from 'library/Graphs/Wrappers';
import { useNominationStatus } from 'library/Hooks/useNominationStatus';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { determinePoolDisplay } from 'Utils';
import { Item } from './Item';
import { Tips } from './Tips';
import { StatusWrapper } from './Wrappers';

export const StakeStatus = () => {
  const { t } = useTranslation('pages');
  const { network } = useApi();
  const navigate = useNavigate();
  const {
    networkSyncing,
    isSyncing,
    getSyncById,
    getSyncStart,
    setSyncStart,
    getSyncSynced,
    setSyncSynced,
  } = useUi();
  const { activeAccount } = useConnect();
  const { openModalWith } = useModal();
  const { membership } = usePoolMemberships();
  const { inSetup } = useStaking();
  const { getNominationStatus } = useNominationStatus();
  const { bondedPools, meta } = useBondedPools();
  const { selectedActivePool } = useActivePools();
  const { plugins } = usePlugins();
  const isStaking = !inSetup() || membership;
  const showTips = plugins.includes('tips');

  // sync start id
  const syncId = `${JSON.stringify(activeAccount)}_${network.name}`;

  // delay refresh to avoid flashing updates.
  const delay = 500;

  useEffect(() => {
    const synced = getSyncSynced(syncId);
    const syncStart = getSyncStart(syncId);

    // if syncing, get remaining time & then set synced.
    if (!synced) {
      const remaining = Math.max(
        0,
        syncStart + delay - getUnixTime(new Date())
      );

      if (remaining > 0) {
        setTimeout(() => {
          setSyncSynced(syncId);
        }, remaining);
      } else {
        setSyncSynced(syncId);
      }
    }
  }, [getSyncStart(syncId), getSyncSynced(syncId)]);

  // re-sync when network / account pair changes.
  useEffect(() => {
    if (getSyncById(syncId) === null) {
      setSyncStart(syncId, getUnixTime(new Date()));
    }
  }, [network, activeAccount]);

  const poolDisplay = () => {
    if (selectedActivePool) {
      const pool = bondedPools.find((p: any) => {
        return p.addresses.stash === selectedActivePool.addresses.stash;
      });
      if (pool) {
        const metadata = meta.bonded_pools?.metadata ?? [];
        const batchIndex = bondedPools.indexOf(pool);

        if (metadata[batchIndex]) {
          return determinePoolDisplay(
            selectedActivePool.addresses.stash,
            metadata[batchIndex]
          );
        }
      }
    }
    return '';
  };

  // determine whether active staking positions are earning rewards.
  const earningRewardsNominator = inSetup()
    ? false
    : getNominationStatus(activeAccount, 'nominator').earningRewards;
  const earningRewardsPool = !membership
    ? false
    : getNominationStatus(selectedActivePool?.addresses?.stash || '', 'pool')
        .earningRewards;

  return (
    <CardWrapper>
      <StatusWrapper includeBorder={showTips}>
        {networkSyncing || (activeAccount && !getSyncSynced(syncId)) ? (
          <Item
            leftIcon={{ show: true, status: 'off' }}
            text={`${t('overview.syncingStatus')}...`}
          />
        ) : (
          <>
            {!activeAccount ? (
              <Item
                text={t('overview.noAccountConnected')}
                ctaText={t('overview.connect') || ''}
                onClick={() => openModalWith('ConnectAccounts', {}, 'large')}
              />
            ) : (
              <>
                {isSyncing ? (
                  <>
                    <Item
                      leftIcon={{ show: true, status: 'off' }}
                      text={`${t('overview.syncingStatus')}...`}
                    />
                  </>
                ) : (
                  <>
                    {!isStaking ? (
                      <Item
                        leftIcon={{ show: true, status: 'off' }}
                        text={t('overview.notStaking')}
                      />
                    ) : (
                      <>
                        {!inSetup() ? (
                          <Item
                            leftIcon={{
                              show: true,
                              status: earningRewardsNominator
                                ? 'active'
                                : 'inactive',
                            }}
                            text={
                              getNominationStatus(activeAccount, 'nominator')
                                .message
                            }
                            ctaText={t('overview.manage') || ''}
                            onClick={() => navigate('/nominate')}
                          />
                        ) : null}
                        {membership ? (
                          <Item
                            leftIcon={{
                              show: true,
                              status: earningRewardsPool
                                ? 'active'
                                : 'inactive',
                            }}
                            text={`${t('overview.memberOf')} ${
                              poolDisplay() === ''
                                ? `${t('overview.pool')} ${membership.poolId}`
                                : poolDisplay()
                            }`}
                            ctaText={t('overview.manage') || ''}
                            onClick={() => navigate('/pools')}
                          />
                        ) : null}
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </>
        )}
      </StatusWrapper>
      {showTips ? <Tips /> : null}
    </CardWrapper>
  );
};
