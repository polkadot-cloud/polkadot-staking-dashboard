// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState, useEffect, forwardRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleUp } from '@fortawesome/free-regular-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { useModal } from 'contexts/Modal';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { useActivePool } from 'contexts/Pools/ActivePool';
import { Separator } from 'Wrappers';
import { PoolState } from 'contexts/Pools/types';
import { usePoolMemberships } from 'contexts/Pools/PoolMemberships';
import { Warning } from 'library/Form/Warning';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { ContentWrapper } from './Wrappers';
import { FooterWrapper, NotesWrapper } from '../Wrappers';

export const Forms = forwardRef((props: any, ref: any) => {
  const { setSection, task } = props;

  const { api } = useApi();
  const { setStatus: setModalStatus } = useModal();
  const { activeAccount, accountHasSigner } = useConnect();
  const { membership } = usePoolMemberships();
  const { isOwner } = useActivePool();
  const poolId = membership?.poolId;

  // valid to submit transaction
  const [valid, setValid] = useState<boolean>(false);

  // ensure selected membership and targests are valid
  const isValid = (membership && isOwner()) ?? false;
  useEffect(() => {
    setValid(isValid);
  }, [isValid]);

  // tx to submit
  const tx = () => {
    let _tx = null;
    if (!valid || !api) {
      return _tx;
    }

    // remove decimal errors
    switch (task) {
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

  const content = (() => {
    let title;
    let message;
    switch (task) {
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

  const { submitTx, estimatedFee, submitting } = useSubmitExtrinsic({
    tx: tx(),
    from: activeAccount,
    shouldSubmit: true,
    callbackSubmit: () => {
      setModalStatus(0);
    },
    callbackInBlock: () => {},
  });

  const TxFee = (
    <p>Estimated Tx Fee: {estimatedFee === null ? '...' : `${estimatedFee}`}</p>
  );

  return (
    <ContentWrapper ref={ref}>
      {!accountHasSigner(activeAccount) && (
        <Warning text="Your account is read only, and cannot sign transactions." />
      )}
      <div>
        <>
          {content.title}
          <Separator />
          <NotesWrapper>
            {content.message}
            {TxFee}
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
            disabled={submitting || !accountHasSigner(activeAccount)}
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
    </ContentWrapper>
  );
});

export default Forms;
