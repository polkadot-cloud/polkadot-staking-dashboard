// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { unitToPlanck } from '@w3ux/utils';
import type BigNumber from 'bignumber.js';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { useNetwork } from 'contexts/Network';
import type { ClaimPermission } from 'contexts/Pools/types';
import { useSetup } from 'contexts/Setup';
import { defaultPoolProgress } from 'contexts/Setup/defaults';
import { useTransferOptions } from 'contexts/TransferOptions';
import { defaultClaimPermission } from 'controllers/ActivePools/defaults';
import { ApiController } from 'controllers/Api';
import { useBatchCall } from 'hooks/useBatchCall';
import { useBondGreatestFee } from 'hooks/useBondGreatestFee';
import { useSignerWarnings } from 'hooks/useSignerWarnings';
import { useSubmitExtrinsic } from 'hooks/useSubmitExtrinsic';
import { useOverlay } from 'kits/Overlay/Provider';
import { BondFeedback } from 'library/Form/Bond/BondFeedback';
import { ClaimPermissionInput } from 'library/Form/ClaimPermissionInput';
import { SubmitTx } from 'library/SubmitTx';
import { planckToUnitBn } from 'library/Utils';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { AnyApi } from 'types';
import type { OverviewSectionProps } from '../types';
import { JoinFormWrapper } from '../Wrappers';

export const JoinForm = ({ bondedPool }: OverviewSectionProps) => {
  const { t } = useTranslation();
  const {
    network,
    networkData: { units, unit },
  } = useNetwork();
  const {
    closeCanvas,
    config: { options },
  } = useOverlay().canvas;
  const { newBatchCall } = useBatchCall();
  const { setActiveAccountSetup } = useSetup();
  const { activeAccount } = useActiveAccounts();
  const { getSignerWarnings } = useSignerWarnings();
  const { getTransferOptions } = useTransferOptions();
  const largestTxFee = useBondGreatestFee({ bondFor: 'pool' });

  const {
    pool: { totalPossibleBond },
  } = getTransferOptions(activeAccount);

  // Pool claim permission value.
  const [claimPermission, setClaimPermission] = useState<ClaimPermission>(
    defaultClaimPermission
  );

  // Bond amount to join pool with.
  const [bond, setBond] = useState<{ bond: string }>({
    bond: planckToUnitBn(totalPossibleBond, units).toString(),
  });

  // Whether the bond amount is valid.
  const [bondValid, setBondValid] = useState<boolean>(false);

  // feedback errors to trigger modal resize
  const [feedbackErrors, setFeedbackErrors] = useState<string[]>([]);

  // Handler to set bond on input change.
  const handleSetBond = (value: { bond: BigNumber }) => {
    setBond({ bond: value.bond.toString() });
  };

  // Whether the form is ready to submit.
  const formValid = bondValid && feedbackErrors.length === 0;

  // Get transaction for submission.
  const getTx = () => {
    const pApi = ApiController.getApi(network);
    const tx = null;
    if (!pApi || !claimPermission || !formValid) {
      return tx;
    }

    const bondToSubmit = unitToPlanck(
      !bondValid ? '0' : bond.bond,
      units
    ).toString();
    const txs: AnyApi[] = [
      pApi.tx.NominationPools.join({
        amount: BigInt(bondToSubmit),
        pool_id: bondedPool.id,
      }),
    ];

    // If claim permission is not the default, add it to tx.
    if (claimPermission !== defaultClaimPermission) {
      txs.push(
        pApi.tx.NominationPools.set_claim_permission({
          permission: { type: claimPermission, value: undefined },
        })
      );
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
      closeCanvas();

      // Optional callback function on join success.
      const onJoinCallback = options?.onJoinCallback;

      if (typeof onJoinCallback === 'function') {
        onJoinCallback();
      }
    },
    callbackInBlock: async () => {
      // Reset local storage setup progress
      setActiveAccountSetup('pool', defaultPoolProgress);
    },
  });

  const warnings = getSignerWarnings(
    activeAccount,
    false,
    submitExtrinsic.proxySupported
  );

  return (
    <JoinFormWrapper>
      <h2>{t('pools.joinPool', { ns: 'pages' })}</h2>
      <h4>
        {t('bond', { ns: 'library' })} {unit}
      </h4>

      <div className="input">
        <div>
          <BondFeedback
            joiningPool
            displayFirstWarningOnly
            syncing={largestTxFee.isZero()}
            bondFor={'pool'}
            listenIsValid={(valid, errors) => {
              setBondValid(valid);
              setFeedbackErrors(errors);
            }}
            defaultBond={null}
            setters={[handleSetBond]}
            parentErrors={warnings}
            txFees={largestTxFee}
          />
        </div>
      </div>

      <h4 className="underline">{t('claimSetting', { ns: 'library' })}</h4>

      <ClaimPermissionInput
        current={claimPermission}
        onChange={(val: ClaimPermission) => {
          setClaimPermission(val);
        }}
      />

      <div className="submit">
        <SubmitTx
          displayFor="card"
          submitText={t('pools.joinPool', { ns: 'pages' })}
          valid={formValid}
          {...submitExtrinsic}
          noMargin
        />
      </div>
    </JoinFormWrapper>
  );
};
