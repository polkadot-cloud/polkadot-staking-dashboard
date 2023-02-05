// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faArrowAltCircleUp } from '@fortawesome/free-solid-svg-icons';
import { ButtonSubmit } from '@rossbulat/polkadot-dashboard-ui';
import BigNumber from 'bignumber.js';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { useNetworkMetrics } from 'contexts/Network';
import { usePoolMembers } from 'contexts/Pools/PoolMembers';
import { useTxFees } from 'contexts/TxFees';
import { Warning } from 'library/Form/Warning';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { Close } from 'library/Modal/Close';
import { SubmitTx } from 'library/SubmitTx';
import { PaddingWrapper, Separator } from 'modals/Wrappers';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { planckToUnit, rmCommas } from 'Utils';

export const WithdrawPoolMember = () => {
  const { t } = useTranslation('modals');
  const { api, network, consts } = useApi();
  const { activeAccount, accountHasSigner } = useConnect();
  const { setStatus: setModalStatus, config } = useModal();
  const { activeEra } = useNetworkMetrics();
  const { removePoolMember } = usePoolMembers();
  const { txFeesValid } = useTxFees();

  const { member, who } = config;
  const { historyDepth } = consts;
  const { unbondingEras, points } = member;

  // calculate total for withdraw
  let totalWithdrawUnit = new BigNumber(0);

  Object.entries(unbondingEras).forEach((entry: any) => {
    const [era, amount] = entry;
    if (activeEra.index > era) {
      totalWithdrawUnit = totalWithdrawUnit.plus(
        new BigNumber(rmCommas(amount))
      );
    }
  });

  const bonded = planckToUnit(new BigNumber(rmCommas(points)), network.units);

  const totalWithdraw = planckToUnit(
    new BigNumber(totalWithdrawUnit),
    network.units
  );

  // valid to submit transaction
  const [valid] = useState<boolean>(!totalWithdraw.isZero() ?? false);

  // tx to submit
  const getTx = () => {
    let tx = null;
    if (!valid || !api) {
      return tx;
    }
    tx = api.tx.nominationPools.withdrawUnbonded(who, historyDepth.toString());
    return tx;
  };
  const { submitTx, submitting } = useSubmitExtrinsic({
    tx: getTx(),
    from: activeAccount,
    shouldSubmit: valid,
    callbackSubmit: () => {
      setModalStatus(2);
    },
    callbackInBlock: () => {
      // remove the pool member from context if no more funds bonded
      if (bonded.isZero()) {
        removePoolMember(who);
      }
    },
  });

  return (
    <>
      <Close />
      <PaddingWrapper>
        <h2 className="title">{t('withdrawMemberFunds')}</h2>
        <h2 className="title">
          {`${t('withdraw')} ${totalWithdraw} ${network.unit}`}
        </h2>
        <Separator />
        {!accountHasSigner(activeAccount) && <Warning text={t('readOnly')} />}
      </PaddingWrapper>
      <SubmitTx
        buttons={[
          <ButtonSubmit
            key="button_submit"
            text={`${submitting ? t('submitting') : t('submit')}`}
            iconLeft={faArrowAltCircleUp}
            iconTransform="grow-2"
            onClick={() => submitTx()}
            disabled={
              !valid ||
              submitting ||
              !accountHasSigner(activeAccount) ||
              !txFeesValid
            }
          />,
        ]}
      />
    </>
  );
};
