// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStopCircle, faWallet } from '@fortawesome/free-solid-svg-icons';
import { faArrowAltCircleUp } from '@fortawesome/free-regular-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { HeadingWrapper, FooterWrapper, Separator } from '../Wrappers';
import { Wrapper } from './Wrapper';
import { useBalances } from '../../contexts/Balances';
import { useApi } from '../../contexts/Api';
import { useModal } from '../../contexts/Modal';
import { useStaking } from '../../contexts/Staking';
import { useSubmitExtrinsic } from '../../library/Hooks/useSubmitExtrinsic';
import { useConnect } from '../../contexts/Connect';
import { Warning } from '../../library/Form/Warning';
import { APIContextInterface } from '../../types/api';
import { usePools } from '../../contexts/Pools';
import { toFixedIfNecessary, planckBnToUnit } from '../../Utils';

export const ClaimReward = () => {
  const { api, network } = useApi() as APIContextInterface;
  const { setStatus: setModalStatus }: any = useModal();
  const { activeBondedPool } = usePools();
  const { activeAccount } = useConnect();
  const { units, unit } = network;
  const { unclaimedReward } = activeBondedPool || {};
  const payoutAmount = unclaimedReward
    ? toFixedIfNecessary(planckBnToUnit(unclaimedReward, units), units)
    : 0;

  // ensure selected payout is valid
  useEffect(() => {
    if (payoutAmount) {
      setValid(true);
    } else {
      setValid(false);
    }
  }, [activeBondedPool]);

  // valid to submit transaction
  const [valid, setValid]: any = useState(false);

  // tx to submit
  const tx = () => {
    let _tx = null;
    if (!api || !valid) {
      return _tx;
    }
    _tx = api.tx.nominationPools.claimPayout();
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

  return (
    <Wrapper>
      <HeadingWrapper>
        <FontAwesomeIcon transform="grow-2" icon={faWallet} />
        Claim Payout
      </HeadingWrapper>
      <div
        style={{
          padding: '0 1rem',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        {!payoutAmount && (
          <>
            <Warning text="You have no Pool rewards to claim." />
            <Separator />
          </>
        )}
        <div className="notes">
          <h2>
            Claim {payoutAmount} {network.unit} rewards.
          </h2>
          <Separator />
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

export default ClaimReward;
