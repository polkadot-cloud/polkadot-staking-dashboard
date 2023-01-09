// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { usePlugins } from 'contexts/Plugins';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { useBondedPools } from 'contexts/Pools/BondedPools';
import { usePoolMemberships } from 'contexts/Pools/PoolMemberships';
import { useStaking } from 'contexts/Staking';
import { useUi } from 'contexts/UI';
import { CardWrapper } from 'library/Graphs/Wrappers';
import { useNominationStatus } from 'library/Hooks/useNominationStatus';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { determinePoolDisplay } from 'Utils';
import { Item } from './Item';
import { Tips } from './Tips';
import { StatusWrapper } from './Wrappers';

export const StakeStatus = () => {
  const navigate = useNavigate();
  const { networkSyncing, isSyncing } = useUi();
  const { activeAccount } = useConnect();
  const { openModalWith } = useModal();
  const { membership } = usePoolMemberships();
  const { isNominating } = useStaking();
  const { getNominationStatus } = useNominationStatus();
  const { bondedPools, meta } = useBondedPools();
  const { selectedActivePool } = useActivePools();
  const { plugins } = usePlugins();
  const isStaking = isNominating() || membership;
  const showTips = plugins.includes('tips');
  const { t } = useTranslation('pages');

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

  return (
    <CardWrapper>
      <StatusWrapper includeBorder={showTips}>
        {networkSyncing ? (
          <Item
            leftIcon={{ show: true, active: false }}
            text={t('overview.syncingStatus')}
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
                      leftIcon={{ show: true, active: false }}
                      text={t('overview.syncingStatus')}
                    />
                  </>
                ) : (
                  <>
                    {!isStaking ? (
                      <Item
                        leftIcon={{ show: true, active: false }}
                        text={t('overview.notStaking')}
                      />
                    ) : (
                      <>
                        {isNominating() ? (
                          <Item
                            leftIcon={{ show: true, active: true }}
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
                            leftIcon={{ show: true, active: true }}
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
