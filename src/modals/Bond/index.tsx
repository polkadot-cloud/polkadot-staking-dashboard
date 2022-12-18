// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faArrowAltCircleUp, faPlus } from '@fortawesome/free-solid-svg-icons';
import { ButtonSubmit } from '@rossbulat/polkadot-dashboard-ui';
import BN, { max } from 'bn.js';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { useTransferOptions } from 'contexts/TransferOptions';
import { useTxFees } from 'contexts/TxFees';
import { EstimatedTxFee } from 'library/EstimatedTxFee';
import { BondFeedback } from 'library/Form/Bond/BondFeedback';
import { Warning } from 'library/Form/Warning';
import { useBondGreatestFee } from 'library/Hooks/useBondGreatestFee';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { Title } from 'library/Modal/Title';
import { FooterWrapper, NotesWrapper, PaddingWrapper } from 'modals/Wrappers';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { planckBnToUnit, unitToPlanckBn } from 'Utils';

export const Bond = () => {
  const { t } = useTranslation('modals');
  const { api, network } = useApi();
  const { units } = network;
  const { setStatus: setModalStatus, config, setResize } = useModal();
  const { activeAccount, accountHasSigner } = useConnect();
  const { getTransferOptions } = useTransferOptions();
  const { txFeesValid } = useTxFees();
  const { selectedActivePool } = useActivePools();
  const { bondType } = config;
  const isStaking = bondType === 'stake';
  const isPooling = bondType === 'pool';
  const { freeBalance: freeBalanceBn } = getTransferOptions(activeAccount);
  const freeBalance = planckBnToUnit(freeBalanceBn, units);
  const largestTxFee = useBondGreatestFee({ bondType });

  // calculate any unclaimed pool rewards.
  let { unclaimedRewards } = selectedActivePool || {};
  unclaimedRewards = unclaimedRewards ?? new BN(0);
  unclaimedRewards = planckBnToUnit(unclaimedRewards, network.units);

  // local bond value.
  const [bond, setBond] = useState({ bond: freeBalance });

  // bond valid.
  const [bondValid, setBondValid] = useState<boolean>(false);

  // bond minus tx fees.
  const enoughToCoverTxFees: boolean =
    freeBalance - Number(bond.bond) > planckBnToUnit(largestTxFee, units);

  // bond value after max tx fees have been deducated.
  let bondAfterTxFees: BN;
  if (enoughToCoverTxFees) {
    bondAfterTxFees = unitToPlanckBn(String(bond.bond), units);
  } else {
    bondAfterTxFees = max(
      unitToPlanckBn(String(bond.bond), units).sub(largestTxFee),
      new BN(0)
    );
  }

  // update bond value on task change.
  useEffect(() => {
    const _bond = freeBalance;
    setBond({ bond: _bond });
  }, [freeBalance]);

  // modal resize on form update
  useEffect(() => {
    setResize();
  }, [bond]);

  // determine whether this is a pool or staking transaction.
  const determineTx = (bondToSubmit: string) => {
    let tx = null;
    if (!api) {
      return tx;
    }
    if (isPooling) {
      tx = api.tx.nominationPools.bondExtra({
        FreeBalance: bondToSubmit,
      });
    } else if (isStaking) {
      tx = api.tx.staking.bondExtra(bondToSubmit);
    }
    return tx;
  };

  // the actual bond tx to submit
  const getTx = (bondToSubmit: string) => {
    if (!bondValid || !activeAccount) {
      return null;
    }
    return determineTx(bondToSubmit);
  };

  const { submitTx, submitting } = useSubmitExtrinsic({
    tx: getTx(bondAfterTxFees.toString()),
    from: activeAccount,
    shouldSubmit: bondValid,
    callbackSubmit: () => {
      setModalStatus(2);
    },
    callbackInBlock: () => {},
  });

  const warnings = [];
  if (!accountHasSigner(activeAccount)) {
    warnings.push(t('readOnly'));
  }

  return (
    <>
      <Title title={`${t('addTo')} ${t('bond')}`} icon={faPlus} />
      <PaddingWrapper>
        {unclaimedRewards > 0 && bondType === 'pool' && (
          <Warning
            text={`${t('bondingWithdraw')} ${unclaimedRewards} ${
              network.unit
            }.`}
          />
        )}
        <BondFeedback
          syncing={largestTxFee.eq(new BN(0))}
          bondType={bondType}
          listenIsValid={setBondValid}
          defaultBond={null}
          setters={[
            {
              set: setBond,
              current: bond,
            },
          ]}
          warnings={warnings}
          txFees={largestTxFee}
        />
        <NotesWrapper>
          <EstimatedTxFee />
        </NotesWrapper>
        <FooterWrapper>
          <div>
            <ButtonSubmit
              text={`${submitting ? t('submitting') : t('submit')}`}
              iconLeft={faArrowAltCircleUp}
              iconTransform="grow-2"
              onClick={() => submitTx()}
              disabled={
                submitting ||
                !(bondValid && accountHasSigner(activeAccount) && txFeesValid)
              }
            />
          </div>
        </FooterWrapper>
      </PaddingWrapper>
    </>
  );
};
