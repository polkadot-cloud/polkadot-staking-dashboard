// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ModalPadding } from '@polkadot-cloud/react';
import { planckToUnit, unitToPlanck } from '@polkadot-cloud/utils';
import BigNumber from 'bignumber.js';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApi } from 'contexts/Api';
import { usePoolMembers } from 'contexts/Pools/PoolMembers';
import type { ClaimPermission } from 'contexts/Pools/types';
import { useSetup } from 'contexts/Setup';
import { defaultPoolProgress } from 'contexts/Setup/defaults';
import { useTransferOptions } from 'contexts/TransferOptions';
import { useTxMeta } from 'contexts/TxMeta';
import { BondFeedback } from 'library/Form/Bond/BondFeedback';
import { ClaimPermissionInput } from 'library/Form/ClaimPermissionInput';
import { useBatchCall } from 'library/Hooks/useBatchCall';
import { useBondGreatestFee } from 'library/Hooks/useBondGreatestFee';
import { useSignerWarnings } from 'library/Hooks/useSignerWarnings';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { Close } from 'library/Modal/Close';
import { SubmitTx } from 'library/SubmitTx';
import { useOverlay } from '@polkadot-cloud/react/hooks';
import { useNetwork } from 'contexts/Network';
import { useActiveAccounts } from 'contexts/ActiveAccounts';

export const JoinPool = () => {
  const { t } = useTranslation('modals');
  const { api } = useApi();
  const {
    networkData: { units },
  } = useNetwork();
  const { activeAccount } = useActiveAccounts();
  const { newBatchCall } = useBatchCall();
  const { setActiveAccountSetup } = useSetup();
  const { txFees, notEnoughFunds } = useTxMeta();
  const { getSignerWarnings } = useSignerWarnings();
  const { getTransferOptions } = useTransferOptions();
  const { queryPoolMember, addToPoolMembers } = usePoolMembers();
  const {
    setModalStatus,
    config: { options },
    setModalResize,
  } = useOverlay().modal;

  const { id: poolId, setActiveTab } = options;

  const {
    pool: { totalPossibleBond },
    transferrableBalance,
  } = getTransferOptions(activeAccount);

  const largestTxFee = useBondGreatestFee({ bondFor: 'pool' });

  // if we are bonding, subtract tx fees from bond amount
  const freeBondAmount = BigNumber.max(transferrableBalance.minus(txFees), 0);

  // local bond value
  const [bond, setBond] = useState<{ bond: string }>({
    bond: planckToUnit(totalPossibleBond, units).toString(),
  });

  // Updated claim permission value
  const [claimPermission, setClaimPermission] = useState<
    ClaimPermission | undefined
  >('Permissioned');

  // bond valid
  const [bondValid, setBondValid] = useState<boolean>(false);

  // feedback errors to trigger modal resize
  const [feedbackErrors, setFeedbackErrors] = useState<string[]>([]);

  // modal resize on form update
  useEffect(
    () => setModalResize(),
    [bond, notEnoughFunds, feedbackErrors.length]
  );

  // tx to submit
  const getTx = () => {
    const tx = null;
    if (!api) {
      return tx;
    }

    const bondToSubmit = unitToPlanck(!bondValid ? '0' : bond.bond, units);
    const bondAsString = bondToSubmit.isNaN() ? '0' : bondToSubmit.toString();
    const txs = [api.tx.nominationPools.join(bondAsString, poolId)];

    if (![undefined, 'Permissioned'].includes(claimPermission)) {
      txs.push(api.tx.nominationPools.setClaimPermission(claimPermission));
    }

    if (txs.length === 1) {
      return txs[0];
    }

    return newBatchCall(txs, activeAccount);
  };

  const submitExtrinsic = useSubmitExtrinsic({
    tx: getTx(),
    from: activeAccount,
    shouldSubmit: bondValid,
    callbackSubmit: () => {
      setModalStatus('closing');
      setActiveTab(0);
    },
    callbackInBlock: async () => {
      // query and add account to poolMembers list
      const member = await queryPoolMember(activeAccount);
      addToPoolMembers(member);

      // reset localStorage setup progress
      setActiveAccountSetup('pool', defaultPoolProgress);
    },
  });

  const warnings = getSignerWarnings(
    activeAccount,
    false,
    submitExtrinsic.proxySupported
  );

  return (
    <>
      <Close />
      <ModalPadding>
        <h2 className="title unbounded">{t('joinPool')}</h2>
        <BondFeedback
          syncing={largestTxFee.isZero()}
          joiningPool
          bondFor="pool"
          listenIsValid={(valid, errors) => {
            setBondValid(valid);
            setFeedbackErrors(errors);
          }}
          defaultBond={null}
          setters={[
            {
              set: setBond,
              current: bond,
            },
          ]}
          parentErrors={warnings}
          txFees={largestTxFee}
        />
        <ClaimPermissionInput
          current={undefined}
          permissioned={false}
          onChange={(val: ClaimPermission | undefined) => {
            setClaimPermission(val);
          }}
          disabled={freeBondAmount.isZero()}
        />
      </ModalPadding>
      <SubmitTx valid={bondValid} {...submitExtrinsic} />
    </>
  );
};
