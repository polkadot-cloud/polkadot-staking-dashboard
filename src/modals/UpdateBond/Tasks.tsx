// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useApi } from 'contexts/Api';
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
  const { isDepositor } = useActivePools();
  const { stats } = usePoolsConfig();
  const { minCreateBond, minJoinBond } = stats;

  const minJoinBondBase = planckBnToUnit(minJoinBond, units);
  const minCreateBondBase = planckBnToUnit(minCreateBond, units);

  return (
    <ContentWrapper>
      <div className="items" ref={ref}>
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
              {t('unbondSomeOfYour')} {network.unit}.
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
              <h3>{t('unbondAll')}</h3>
              <p>{t('exitYourStakingPosition')}</p>
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
              <h3>{t('unbondToMinimum')}</h3>
              <p>
                {isDepositor()
                  ? `${t('unbondToMinimumCreate', {
                      minCreateBondBase,
                      unit,
                    })}`
                  : `${t('unbondToMaintain', {
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
      </div>
    </ContentWrapper>
  );
});

export default Tasks;
