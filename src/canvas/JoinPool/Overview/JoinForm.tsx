// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { planckToUnit, unitToPlanck } from '@w3ux/utils';
import type BigNumber from 'bignumber.js';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { useNetwork } from 'contexts/Network';
import type { ClaimPermission } from 'contexts/Pools/types';
import { useTransferOptions } from 'contexts/TransferOptions';
import { useState } from 'react';
import { JoinFormWrapper } from '../Wrappers';
import { ClaimPermissionInput } from 'library/Form/ClaimPermissionInput';
import { BondFeedback } from 'library/Form/Bond/BondFeedback';
import { useBondGreatestFee } from 'hooks/useBondGreatestFee';
import { useApi } from 'contexts/Api';
import { useBatchCall } from 'hooks/useBatchCall';
import { useSubmitExtrinsic } from 'hooks/useSubmitExtrinsic';
import { useOverlay } from 'kits/Overlay/Provider';
import { useSetup } from 'contexts/Setup';
import { usePoolMembers } from 'contexts/Pools/PoolMembers';
import { defaultPoolProgress } from 'contexts/Setup/defaults';
import { useSignerWarnings } from 'hooks/useSignerWarnings';
import { SubmitTx } from 'library/SubmitTx';
import type { OverviewSectionProps } from '../types';
import { defaultClaimPermission } from 'controllers/ActivePools/defaults';
import { useTranslation } from 'react-i18next';

export const JoinForm = ({ bondedPool }: OverviewSectionProps) => {
  const { t } = useTranslation();
  const { api } = useApi();
  const {
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
  const { queryPoolMember, addToPoolMembers } = usePoolMembers();

  const {
    pool: { totalPossibleBond },
  } = getTransferOptions(activeAccount);

  // Pool claim permission value.
  const [claimPermission, setClaimPermission] = useState<ClaimPermission>(
    defaultClaimPermission
  );

  // Bond amount to join pool with.
  const [bond, setBond] = useState<{ bond: string }>({
    bond: planckToUnit(totalPossibleBond, units).toString(),
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
    const tx = null;
    if (!api || !claimPermission || !formValid) {
      return tx;
    }

    const bondToSubmit = unitToPlanck(!bondValid ? '0' : bond.bond, units);
    const bondAsString = bondToSubmit.isNaN() ? '0' : bondToSubmit.toString();
    const txs = [api.tx.nominationPools.join(bondAsString, bondedPool.id)];

    // If claim permission is not the default, add it to tx.
    if (claimPermission !== defaultClaimPermission) {
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
      closeCanvas();

      // Optional callback function on join success.
      const onJoinCallback = options?.onJoinCallback;

      if (typeof onJoinCallback === 'function') {
        onJoinCallback();
      }
    },
    callbackInBlock: async () => {
      // Query and add account to poolMembers list
      const member = await queryPoolMember(activeAccount);
      if (member) {
        addToPoolMembers(member);
      }

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
