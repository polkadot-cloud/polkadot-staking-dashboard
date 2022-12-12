// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faArrowAltCircleUp, faMinus } from '@fortawesome/free-solid-svg-icons';
import { ButtonSubmit } from '@rossbulat/polkadot-dashboard-ui';
import BN from 'bn.js';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { useNetworkMetrics } from 'contexts/Network';
import { usePoolMembers } from 'contexts/Pools/PoolMembers';
import { useTxFees } from 'contexts/TxFees';
import { EstimatedTxFee } from 'library/EstimatedTxFee';
import { Warning } from 'library/Form/Warning';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { Title } from 'library/Modal/Title';
import { ContentWrapper } from 'modals/UpdateBond/Wrappers';
import {
  FooterWrapper,
  NotesWrapper,
  PaddingWrapper,
  Separator,
} from 'modals/Wrappers';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { planckBnToUnit, rmCommas } from 'Utils';

export const WithdrawPoolMember = () => {
  const { api, network, consts } = useApi();
  const { activeAccount, accountHasSigner } = useConnect();
  const { setStatus: setModalStatus, config } = useModal();
  const { metrics } = useNetworkMetrics();
  const { removePoolMember } = usePoolMembers();
  const { txFeesValid } = useTxFees();
  const { t } = useTranslation('modals');

  const { activeEra } = metrics;
  const { member, who } = config;
  const { historyDepth } = consts;
  const { unbondingEras, points } = member;

  // calculate total for withdraw
  let totalWithdrawBase: BN = new BN(0);

  Object.entries(unbondingEras).forEach((entry: any) => {
    const [era, amount] = entry;
    if (activeEra.index > era) {
      totalWithdrawBase = totalWithdrawBase.add(new BN(rmCommas(amount)));
    }
  });

  const bonded = planckBnToUnit(new BN(rmCommas(points)), network.units);

  const totalWithdraw = planckBnToUnit(
    new BN(totalWithdrawBase),
    network.units
  );

  // valid to submit transaction
  const [valid] = useState<boolean>(totalWithdraw > 0 ?? false);

  // tx to submit
  const getTx = () => {
    let tx = null;
    if (!valid || !api) {
      return tx;
    }
    tx = api.tx.nominationPools.withdrawUnbonded(who, historyDepth);
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
      if (bonded === 0) {
        removePoolMember(who);
      }
    },
  });

  return (
    <>
      <Title title={t('withdraw_member_funds')} icon={faMinus} />
      <PaddingWrapper verticalOnly />
      <ContentWrapper>
        <div>
          <div>
            {!accountHasSigner(activeAccount) && (
              <Warning text={t('read_only')} />
            )}
            <h2>
              {t('withdraw')} {totalWithdraw} {network.unit}
            </h2>

            <Separator />
            <NotesWrapper>
              <EstimatedTxFee />
            </NotesWrapper>
          </div>
          <FooterWrapper>
            <div>
              <ButtonSubmit
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
              />
            </div>
          </FooterWrapper>
        </div>
      </ContentWrapper>
    </>
  );
};
