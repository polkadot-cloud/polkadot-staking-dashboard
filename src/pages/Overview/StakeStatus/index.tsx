// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faChevronRight, faCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ButtonInvertRounded } from '@rossbulat/polkadot-dashboard-ui';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { usePoolMemberships } from 'contexts/Pools/PoolMemberships';
import { useStaking } from 'contexts/Staking';
import { CardHeaderWrapper, CardWrapper } from 'library/Graphs/Wrappers';
import { useNominationStatus } from 'library/Hooks/useNominationStatus';
import OpenHelpIcon from 'library/OpenHelpIcon';
import { useNavigate } from 'react-router-dom';
import { Tips } from './Tips';
import { StatusRowWrapper, StatusWrapper } from './Wrappers';

export const StakeStatus = () => {
  const navigate = useNavigate();
  const { activeAccount } = useConnect();
  const { openModalWith } = useModal();
  const { membership } = usePoolMemberships();
  const { isNominating } = useStaking();
  const { getNominationStatus } = useNominationStatus();
  const isStaking = isNominating() || membership;

  return (
    <CardWrapper>
      <CardHeaderWrapper>
        <h4>
          Status
          <OpenHelpIcon helpKey="Status" />
        </h4>
      </CardHeaderWrapper>
      <StatusWrapper>
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
                onClick={() => openModalWith('ConnectAccounts', {}, 'large')}
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
                    style={{ marginRight: '0.6rem', opacity: 0.1 }}
                  />
                  <h3>Not Staking</h3>
                </div>
                <div>
                  <ButtonInvertRounded
                    text="Start Staking"
                    iconRight={faChevronRight}
                    iconTransform="shrink-4"
                    lg
                    onClick={() => {
                      // TODO: open start staking overlay.
                    }}
                  />
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
                        style={{ marginRight: '0.6rem', opacity: 1 }}
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
                <StatusRowWrapper>
                  <div>
                    <FontAwesomeIcon
                      icon={faCircle}
                      transform="shrink-4"
                      color="green"
                      style={{ marginRight: '0.6rem', opacity: 1 }}
                    />
                    <h3>
                      Member of Pool:{' '}
                      <span style={{ opacity: 0.75 }}>
                        JKRB | Tower Bridge Pool 🇬🇧
                      </span>
                    </h3>
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
              </>
            )}
          </>
        )}
      </StatusWrapper>
      <Tips />
    </CardWrapper>
  );
};
