// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlayCircle } from '@fortawesome/free-solid-svg-icons';
import { faArrowAltCircleUp } from '@fortawesome/free-regular-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { usePools } from 'contexts/Pools';
import { HeadingWrapper, FooterWrapper, Separator } from '../Wrappers';
import { Wrapper } from './Wrapper';
import { useApi } from '../../contexts/Api';
import { useModal } from '../../contexts/Modal';
import { useSubmitExtrinsic } from '../../library/Hooks/useSubmitExtrinsic';
import { useConnect } from '../../contexts/Connect';
import { Warning } from '../../library/Form/Warning';

export const NominatePool = () => {
  const { api, network }: any = useApi();
  const { setStatus: setModalStatus }: any = useModal();
  const { activeAccount } = useConnect();
  const { membership, isNominator, targets } = usePools();
  const { nominations } = targets;
  const poolId = membership?.poolId;
  const { units } = network;

  // valid to submit transaction
  const [valid, setValid]: any = useState(false);

  // ensure selected membership and targests are valid
  const isValid = membership && isNominator() && nominations.length > 0;
  useEffect(() => {
    setValid(isValid);
  }, [isValid]);

  // tx to submit
  const tx = () => {
    let _tx = null;
    if (!valid) {
      return _tx;
    }
    const targetsToSubmit = nominations.map((item: any) => item.address);
    _tx = api.tx.nominationPools.nominate(poolId, targetsToSubmit);
    return _tx;
  };

  const { submitTx, estimatedFee, submitting }: any = useSubmitExtrinsic({
    tx: tx(),
    from: activeAccount,
    shouldSubmit: valid,
    callbackSubmit: () => {
      setModalStatus(0);
    },
    callbackInBlock: () => {},
  });

  // warnings
  const warnings = [];
  if (!nominations.length) {
    warnings.push('You have no nominations set.');
  }
  if (!membership || !isNominator()) {
    warnings.push(`You do not have a nominator role in any pools.`);
  }

  return (
    <Wrapper>
      <HeadingWrapper>
        <FontAwesomeIcon transform="grow-2" icon={faPlayCircle} />
        Nominate
      </HeadingWrapper>
      <div
        style={{ padding: '0 1rem', width: '100%', boxSizing: 'border-box' }}
      >
        {warnings.map((text: any, index: number) => (
          <Warning text={text} />
        ))}
        <h2>
          You Have
          {nominations.length} Nomination
          {nominations.length === 1 ? '' : 's'}
        </h2>
        <Separator />
        <div className="notes">
          <p>
            Once submitted, you will start nominating your chosen validators.
          </p>
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
              disabled={!valid || submitting || warnings.length}
            >
              <FontAwesomeIcon
                transform="grow-2"
                icon={faArrowAltCircleUp as IconProp}
              />
              Submit
            </button>
          </div>
        </FooterWrapper>
      </div>
    </Wrapper>
  );
};

export default NominatePool;
