// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { forwardRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useModal } from 'contexts/Modal';
import { useApi } from 'contexts/Api';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { usePoolsConfig } from 'contexts/Pools/PoolsConfig';
import { planckBnToUnit } from 'Utils';
import { useTranslation } from 'react-i18next';
import { ContentWrapper } from './Wrappers';

export const Tasks = forwardRef((props: any, ref: any) => {
  const { setSection, setTask, bondType } = props;

  const { network } = useApi();
  const { units, unit } = network;
  const { config } = useModal();
  const { fn } = config;
  const { isDepositor } = useActivePools();
  const { stats } = usePoolsConfig();
  const { minCreateBond, minJoinBond } = stats;

  const minJoinBondBase = planckBnToUnit(minJoinBond, units);
  const minCreateBondBase = planckBnToUnit(minCreateBond, units);
  const { t } = useTranslation('common');

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
                <h3>{t('modals.bond_extra')}</h3>
                <p>
                  {t('modals.bond_more')} {network.unit}.
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
                <h3>{t('modals.bond_all')}</h3>
                <p>
                  {t('modals.bond_all_available')} {network.unit}.
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
                <h3>{t('modals.unbond')}</h3>
                <p>
                  {t('modals.unbond_some_of_your')} {network.unit}.
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
                  <h3>{t('modals.unbond_all')}</h3>
                  <p>{t('modals.exit_your_staking_position')}</p>
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
                  <h3>{t('modals.unbond_to_minimum')}</h3>
                  <p>
                    {isDepositor()
                      ? `Unbond up to the ${minCreateBondBase} ${unit} minimum bond for pool depositors.`
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
