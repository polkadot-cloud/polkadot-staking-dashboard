// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faArrowAltCircleUp } from '@fortawesome/free-regular-svg-icons';
import { faStopCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useApi } from 'contexts/Api';
import { useBalances } from 'contexts/Balances';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { useTxFees } from 'contexts/TxFees';
import { EstimatedTxFee } from 'library/EstimatedTxFee';
import { Warning } from 'library/Form/Warning';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { Title } from 'library/Modal/Title';
import { useEffect, useState } from 'react';
import {
  FooterWrapper,
  NotesWrapper,
  PaddingWrapper,
  Separator,
} from '../Wrappers';

export const ChangeNominations = () => {
  const { api } = useApi();
  const { activeAccount, accountHasSigner } = useConnect();
  const { getBondedAccount, getAccountNominations } = useBalances();
  const { setStatus: setModalStatus, config } = useModal();
  const { poolNominations, isNominator, isOwner, selectedActivePool } =
    useActivePools();
  const { txFeesValid } = useTxFees();

  const { nominations: newNominations, provider, bondType } = config;

  const isPool = bondType === 'pool';
  const isStaking = bondType === 'stake';
  const controller = getBondedAccount(activeAccount);
  const signingAccount = isPool ? activeAccount : controller;

  const nominations =
    isPool === true
      ? poolNominations.targets
      : getAccountNominations(activeAccount);
  const removing = nominations.length - newNominations.length;
  const remaining = newNominations.length;

  // valid to submit transaction
  const [valid, setValid] = useState<boolean>(false);

  // ensure selected key is valid
  useEffect(() => {
    setValid(nominations.length > 0);
  }, [nominations]);

  // ensure roles are valid
  let isValid = nominations.length > 0;
  if (isPool) {
    isValid = (isNominator() || isOwner()) ?? false;
  }
  useEffect(() => {
    setValid(isValid);
  }, [isValid]);

  // tx to submit
  const tx = () => {
    let _tx = null;
    if (!valid || !api) {
      return _tx;
    }

    // targets submission differs between staking and pools
    const targetsToSubmit = newNominations.map((item: any) =>
      isPool
        ? item
        : {
            Id: item,
          }
    );

    if (isPool) {
      // if nominations remain, call nominate
      if (remaining !== 0) {
        _tx = api.tx.nominationPools.nominate(
          selectedActivePool?.id || 0,
          targetsToSubmit
        );
      } else {
        // wishing to stop all nominations, call chill
        _tx = api.tx.nominationPools.chill(selectedActivePool?.id || 0);
      }
    } else if (isStaking) {
      if (remaining !== 0) {
        _tx = api.tx.staking.nominate(targetsToSubmit);
      } else {
        _tx = api.tx.staking.chill();
      }
    }
    return _tx;
  };

  const { submitTx, submitting } = useSubmitExtrinsic({
    tx: tx(),
    from: signingAccount,
    shouldSubmit: valid,
    callbackSubmit: () => {
      setModalStatus(2);

      // if removing a subset of nominations, reset selected list
      if (provider) {
        provider.setSelectActive(false);
        provider.resetSelected();
      }
    },
    callbackInBlock: () => {},
  });

  return (
    <>
      <Title title="Stop Nominating" icon={faStopCircle} />
      <PaddingWrapper verticalOnly>
        <div
          style={{
            padding: '0 1.25rem',
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          {!nominations.length && (
            <Warning text="You have no nominations set." />
          )}
          {!accountHasSigner(signingAccount) && (
            <Warning
              text={`You must have your${
                bondType === 'stake' ? ' controller ' : ' '
              }account imported to stop nominating.`}
            />
          )}
          <h2>
            Stop {!remaining ? 'All Nomination' : `${removing} Nomination`}
            {removing === 1 ? '' : 's'}
          </h2>
          <Separator />
          <NotesWrapper>
            <p>
              Once submitted, your nominations will be removed from your
              dashboard immediately, and will not be nominated from the start of
              the next era.
            </p>
            <EstimatedTxFee />
          </NotesWrapper>
          <FooterWrapper>
            <div>
              <button
                type="button"
                className="submit primary"
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
      </PaddingWrapper>
    </>
  );
};

export default ChangeNominations;
