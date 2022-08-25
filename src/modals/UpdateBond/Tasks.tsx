// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { forwardRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useModal } from 'contexts/Modal';
import { useApi } from 'contexts/Api';
import { useActivePool } from 'contexts/Pools/ActivePool';
import { usePoolsConfig } from 'contexts/Pools/PoolsConfig';
import { planckBnToUnit } from 'Utils';
import { ContentWrapper } from './Wrappers';

export const Tasks = forwardRef((props: any, ref: any) => {
  const { setSection, setTask, bondType } = props;

  const { network } = useApi();
  const { units, unit } = network;
  const { config } = useModal();
  const { fn } = config;
  const { isOwner } = useActivePool();
  const { stats } = usePoolsConfig();
  const { minCreateBond, minJoinBond } = stats;

  const minJoinBondBase = planckBnToUnit(minJoinBond, units);
  const minCreateBondBase = planckBnToUnit(minCreateBond, units);

  return (
    <ContentWrapper>
      <div className="items" ref={ref}>
        {fn === 'add' && (
          <>
            <button
              type="button"
              className="action-button"
              onClick={() => {
                setSection(1);
                setTask('bond_some');
              }}
            >
              <div>
                <h3>Bond Extra</h3>
                <p>Bond more {network.unit}.</p>
              </div>
              <div>
                <FontAwesomeIcon transform="shrink-2" icon={faChevronRight} />
              </div>
            </button>
            <button
              type="button"
              className="action-button"
              onClick={() => {
                setSection(1);
                setTask('bond_all');
              }}
            >
              <div>
                <h3>Bond All</h3>
                <p>Bond all available {network.unit}.</p>
              </div>
              <div>
                <FontAwesomeIcon transform="shrink-2" icon={faChevronRight} />
              </div>
            </button>
          </>
        )}
        {fn === 'remove' && (
          <>
            <button
              type="button"
              className="action-button"
              onClick={() => {
                setSection(1);
                setTask('unbond_some');
              }}
            >
              <div>
                <h3>Unbond</h3>
                <p>Unbond some of your {network.unit}.</p>
              </div>
              <div>
                <FontAwesomeIcon transform="shrink-2" icon={faChevronRight} />
              </div>
            </button>
            {bondType === 'stake' && (
              <button
                type="button"
                className="action-button"
                onClick={() => {
                  setSection(1);
                  setTask('unbond_all');
                }}
              >
                <div>
                  <h3>Unbond All</h3>
                  <p>Exit your staking position.</p>
                </div>
                <div>
                  <FontAwesomeIcon transform="shrink-2" icon={faChevronRight} />
                </div>
              </button>
            )}
            {bondType === 'pool' && (
              <button
                type="button"
                className="action-button"
                onClick={() => {
                  setSection(1);
                  setTask('unbond_pool_to_minimum');
                }}
              >
                <div>
                  <h3>Unbond To Minimum</h3>
                  <p>
                    {isOwner()
                      ? `Unbond up to the ${minCreateBondBase} ${unit} minimum bond for pool owners.`
                      : `Unbond up to the ${minJoinBondBase} ${unit} minimum to maintain your pool membership`}
                  </p>
                </div>
                <div>
                  <FontAwesomeIcon transform="shrink-2" icon={faChevronRight} />
                </div>
              </button>
            )}
          </>
        )}
      </div>
    </ContentWrapper>
  );
});

export default Tasks;
