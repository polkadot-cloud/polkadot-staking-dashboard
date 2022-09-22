// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShare, faPlus } from '@fortawesome/free-solid-svg-icons';
import { faArrowAltCircleUp } from '@fortawesome/free-regular-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { useApi } from 'contexts/Api';
import { useModal } from 'contexts/Modal';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { useConnect } from 'contexts/Connect';
import { Warning } from 'library/Form/Warning';
import { useActivePool } from 'contexts/Pools/ActivePool';
import { planckBnToUnit } from 'Utils';
import { BN } from 'bn.js';
import { EstimatedTxFee } from 'library/EstimatedTxFee';
import { useTxFees } from 'contexts/TxFees';
import { Title } from 'library/Modal/Title';
import { FooterWrapper, Separator, PaddingWrapper } from '../Wrappers';

export const ClaimReward = () => {
  const { api, network } = useApi();
  const { setStatus: setModalStatus, config } = useModal();
  const { activeBondedPool } = useActivePool();
  const { activeAccount, accountHasSigner } = useConnect();
  const { txFeesValid } = useTxFees();
  const { units, unit } = network;
  let { unclaimedRewards } = activeBondedPool || {};
  unclaimedRewards = unclaimedRewards ?? new BN(0);
  const { claimType } = config;

  // ensure selected payout is valid
  useEffect(() => {
    if (unclaimedRewards?.gtn(0)) {
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

    if (claimType === 'bond') {
      _tx = api.tx.nominationPools.bondExtra('Rewards');
    } else {
      _tx = api.tx.nominationPools.claimPayout();
    }
    return _tx;
  };

  const { submitTx, submitting } = useSubmitExtrinsic({
    tx: tx(),
    from: activeAccount,
    shouldSubmit: valid,
    callbackSubmit: () => {
      setModalStatus(0);
    },
    callbackInBlock: () => {},
  });

  return (
    <>
      <Title
        title={`${claimType === 'bond' ? 'Bond' : 'Withdraw'} Rewards`}
        icon={claimType === 'bond' ? faPlus : faShare}
      />
      <PaddingWrapper>
        <div
          style={{
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          {!accountHasSigner(activeAccount) && (
            <Warning text="Your account is read only, and cannot sign transactions." />
          )}
          {!unclaimedRewards?.gtn(0) && (
            <Warning text="You have no rewards to claim." />
          )}
          <h2>
            {planckBnToUnit(unclaimedRewards, units)} {unit}
          </h2>
          <Separator />
          <div className="notes">
            {claimType === 'bond' ? (
              <p>
                Once submitted, your rewards will be bonded back into the pool.
                You own these additional bonded funds and will be able to
                withdraw them at any time.
              </p>
            ) : (
              <p>
                Withdrawing rewards will immediately transfer them to your
                account as free balance.
              </p>
            )}
            <EstimatedTxFee />
          </div>
          <FooterWrapper>
            <div>
              <button
                type="button"
                className="submit"
                onClick={() => submitTx()}
                disabled={
                  !valid ||
                  submitting ||
                  !accountHasSigner(activeAccount) ||
                  !txFeesValid
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
    </>
  );
};

export default ClaimReward;
