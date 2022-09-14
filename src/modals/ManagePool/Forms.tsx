// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useEffect, forwardRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleUp } from '@fortawesome/free-regular-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { useModal } from 'contexts/Modal';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { useActivePool } from 'contexts/Pools/ActivePool';
import { Separator } from 'Wrappers';
import { BondedPool, PoolState } from 'contexts/Pools/types';
import { usePoolMemberships } from 'contexts/Pools/PoolMemberships';
import { Warning } from 'library/Form/Warning';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { useBondedPools } from 'contexts/Pools/BondedPools';
import { u8aToString, u8aUnwrapBytes } from '@polkadot/util';
import { EstimatedTxFee } from 'library/EstimatedTxFee';
import { useTxFees } from 'contexts/TxFees';
import { ContentWrapper } from './Wrappers';
import { FooterWrapper, NotesWrapper } from '../Wrappers';

export const Forms = forwardRef((props: any, ref: any) => {
  const { setSection, task, section } = props;

  const { api } = useApi();
  const { setStatus: setModalStatus } = useModal();
  const { activeAccount, accountHasSigner } = useConnect();
  const { membership } = usePoolMemberships();
  const { isOwner, activeBondedPool } = useActivePool();
  const { bondedPools, meta, updateBondedPools, getBondedPool } =
    useBondedPools();
  const { txFeesValid } = useTxFees();
  const poolId = membership?.poolId;

  // valid to submit transaction
  const [valid, setValid] = useState<boolean>(false);

  // updated metadata value
  const [metadata, setMetadata] = useState<string>('');

  // ensure selected membership and targests are valid
  const isValid = (membership && isOwner()) ?? false;

  // determine current pool metadata and set in state
  useEffect(() => {
    if (task === 'set_pool_metadata') {
      let _metadata = '';
      const pool = bondedPools.find((p: any) => {
        return p.addresses.stash === activeBondedPool?.addresses.stash;
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
        message = (
          <p>
            Your updated name will be stored on-chain as encoded bytes. The
            update will take effect immediately.
          </p>
        );
        break;
      case 'destroy_pool':
        title = <h2>Destroying a Pool is Irreversible</h2>;
        message = (
          <p>
            Once you Destroy the pool, all members can be permissionlessly
            unbonded, and the pool can never be reopened.
          </p>
        );
        break;
      case 'unlock_pool':
        title = <h2>Submit Pool Unlock</h2>;
        message = <p>Once you Unlock the pool new people can join the pool.</p>;
        break;
      case 'lock_pool':
        title = <h2>Submit Pool Lock</h2>;
        message = <p>Once you Lock the pool no one else can join the pool.</p>;
        break;
      default:
        title = null;
        message = null;
    }
    return { title, message };
  })();

  const poolStateFromTask = (t: string) => {
    switch (t) {
      case 'destroy_pool':
        return PoolState.Destroy;
      case 'lock_pool':
        return PoolState.Block;
      default:
        return PoolState.Open;
    }
  };

  // tx to submit
  const tx = () => {
    let _tx = null;

    if (!valid || !api) {
      return _tx;
    }

    // remove decimal errors
    switch (task) {
      case 'set_pool_metadata':
        _tx = api.tx.nominationPools.setMetadata(poolId, metadata);
        break;
      case 'destroy_pool':
        _tx = api.tx.nominationPools.setState(poolId, PoolState.Destroy);
        break;
      case 'unlock_pool':
        _tx = api.tx.nominationPools.setState(poolId, PoolState.Open);
        break;
      case 'lock_pool':
        _tx = api.tx.nominationPools.setState(poolId, PoolState.Block);
        break;
      default:
        _tx = null;
    }

    return _tx;
  };

  const { submitTx, submitting } = useSubmitExtrinsic({
    tx: tx(),
    from: activeAccount,
    shouldSubmit: true,
    callbackSubmit: () => {
      setModalStatus(0);
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
        {!accountHasSigner(activeAccount) && (
          <Warning text="Your account is read only, and cannot sign transactions." />
        )}
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
                  style={{ width: '100%' }}
                  placeholder="Pool Name"
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
              className="submit"
              onClick={() => setSection(0)}
              disabled={submitting}
            >
              <FontAwesomeIcon
                transform="grow-2"
                icon={faChevronLeft as IconProp}
              />
              Back
            </button>
          </div>
          <div>
            <button
              type="button"
              className="submit"
              onClick={() => submitTx()}
              disabled={
                submitting ||
                !accountHasSigner(activeAccount) ||
                !valid ||
                !txFeesValid
              }
            >
              <FontAwesomeIcon
                transform="grow-2"
                icon={faArrowAltCircleUp as IconProp}
              />
              Submit
              {submitting && 'ting'}
            </button>
          </div>
        </FooterWrapper>
      </div>
    </ContentWrapper>
  );
});

export default Forms;
