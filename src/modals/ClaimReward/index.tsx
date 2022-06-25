// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState, useEffect } from 'react';
import { formatBalance } from '@polkadot/util';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWallet } from '@fortawesome/free-solid-svg-icons';
import { faArrowAltCircleUp } from '@fortawesome/free-regular-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { useApi } from 'contexts/Api';
import { useModal } from 'contexts/Modal';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { useConnect } from 'contexts/Connect';
import { Warning } from 'library/Form/Warning';
import { APIContextInterface } from 'types/api';
import { useActivePool } from 'contexts/Pools/ActivePool';
import { ConnectContextInterface } from 'types/connect';
import { ActivePoolContextState } from 'types/pools';
import {
  HeadingWrapper,
  FooterWrapper,
  Separator,
  PaddingWrapper,
} from '../Wrappers';

export const ClaimReward = () => {
  const { api, network } = useApi() as APIContextInterface;
  const { setStatus: setModalStatus }: any = useModal();
  const { activeBondedPool } = useActivePool() as ActivePoolContextState;
  const { activeAccount, accountHasSigner } =
    useConnect() as ConnectContextInterface;
  const { units, unit } = network;
  const { unclaimedReward } = activeBondedPool || {};

  // ensure selected payout is valid
  useEffect(() => {
    if (unclaimedReward?.gtn(0)) {
      setValid(true);
    } else {
      setValid(false);
    }
  }, [activeBondedPool]);

  // valid to submit transaction
  const [valid, setValid] = useState<boolean>(false);

  // tx to submit
  const tx = () => {
    let _tx = null;
    if (!api) {
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
    <PaddingWrapper verticalOnly>
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
        {!accountHasSigner(activeAccount) && (
          <Warning text="Your account is read only, and cannot sign transactions." />
        )}
        {!unclaimedReward?.gtn(0) && (
          <Warning text="You have no rewards to claim." />
        )}
        <h2>
          {formatBalance(unclaimedReward, {
            decimals: units,
            withSiFull: true,
            withUnit: unit,
          })}
        </h2>
        <Separator />
        <div className="notes">
          <p>
            Estimated Tx Fee:{' '}
            {estimatedFee === null ? '...' : `${estimatedFee}`}
          </p>
        </div>
        <FooterWrapper>
          <div>
            <button
              type="button"
              className="submit"
              onClick={() => submitTx()}
              disabled={
                !valid || submitting || !accountHasSigner(activeAccount)
              }
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
    </PaddingWrapper>
  );
};

export default ClaimReward;
