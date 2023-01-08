// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faChevronRight, faCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ButtonInvertRounded } from '@rossbulat/polkadot-dashboard-ui';
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
import { useNavigate } from 'react-router-dom';
import { determinePoolDisplay } from 'Utils';
import { Tips } from './Tips';
import { StatusRowWrapper, StatusWrapper } from './Wrappers';

export const StakeStatus = () => {
  const navigate = useNavigate();
  const { networkSyncing } = useUi();
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

  const poolDisplay = () => {
    if (selectedActivePool) {
      const pool = bondedPools.find((p: any) => {
        return p.addresses.stash === selectedActivePool.addresses.stash;
      });
      if (pool) {
        const metadata = meta.bonded_pools?.metadata ?? [];
        const batchIndex = bondedPools.indexOf(pool);
        return determinePoolDisplay(
          selectedActivePool.addresses.stash,
          metadata[batchIndex]
        );
      }
    }
    return '';
  };

  return (
    <CardWrapper>
      <StatusWrapper includeBorder={showTips}>
        {networkSyncing ? (
          <>
            <StatusRowWrapper>
              <FontAwesomeIcon
                icon={faCircle}
                transform="shrink-4"
                style={{ marginRight: '0.75rem', opacity: 0.1 }}
              />
              <div>
                <h3>Syncing Status...</h3>
              </div>
            </StatusRowWrapper>
          </>
        ) : (
          <>
            {!activeAccount ? (
              <StatusRowWrapper>
                <div>
                  <h3>No Account Connected</h3>
                </div>
                <div>
                  <ButtonInvertRounded
                    text="Connect"
                    iconRight={faChevronRight}
                    iconTransform="shrink-4"
                    lg
                    onClick={() =>
                      openModalWith('ConnectAccounts', {}, 'large')
                    }
                  />
                </div>
              </StatusRowWrapper>
            ) : (
              <>
                {!isStaking ? (
                  <StatusRowWrapper>
                    <div>
                      <FontAwesomeIcon
                        icon={faCircle}
                        transform="shrink-4"
                        style={{ marginRight: '0.75rem', opacity: 0.1 }}
                      />
                      <h3>Not Staking</h3>
                    </div>
                  </StatusRowWrapper>
                ) : (
                  <>
                    {isNominating() ? (
                      <StatusRowWrapper>
                        <div>
                          <FontAwesomeIcon
                            icon={faCircle}
                            transform="shrink-4"
                            color="green"
                            style={{ marginRight: '0.75rem', opacity: 1 }}
                          />
                          <h3>
                            {
                              getNominationStatus(activeAccount, 'nominator')
                                .message
                            }
                          </h3>
                        </div>
                        <div>
                          <ButtonInvertRounded
                            text="Manage"
                            iconRight={faChevronRight}
                            iconTransform="shrink-4"
                            lg
                            onClick={() => navigate('/nominate')}
                          />
                        </div>
                      </StatusRowWrapper>
                    ) : null}
                    {membership ? (
                      <StatusRowWrapper>
                        <div>
                          <FontAwesomeIcon
                            icon={faCircle}
                            transform="shrink-4"
                            color="green"
                            style={{ marginRight: '0.75rem', opacity: 1 }}
                          />
                          <h3>Member of {poolDisplay()}</h3>
                        </div>
                        <div>
                          <ButtonInvertRounded
                            text="Manage"
                            iconRight={faChevronRight}
                            iconTransform="shrink-4"
                            lg
                            onClick={() => navigate('/pools')}
                          />
                        </div>
                      </StatusRowWrapper>
                    ) : null}
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
