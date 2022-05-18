// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStopCircle } from '@fortawesome/free-solid-svg-icons';
import { faArrowAltCircleUp } from '@fortawesome/free-regular-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { HeadingWrapper, FooterWrapper, Separator } from '../Wrappers';
import { Wrapper } from './Wrapper';
import { useBalances } from '../../contexts/Balances';
import { useApi } from '../../contexts/Api';
import { useModal } from '../../contexts/Modal';
import { useSubmitExtrinsic } from '../../library/Hooks/useSubmitExtrinsic';
import { useConnect } from '../../contexts/Connect';
import { Warning } from '../../library/Form/Warning';

export const StopNominating = () => {
  const { api }: any = useApi();
  const { activeAccount } = useConnect();
  const { getBondedAccount, getAccountNominations }: any = useBalances();
  const { setStatus: setModalStatus }: any = useModal();
  const controller = getBondedAccount(activeAccount);
  const nominations = getAccountNominations(activeAccount);

  // ensure selected key is valid
  useEffect(() => {
    setValid(nominations.length > 0);
  }, [nominations]);

  // valid to submit transaction
  const [valid, setValid]: any = useState(nominations.length > 0);

  // tx to submit
  const tx = () => {
    let _tx = null;
    if (!valid) {
      return _tx;
    }
    _tx = api.tx.staking.chill();
    return _tx;
  };

  const { submitTx, estimatedFee, submitting }: any = useSubmitExtrinsic({
    tx: tx(),
    from: controller,
    shouldSubmit: valid,
    callbackSubmit: () => {
      setModalStatus(0);
    },
    callbackInBlock: () => {
    },
  });

  return (
    <Wrapper>
      <HeadingWrapper>
        <FontAwesomeIcon transform="grow-2" icon={faStopCircle} />
        Stop Nominating
      </HeadingWrapper>
      <div style={{ padding: '0 1rem', width: '100%', boxSizing: 'border-box' }}>
        {!nominations.length
          && <Warning text="You have no nominations set." />}
        <h2>
          You Have
          {nominations.length}
          {' '}
          Nomination
          {nominations.length === 1 ? '' : 's'}
        </h2>
        <Separator />
        <div className="notes">
          <p>Once submitted, your nominations will be removed immediately and will stop nominating from the start of the next era.</p>
          <p>
            Estimated Tx Fee:
            {estimatedFee === null ? '...' : `${estimatedFee}`}
          </p>
        </div>
        <FooterWrapper>
          <div>
            <button
              type="button"
              className="submit"
              onClick={() => submitTx()}
              disabled={!valid || submitting}
            >
              <FontAwesomeIcon transform="grow-2" icon={faArrowAltCircleUp as IconProp} />
              Submit
            </button>
          </div>
        </FooterWrapper>
      </div>
    </Wrapper>
  );
};

export default StopNominating;
