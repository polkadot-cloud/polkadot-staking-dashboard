// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { BN, max } from 'bn.js';
import { useState, useEffect } from 'react';
import { useModal } from 'contexts/Modal';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { BondFeedback } from 'library/Form/Bond/BondFeedback';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { planckBnToUnit, unitToPlanckBn } from 'Utils';
import { EstimatedTxFee } from 'library/EstimatedTxFee';
import { useTxFees } from 'contexts/TxFees';
import { defaultThemes } from 'theme/default';
import { useTheme } from 'contexts/Themes';
import { BN_ZERO } from '@polkadot/util';
import { useTransferOptions } from 'contexts/TransferOptions';
import { useTranslation } from 'react-i18next';
import { NotesWrapper } from '../../Wrappers';
import { FormFooter } from './FormFooter';
import { FormsProps } from '../types';

export const BondSome = (props: FormsProps) => {
  const { section, setSection, setLocalResize } = props;
  const { t } = useTranslation('common');

  const { api, network } = useApi();
  const { mode } = useTheme();
  const { units } = network;
  const { setStatus: setModalStatus, config } = useModal();
  const { activeAccount, accountHasSigner } = useConnect();
  const { getTransferOptions } = useTransferOptions();
  const { bondType } = config;
  const { txFees, txFeesValid } = useTxFees();

  const isStaking = bondType === 'stake';
  const isPooling = bondType === 'pool';

  const { freeBalance: freeBalanceBn } = getTransferOptions(activeAccount);
  const freeBalance = planckBnToUnit(freeBalanceBn, units);

  // local bond value
  const [bond, setBond] = useState({ bond: freeBalance });

  // bond minus tx fees
  const enoughToCoverTxFees: boolean =
    freeBalance - Number(bond.bond) > planckBnToUnit(txFees, units);

  const bondAfterTxFees = enoughToCoverTxFees
    ? unitToPlanckBn(Number(bond.bond), units)
    : max(unitToPlanckBn(Number(bond.bond), units).sub(txFees), new BN(0));

  // bond valid
  const [bondValid, setBondValid] = useState<boolean>(false);

  // update bond value on task change
  useEffect(() => {
    const _bond = freeBalance;
    setBond({ bond: _bond });
  }, [freeBalance]);

  // modal resize on form update
  useEffect(() => {
    if (section === 1) {
      if (setLocalResize) setLocalResize();
    }
  }, [bond, txFees, bondValid]);

  // tx to submit
  const tx = () => {
    let _tx = null;
    if (!bondValid || !api || !activeAccount) {
      return _tx;
    }

    // convert to submittable string
    const bondToSubmit = bondAfterTxFees.toString();

    // determine _tx
    if (isPooling) {
      _tx = api.tx.nominationPools.bondExtra({ FreeBalance: bondToSubmit });
    } else if (isStaking) {
      _tx = api.tx.staking.bondExtra(bondToSubmit);
    }
    return _tx;
  };

  const { submitTx, submitting } = useSubmitExtrinsic({
    tx: tx(),
    from: activeAccount,
    shouldSubmit: bondValid,
    callbackSubmit: () => {
      setModalStatus(2);
    },
    callbackInBlock: () => {},
  });

  const warnings = [];
  if (!accountHasSigner(activeAccount)) {
    warnings.push(t('modals.w1'));
  }

  return (
    <>
      <div className="items">
        <BondFeedback
          bondType={bondType}
          listenIsValid={setBondValid}
          defaultBond={null}
          setLocalResize={setLocalResize}
          setters={[
            {
              set: setBond,
              current: bond,
            },
          ]}
          warnings={warnings}
        />
        <NotesWrapper>
          {txFees.gt(BN_ZERO) && (
            <p style={{ color: defaultThemes.text.success[mode] }}>
              {t('modals.update_bond3')}
            </p>
          )}
        </NotesWrapper>
        <EstimatedTxFee />
      </div>
      <FormFooter
        setSection={setSection}
        submitTx={submitTx}
        submitting={submitting}
        isValid={bondValid && accountHasSigner(activeAccount) && txFeesValid}
      />
    </>
  );
};
