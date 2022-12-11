// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { PoolState } from 'contexts/Pools/types';
import { Warning } from 'library/Form/Warning';
import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ContentWrapper } from './Wrappers';

export const Tasks = forwardRef((props: any, ref: any) => {
  const { setSection, setTask } = props;
  const { t } = useTranslation('modals');

  const { selectedActivePool, isOwner, isStateToggler } = useActivePools();
  const poolLocked = selectedActivePool?.bondedPool?.state === PoolState.Block;
  const poolDestroying =
    selectedActivePool?.bondedPool?.state === PoolState.Destroy;

  return (
    <ContentWrapper>
      {poolDestroying && <Warning text={t('being_destroyed')} />}

      <div className="items" ref={ref}>
        {isOwner() && (
          <button
            type="button"
            className="action-button"
            disabled={poolDestroying}
            onClick={() => {
              setSection(1);
              setTask('set_pool_metadata');
            }}
          >
            <div>
              <h3>{t('rename_pool')}</h3>
              <p>{t('update_name')}</p>
            </div>
            <div>
              <FontAwesomeIcon transform="shrink-2" icon={faChevronRight} />
            </div>
          </button>
        )}
        {(isOwner() || isStateToggler()) && (
          <>
            {poolLocked ? (
              <button
                type="button"
                className="action-button"
                disabled={poolDestroying}
                onClick={() => {
                  setSection(1);
                  setTask('unlock_pool');
                }}
              >
                <div>
                  <h3>{t('_unlock_pool')}</h3>
                  <p>{t('allow_to_join')}</p>
                </div>
                <div>
                  <FontAwesomeIcon transform="shrink-2" icon={faChevronRight} />
                </div>
              </button>
            ) : (
              <button
                type="button"
                className="action-button"
                disabled={poolDestroying}
                onClick={() => {
                  setSection(1);
                  setTask('lock_pool');
                }}
              >
                <div>
                  <h3>{t('_lock_pool')}</h3>
                  <p>{t('stop_joining_pool')}</p>
                </div>
                <div>
                  <FontAwesomeIcon transform="shrink-2" icon={faChevronRight} />
                </div>
              </button>
            )}
            <button
              type="button"
              className="action-button"
              disabled={poolDestroying}
              onClick={() => {
                setSection(1);
                setTask('destroy_pool');
              }}
            >
              <div>
                <h3>{t('_destroy_pool')}</h3>
                <p>{t('change_to_destroy')}</p>
              </div>
              <div>
                <FontAwesomeIcon transform="shrink-2" icon={faChevronRight} />
              </div>
            </button>
          </>
        )}
      </div>
    </ContentWrapper>
  );
});

export default Tasks;
