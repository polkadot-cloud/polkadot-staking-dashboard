// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useApi } from 'contexts/Api';
import { useModal } from 'contexts/Modal';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { usePoolsConfig } from 'contexts/Pools/PoolsConfig';
import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { planckBnToUnit } from 'Utils';
import { ContentWrapper } from './Wrappers';

export const Tasks = forwardRef((props: any, ref: any) => {
  const { setSection, setTask, bondType } = props;
  const { t } = useTranslation('modals');

  const { network } = useApi();
  const { units, unit } = network;
  const { config } = useModal();
  const { fn } = config;
  const { isDepositor } = useActivePools();
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
                <h3>{t('bond_extra')}</h3>
                <p>
                  {t('bond_more')} {network.unit}.
                </p>
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
                <h3>{t('bond_all')}</h3>
                <p>
                  {t('bond_all_available')} {network.unit}.
                </p>
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
                <h3>{t('unbond')}</h3>
                <p>
                  {t('unbond_some_of_your')} {network.unit}.
                </p>
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
                  <h3>{t('unbond_all')}</h3>
                  <p>{t('exit_your_staking_position')}</p>
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
                  <h3>{t('unbond_to_minimum')}</h3>
                  <p>
                    {isDepositor()
                      ? `${t('unbound_to_minimum', {
                          minCreateBondBase,
                          unit,
                        })}`
                      : `${t('unbound_to_maintain', {
                          minJoinBondBase,
                          unit,
                        })}`}
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
