// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ActionItem, ModalPadding, ModalWarnings } from '@polkadot-cloud/react';
import { isNotZero, planckToUnit, rmCommas } from '@polkadot-cloud/utils';
import BigNumber from 'bignumber.js';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApi } from 'contexts/Api';
import { useNetworkMetrics } from 'contexts/NetworkMetrics';
import { usePoolMembers } from 'contexts/Pools/PoolMembers';
import { Warning } from 'library/Form/Warning';
import { useSignerWarnings } from 'library/Hooks/useSignerWarnings';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { SubmitTx } from 'library/SubmitTx';
import { useNetwork } from 'contexts/Network';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import type { PoolMembership } from 'contexts/Pools/PoolMemberships/types';
import { usePrompt } from 'contexts/Prompt';
import { CloseWrapper } from 'library/Modal/Wrappers';
import CrossSVG from 'img/cross.svg?react';

export const WithdrawMember = ({
  who,
  member,
}: {
  who: string;
  member: PoolMembership;
}) => {
  const { t } = useTranslation('modals');
  const { api, consts } = useApi();
  const {
    networkData: { units, unit },
  } = useNetwork();
  const { closePrompt } = usePrompt();
  const { activeAccount } = useActiveAccounts();
  const { activeEra } = useNetworkMetrics();
  const { removePoolMember } = usePoolMembers();
  const { getSignerWarnings } = useSignerWarnings();

  const { historyDepth } = consts;
  const { unbondingEras, points } = member;

  // calculate total for withdraw
  let totalWithdrawUnit = new BigNumber(0);

  Object.entries(unbondingEras).forEach((entry) => {
    const [era, amount] = entry;
    if (activeEra.index.isGreaterThan(era)) {
      totalWithdrawUnit = totalWithdrawUnit.plus(
        new BigNumber(rmCommas(amount as string))
      );
    }
  });

  const bonded = planckToUnit(new BigNumber(rmCommas(points)), units);

  const totalWithdraw = planckToUnit(new BigNumber(totalWithdrawUnit), units);

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
      closePrompt();
    },
    callbackInBlock: () => {
      // remove the pool member from context if no more funds bonded
      if (bonded.isZero()) {
        removePoolMember(who);
      }
    },
  });

  const warnings = getSignerWarnings(
    activeAccount,
    false,
    submitExtrinsic.proxySupported
  );

  return (
    <>
      <CloseWrapper>
        <button type="button" onClick={() => closePrompt()}>
          <CrossSVG style={{ width: '1.25rem', height: '1.25rem' }} />
        </button>
      </CloseWrapper>
      <ModalPadding>
        <ActionItem text={`${t('withdraw')} ${totalWithdraw} ${unit}`} />
        {warnings.length > 0 ? (
          <ModalWarnings withMargin>
            {warnings.map((text, i) => (
              <Warning key={`warning${i}`} text={text} />
            ))}
          </ModalWarnings>
        ) : null}
      </ModalPadding>
      <SubmitTx valid={valid} {...submitExtrinsic} />
    </>
  );
};
