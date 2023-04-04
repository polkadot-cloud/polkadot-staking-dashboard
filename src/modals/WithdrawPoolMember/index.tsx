// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { isNotZero, planckToUnit, rmCommas } from '@polkadotcloud/utils';
import BigNumber from 'bignumber.js';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { useNetworkMetrics } from 'contexts/Network';
import { usePoolMembers } from 'contexts/Pools/PoolMembers';
import { Warning } from 'library/Form/Warning';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { Action } from 'library/Modal/Action';
import { Close } from 'library/Modal/Close';
import { SubmitTx } from 'library/SubmitTx';
import { PaddingWrapper, WarningsWrapper } from 'modals/Wrappers';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const WithdrawPoolMember = () => {
  const { t } = useTranslation('modals');
  const { api, network, consts } = useApi();
  const { activeAccount, accountHasSigner } = useConnect();
  const { setStatus: setModalStatus, config } = useModal();
  const { activeEra } = useNetworkMetrics();
  const { removePoolMember } = usePoolMembers();

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
  const [valid] = useState<boolean>(isNotZero(totalWithdraw) ?? false);

  // tx to submit
  const getTx = () => {
    let tx = null;
    if (!valid || !api) {
      return tx;
    }
    tx = api.tx.nominationPools.withdrawUnbonded(who, historyDepth.toString());
    return tx;
  };
  const submitExtrinsic = useSubmitExtrinsic({
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
        <Action text={`${t('withdraw')} ${totalWithdraw} ${network.unit}`} />
        {!accountHasSigner(activeAccount) ? (
          <WarningsWrapper>
            <Warning text={t('readOnly')} />
          </WarningsWrapper>
        ) : null}
      </PaddingWrapper>
      <SubmitTx valid={valid} {...submitExtrinsic} />
    </>
  );
};
