// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faArrowAltCircleUp } from '@fortawesome/free-regular-svg-icons';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { u8aToString, u8aUnwrapBytes } from '@polkadot/util';
import { ButtonSubmit } from '@rossbulat/polkadot-dashboard-ui';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { useBondedPools } from 'contexts/Pools/BondedPools';
import { BondedPool, PoolState } from 'contexts/Pools/types';
import { useTxFees } from 'contexts/TxFees';
import { EstimatedTxFee } from 'library/EstimatedTxFee';
import { Warning } from 'library/Form/Warning';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import React, { forwardRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Separator } from 'Wrappers';
import { FooterWrapper, NotesWrapper } from '../Wrappers';
import { ContentWrapper } from './Wrappers';

export const Forms = forwardRef((props: any, ref: any) => {
  const { setSection, task, section } = props;
  const { t } = useTranslation('modals');

  const { api } = useApi();
  const { setStatus: setModalStatus } = useModal();
  const { activeAccount, accountHasSigner } = useConnect();
  const { isOwner, isStateToggler, selectedActivePool } = useActivePools();
  const { bondedPools, meta, updateBondedPools, getBondedPool } =
    useBondedPools();
  const { txFeesValid } = useTxFees();
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
      const pool = bondedPools.find((p: any) => {
        return p.addresses.stash === selectedActivePool?.addresses.stash;
      });

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
        title = <h2>{t('destroyIrreversible')}</h2>;
        message = <p>{t('destroyPool')}</p>;
        break;
      case 'unlock_pool':
        title = <h2>{t('submitUnlock')}</h2>;
        message = <p>{t('unlockPoolResult')}</p>;
        break;
      case 'lock_pool':
        title = <h2>{t('submitLock')}</h2>;
        message = <p>{t('lockPoolResult')}</p>;
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
        return PoolState.Destroy;
      case 'lock_pool':
        return PoolState.Block;
      default:
        return PoolState.Open;
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
        tx = api.tx.nominationPools.setState(poolId, PoolState.Destroy);
        break;
      case 'unlock_pool':
        tx = api.tx.nominationPools.setState(poolId, PoolState.Open);
        break;
      case 'lock_pool':
        tx = api.tx.nominationPools.setState(poolId, PoolState.Block);
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
    <ContentWrapper>
      <div className="items" ref={ref}>
        {!accountHasSigner(activeAccount) && <Warning text={t('readOnly)} />}
        <div>
          <>
            {/* include task title if present */}
            {content.title !== undefined && (
              <>
                {content.title}
                <Separator />
              </>
            )}

            {/* include form element if task is to set metadata */}
            {task === 'set_pool_metadata' && (
              <>
                <h2>Update Pool Name</h2>
                <input
                  className="textbox"
                  style={{ width: '100%' }}
                  placeholder={t('poolName') || ''}
                  type="text"
                  onChange={(e: React.FormEvent<HTMLInputElement>) =>
                    handleMetadataChange(e)
                  }
                  value={metadata ?? ''}
                />
              </>
            )}

            <NotesWrapper>
              {content.message}
              <EstimatedTxFee />
            </NotesWrapper>
          </>
        </div>
        <FooterWrapper>
          <div>
            <button
              type="button"
              className="submit secondary"
              onClick={() => setSection(0)}
              disabled={submitting}
            >
              <FontAwesomeIcon
                transform="grow-2"
                icon={faChevronLeft as IconProp}
              />
              {t('back')}
            </button>
          </div>
          <div>
            <ButtonSubmit
              text={`${submitting ? t('submitting') : t('submit')}`}
              iconLeft={faArrowAltCircleUp}
              iconTransform="grow-2"
              onClick={() => submitTx()}
              disabled={
                submitting ||
                !accountHasSigner(activeAccount) ||
                !valid ||
                !txFeesValid
              }
            />
          </div>
        </FooterWrapper>
      </div>
    </ContentWrapper>
  );
});

export default Forms;
