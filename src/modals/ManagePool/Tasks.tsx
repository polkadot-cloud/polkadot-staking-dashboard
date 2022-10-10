// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { forwardRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { PoolState } from 'contexts/Pools/types';
import { Warning } from 'library/Form/Warning';
import { useTranslation } from 'react-i18next';
import { ContentWrapper } from './Wrappers';

export const Tasks = forwardRef((props: any, ref: any) => {
  const { setSection, setTask } = props;
  const { t } = useTranslation('common');

  const { selectedActivePool, isOwner, isStateToggler } = useActivePools();
  const poolLocked = selectedActivePool?.bondedPool?.state === PoolState.Block;
  const poolDestroying =
    selectedActivePool?.bondedPool?.state === PoolState.Destroy;

  return (
    <ContentWrapper>
      {poolDestroying && <Warning text={t('modals.w4')} />}

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
              <h3>Rename Pool</h3>
              <p>Update the public name of the pool.</p>
            </div>
            <div>
              <FontAwesomeIcon transform="shrink-2" icon={faChevronRight} />
            </div>
          </button>
        )}
        {isOwner() ||
          (isStateToggler() && (
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
                    <h3>Unlock Pool</h3>
                    <p>Allow new members to join the pool.</p>
                  </div>
                  <div>
                    <FontAwesomeIcon
                      transform="shrink-2"
                      icon={faChevronRight}
                    />
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
                    <h3>Lock Pool</h3>
                    <p>Stop new members from joining the pool.</p>
                  </div>
                  <div>
                    <FontAwesomeIcon
                      transform="shrink-2"
                      icon={faChevronRight}
                    />
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
                  <h3>Destroy Pool</h3>
                  <p>Change pool to destroying state.</p>
                </div>
                <div>
                  <FontAwesomeIcon transform="shrink-2" icon={faChevronRight} />
                </div>
              </button>
            </>
          ))}
      </div>
    </ContentWrapper>
  );
});

export default Tasks;
