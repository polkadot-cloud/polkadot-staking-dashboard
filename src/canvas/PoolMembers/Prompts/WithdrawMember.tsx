// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Polkicon } from '@w3ux/react-polkicon';
import { ellipsisFn, planckToUnit, remToUnit, rmCommas } from '@w3ux/utils';
import BigNumber from 'bignumber.js';
import type { RefObject } from 'react';
import { useState } from 'react';
import { useApi } from 'contexts/Api';
import { usePoolMembers } from 'contexts/Pools/PoolMembers';
import { Warning } from 'library/Form/Warning';
import { useSignerWarnings } from 'hooks/useSignerWarnings';
import { useSubmitExtrinsic } from 'hooks/useSubmitExtrinsic';
import { SubmitTx } from 'library/SubmitTx';
import { useNetwork } from 'contexts/Network';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import type { PoolMembership } from 'contexts/Pools/types';
import { usePrompt } from 'contexts/Prompt';
import { Title } from 'library/Prompt/Title';
import { useTranslation } from 'react-i18next';
import { ModalPadding } from 'kits/Overlay/structure/ModalPadding';
import { ModalWarnings } from 'kits/Overlay/structure/ModalWarnings';
import { ModalNotes } from 'kits/Overlay/structure/ModalNotes';

export const WithdrawMember = ({
  who,
  member,
  memberRef,
}: {
  who: string;
  member: PoolMembership;
  memberRef: RefObject<HTMLDivElement>;
}) => {
  const { t } = useTranslation('modals');
  const {
    networkData: { units, unit },
  } = useNetwork();
  const { closePrompt } = usePrompt();
  const { api, consts, activeEra } = useApi();
  const { activeAccount } = useActiveAccounts();
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

  const bonded = new BigNumber(planckToUnit(rmCommas(points), units));
  const totalWithdraw = new BigNumber(
    planckToUnit(totalWithdrawUnit.toString(), units)
  );

  // valid to submit transaction
  const [valid] = useState<boolean>(!totalWithdraw.isZero());

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
      // remove the pool member from member list.
      memberRef.current?.remove();
      closePrompt();
    },
    callbackInBlock: () => {
      // remove the pool member from context if no more funds bonded.
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
      <Title title={t('withdrawPoolMember')} />
      <ModalPadding>
        {warnings.length > 0 ? (
          <ModalWarnings withMargin>
            {warnings.map((text, i) => (
              <Warning key={`warning${i}`} text={text} />
            ))}
          </ModalWarnings>
        ) : null}

        <h3 className="modal-action-item">
          <Polkicon address={who} size={remToUnit('2rem')} />
          &nbsp; {ellipsisFn(who, 7)}
        </h3>

        <ModalNotes>
          <p>
            <p>
              {t('amountWillBeWithdrawn', { bond: bonded.toString(), unit })}
            </p>{' '}
          </p>
          <p>{t('withdrawRemoveNote')}</p>
        </ModalNotes>
      </ModalPadding>
      <SubmitTx valid={valid} {...submitExtrinsic} />
    </>
  );
};
