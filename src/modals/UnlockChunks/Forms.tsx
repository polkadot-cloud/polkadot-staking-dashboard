// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import { useState, useEffect, forwardRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { faArrowAltCircleUp } from '@fortawesome/free-regular-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { useModal } from 'contexts/Modal';
import { useBalances } from 'contexts/Balances';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { Warning } from 'library/Form/Warning';
import { useStaking } from 'contexts/Staking';
import { planckBnToUnit } from 'Utils';
import { ConnectContextInterface } from 'types/connect';
import { useActivePool } from 'contexts/Pools/ActivePool';
import { ContentWrapper } from './Wrappers';
import { FooterWrapper, Separator, NotesWrapper } from '../Wrappers';

export const Forms = forwardRef(
  ({ setSection, unlock, task }: any, ref: any) => {
    const { api, network } = useApi();
    const { activeAccount, accountHasSigner } =
      useConnect() as ConnectContextInterface;
    const { staking } = useStaking();
    const { activeBondedPool } = useActivePool();
    const { setStatus: setModalStatus, config } = useModal();
    const { bondType } = config || {};
    const { getBondedAccount } = useBalances();
    const { historyDepth } = staking;
    const { units } = network;
    const controller = getBondedAccount(activeAccount);

    const isStaking = bondType === 'stake';
    const isPooling = bondType === 'pool';

    // valid to submit transaction
    const [valid, setValid] = useState<boolean>(
      unlock?.value?.toNumber() > 0 ?? false
    );

    // ensure unlock value is valid
    useEffect(() => {
      setValid(unlock?.value?.toNumber() > 0 ?? false);
    }, [unlock]);

    // tx to submit
    const tx = () => {
      let _tx = null;
      if (!valid || !api) {
        return _tx;
      }
      // rebond is only available when staking directly.
      if (task === 'rebond' && isStaking) {
        _tx = api.tx.staking.rebond(unlock.value.toNumber());
      } else if (task === 'withdraw' && isStaking) {
        _tx = api.tx.staking.withdrawUnbonded(historyDepth);
      } else if (task === 'withdraw' && isPooling && activeBondedPool) {
        _tx = api.tx.nominationPools.withdrawUnbonded(
          activeAccount,
          activeBondedPool?.slashingSpansCount
        );
      }
      return _tx;
    };
    const signingAccount = isStaking ? controller : activeAccount;
    const { submitTx, estimatedFee, submitting } = useSubmitExtrinsic({
      tx: tx(),
      from: signingAccount,
      shouldSubmit: valid,
      callbackSubmit: () => {
        setModalStatus(0);
      },
      callbackInBlock: () => {},
    });

    const value = unlock?.value ?? new BN(0);

    return (
      <ContentWrapper>
        <div ref={ref} style={{ paddingBottom: '1rem' }}>
          <div>
            {!accountHasSigner(signingAccount) && (
              <Warning text="Your account is read only, and cannot sign transactions." />
            )}
            {task === 'rebond' && (
              <h2>
                Rebond {planckBnToUnit(value, units)} {network.unit}
              </h2>
            )}
            {task === 'withdraw' && (
              <h2>
                Withdraw {planckBnToUnit(value, units)} {network.unit}
              </h2>
            )}
            <Separator />
            <NotesWrapper>
              <p>
                Estimated Tx Fee:{' '}
                {estimatedFee === null ? '...' : `${estimatedFee}`}
              </p>
            </NotesWrapper>
          </div>
          <FooterWrapper>
            <div>
              <button
                type="button"
                className="submit"
                onClick={() => setSection(0)}
              >
                <FontAwesomeIcon transform="shrink-2" icon={faChevronLeft} />
                Back
              </button>
            </div>
            <div>
              <button
                type="button"
                className="submit"
                onClick={() => submitTx()}
                disabled={
                  !valid || submitting || !accountHasSigner(signingAccount)
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
      </ContentWrapper>
    );
  }
);
