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
import { planckBnToUnit, rmCommas } from 'Utils';
import { useActivePools } from 'contexts/Pools/ActivePool';
import { usePoolsConfig } from 'contexts/Pools/PoolsConfig';
import { useBondedPools } from 'contexts/Pools/BondedPools';
import { usePoolMembers } from 'contexts/Pools/PoolMembers';
import { usePoolMemberships } from 'contexts/Pools/PoolMemberships';
import { EstimatedTxFee } from 'library/EstimatedTxFee';
import { useTxFees } from 'contexts/TxFees';
import { ContentWrapper } from './Wrappers';
import { FooterWrapper, Separator, NotesWrapper } from '../Wrappers';

export const Forms = forwardRef(
  ({ setSection, unlock, task }: any, ref: any) => {
    const { api, network } = useApi();
    const { activeAccount, accountHasSigner } = useConnect();
    const { staking } = useStaking();
    const { removeFavourite: removeFavouritePool } = usePoolsConfig();
    const { membership } = usePoolMemberships();
    const { selectedActivePool } = useActivePools();
    const { removeFromBondedPools } = useBondedPools();
    const { removePoolMember } = usePoolMembers();
    const { setStatus: setModalStatus, config } = useModal();
    const { getBondedAccount } = useBalances();
    const { txFeesValid } = useTxFees();

    const { bondType, poolClosure } = config || {};
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
      } else if (task === 'withdraw' && isPooling && selectedActivePool) {
        _tx = api.tx.nominationPools.withdrawUnbonded(
          activeAccount,
          historyDepth
        );
      }
      return _tx;
    };
    const signingAccount = isStaking ? controller : activeAccount;
    const { submitTx, submitting } = useSubmitExtrinsic({
      tx: tx(),
      from: signingAccount,
      shouldSubmit: valid,
      callbackSubmit: () => {
        setModalStatus(0);
      },
      callbackInBlock: () => {
        // if pool is being closed, remove from static lists
        if (poolClosure) {
          removeFavouritePool(selectedActivePool?.addresses?.stash ?? '');
          removeFromBondedPools(selectedActivePool?.id ?? 0);
        }

        // if no more bonded funds from pool, remove from poolMembers list
        if (bondType === 'pool') {
          const points = membership?.points ? rmCommas(membership.points) : 0;
          const bonded = planckBnToUnit(new BN(points), network.units);
          if (bonded === 0) {
            removePoolMember(activeAccount);
          }
        }
      },
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
              <EstimatedTxFee />
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
                  !valid ||
                  submitting ||
                  !accountHasSigner(signingAccount) ||
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
      </ContentWrapper>
    );
  }
);
