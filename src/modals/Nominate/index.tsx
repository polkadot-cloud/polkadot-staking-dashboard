// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlayCircle } from '@fortawesome/free-solid-svg-icons';
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
import { useStaking } from '../../contexts/Staking';
import { planckBnToUnit } from '../../Utils';
import { APIContextInterface } from '../../types/api';

export const Nominate = () => {
  const { api, network } = useApi() as APIContextInterface;
  const { activeAccount } = useConnect();
  const { targets, staking, getControllerNotImported } = useStaking();
  const { getBondedAccount, getAccountLedger }: any = useBalances();
  const { setStatus: setModalStatus }: any = useModal();
  const { units } = network;
  const { minNominatorBond } = staking;
  const controller = getBondedAccount(activeAccount);
  const { nominations } = targets;
  const ledger = getAccountLedger(activeAccount);
  const { active } = ledger;

  const activeBase = planckBnToUnit(active, units);
  const minNominatorBondBase = planckBnToUnit(minNominatorBond, units);

  // valid to submit transaction
  const [valid, setValid]: any = useState(false);

  // ensure selected key is valid
  useEffect(() => {
    setValid(nominations.length > 0 && activeBase >= minNominatorBondBase);
  }, [targets]);

  // tx to submit
  const tx = () => {
    let _tx = null;
    if (!valid || !api) {
      return _tx;
    }
    const targetsToSubmit = nominations.map((item: any) => {
      return {
        Id: item.address,
      };
    });
    _tx = api.tx.staking.nominate(targetsToSubmit);
    return _tx;
  };

  const { submitTx, estimatedFee, submitting }: any = useSubmitExtrinsic({
    tx: tx(),
    from: controller,
    shouldSubmit: valid,
    callbackSubmit: () => {
      setModalStatus(0);
    },
    callbackInBlock: () => {},
  });

  // warnings
  const warnings = [];
  if (getControllerNotImported(controller)) {
    warnings.push(
      'You must have your controller account imported to start nominating'
    );
  }
  if (!nominations.length) {
    warnings.push('You have no nominations set.');
  }
  if (activeBase < minNominatorBondBase) {
    warnings.push(
      `You do not meet the minimum nominator bond of ${minNominatorBondBase} ${network.unit}. Please bond some funds before nominating.`
    );
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

export default Nominate;
