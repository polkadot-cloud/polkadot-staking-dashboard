// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowAltCircleUp,
  faTimesCircle,
} from '@fortawesome/free-regular-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { useModal } from 'contexts/Modal';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { useActivePool } from 'contexts/Pools/ActivePool';
import { Separator } from 'Wrappers';
import { PoolState } from 'types/pools';
import { usePoolMemberships } from 'contexts/Pools/PoolMemberships';
import { Warning } from 'library/Form/Warning';
import { ContentWrapper } from './Wrapper';
import { FooterWrapper, NotesWrapper } from '../Wrappers';

export const Forms = () => {
  const { api } = useApi();
  const { setStatus: setModalStatus, config } = useModal();
  const { state } = config;
  const { activeAccount, accountHasSigner } = useConnect();
  const { membership } = usePoolMemberships();
  const { isOwner } = useActivePool();
  const poolId = membership?.poolId;

  // valid to submit transaction
  const [valid, setValid] = useState<boolean>(false);

  // ensure selected membership and targests are valid
  const isValid = membership && isOwner();
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
    switch (state) {
      case PoolState.Destroy:
        _tx = api.tx.nominationPools.setState(poolId, PoolState.Destroy);
        break;
      case PoolState.Open:
        _tx = api.tx.nominationPools.setState(poolId, PoolState.Open);
        break;
      case PoolState.Block:
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
    switch (state) {
      case PoolState.Destroy:
        title = <h2>Destroying a Pool is Irreversible</h2>;
        message = (
          <p>
            Once you Destroy the pool, all members can be permissionlessly
            unbonded, and the pool can never be reopened.
          </p>
        );
        break;
      case PoolState.Open:
        title = <h2>Submit Pool Unlock</h2>;
        message = <p>Once you Unlock the pool new people can join the pool.</p>;
        break;
      case PoolState.Block:
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
    <ContentWrapper>
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
            onClick={() => setModalStatus(0)}
            disabled={submitting}
          >
            <FontAwesomeIcon
              transform="grow-2"
              icon={faTimesCircle as IconProp}
            />
            Cancel
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
};

export default Forms;
