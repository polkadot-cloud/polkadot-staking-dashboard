// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { u8aToString, u8aUnwrapBytes } from '@polkadot/util';
import { ButtonInvert } from '@polkadotcloud/dashboard-ui';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { useBondedPools } from 'contexts/Pools/BondedPools';
import type { BondedPool } from 'contexts/Pools/types';
import { Warning } from 'library/Form/Warning';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { Action } from 'library/Modal/Action';
import { SubmitTx } from 'library/SubmitTx';
import { WarningsWrapper } from 'modals/Wrappers';
import React, { forwardRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ContentWrapper } from './Wrappers';

export const Forms = forwardRef(
  ({ setSection, task, section }: any, ref: any) => {
    const { t } = useTranslation('modals');
    const { api } = useApi();
    const { setStatus: setModalStatus } = useModal();
    const { activeAccount, accountHasSigner } = useConnect();
    const { isOwner, isStateToggler, selectedActivePool } = useActivePools();
    const { bondedPools, meta, updateBondedPools, getBondedPool } =
      useBondedPools();
    const poolId = selectedActivePool?.id;

    // valid to submit transaction
    const [valid, setValid] = useState<boolean>(false);

    // updated metadata value
    const [metadata, setMetadata] = useState<string>('');

    // ensure account has relevant roles for task
    const canToggle =
      (isOwner() || isStateToggler()) &&
      ['destroy_pool', 'unlock_pool', 'lock_pool'].includes(task);
    const canRename = isOwner() && task === 'set_pool_metadata';
    const isValid = canToggle || canRename;

    // determine current pool metadata and set in state
    useEffect(() => {
      if (task === 'set_pool_metadata') {
        let _metadata = '';
        const pool = bondedPools.find(
          (p: any) => p.addresses.stash === selectedActivePool?.addresses.stash
        );

        if (pool) {
          const metadataBatch = meta.bonded_pools?.metadata ?? [];
          const batchIndex = bondedPools.indexOf(pool);
          _metadata = metadataBatch[batchIndex];
          setMetadata(u8aToString(u8aUnwrapBytes(_metadata)));
        }
      }
    }, [section]);

    useEffect(() => {
      setValid(isValid);
    }, [isValid]);

    const content = (() => {
      let title;
      let message;
      switch (task) {
        case 'set_pool_metadata':
          title = undefined;
          message = <p>{t('storedOnChain')}</p>;
          break;
        case 'destroy_pool':
          title = <Action text={t('setToDestroying')} />;
          message = <p>{t('setToDestroyingSubtitle')}</p>;
          break;
        case 'unlock_pool':
          title = <Action text={t('unlockPool')} />;
          message = <p>{t('unlockPoolSubtitle')}</p>;
          break;
        case 'lock_pool':
          title = <Action text={t('lockPool')} />;
          message = <p>{t('lockPoolSubtitle')}</p>;
          break;
        default:
          title = null;
          message = null;
      }
      return { title, message };
    })();

    const poolStateFromTask = (s: string) => {
      switch (s) {
        case 'destroy_pool':
          return 'Destroying';
        case 'lock_pool':
          return 'Blocked';
        default:
          return 'Open';
      }
    };

    // tx to submit
    const getTx = () => {
      let tx = null;

      if (!valid || !api) {
        return tx;
      }

      // remove decimal errors
      switch (task) {
        case 'set_pool_metadata':
          tx = api.tx.nominationPools.setMetadata(poolId, metadata);
          break;
        case 'destroy_pool':
          tx = api.tx.nominationPools.setState(poolId, 'Destroying');
          break;
        case 'unlock_pool':
          tx = api.tx.nominationPools.setState(poolId, 'Open');
          break;
        case 'lock_pool':
          tx = api.tx.nominationPools.setState(poolId, 'Blocked');
          break;
        default:
          tx = null;
      }

      return tx;
    };

    const { submitTx, submitting } = useSubmitExtrinsic({
      tx: getTx(),
      from: activeAccount,
      shouldSubmit: true,
      callbackSubmit: () => {
        setModalStatus(2);
      },
      callbackInBlock: () => {
        // reflect updated state in bondedPools list
        if (
          ['destroy_pool', 'unlock_pool', 'lock_pool'].includes(task) &&
          poolId
        ) {
          const pool: BondedPool | null = getBondedPool(poolId);

          if (pool) {
            updateBondedPools([
              {
                ...pool,
                state: poolStateFromTask(task),
              },
            ]);
          }
        }
      },
    });

    const handleMetadataChange = (e: React.FormEvent<HTMLInputElement>) => {
      const newValue = e.currentTarget.value;
      setMetadata(newValue);
      // any string is valid metadata
      setValid(true);
    };

    return (
      <>
        <ContentWrapper>
          <div className="items" ref={ref}>
            <>
              <div className="padding">
                {!accountHasSigner(activeAccount) && (
                  <WarningsWrapper>
                    <Warning text={t('readOnly')} />
                  </WarningsWrapper>
                )}

                {/* include task title if present */}
                {content.title !== undefined ? content.title : null}

                {/* include form element if task is to set metadata */}
                {task === 'set_pool_metadata' && (
                  <>
                    <input
                      className="textbox"
                      style={{ width: '100%' }}
                      placeholder={`${t('poolName')}`}
                      type="text"
                      onChange={(e: React.FormEvent<HTMLInputElement>) =>
                        handleMetadataChange(e)
                      }
                      value={metadata ?? ''}
                    />
                  </>
                )}

                {content.message}
              </div>
            </>
            <SubmitTx
              submit={submitTx}
              submitting={submitting}
              valid={valid}
              buttons={[
                <ButtonInvert
                  key="button_back"
                  text={t('back')}
                  iconLeft={faChevronLeft}
                  iconTransform="shrink-1"
                  onClick={() => setSection(0)}
                  disabled={submitting}
                />,
              ]}
            />
          </div>
        </ContentWrapper>
      </>
    );
  }
);
