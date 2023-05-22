// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ModalPadding } from '@polkadotcloud/core-ui';
import { planckToUnit, unitToPlanck } from '@polkadotcloud/utils';
import BigNumber from 'bignumber.js';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { usePoolMembers } from 'contexts/Pools/PoolMembers';
import type { ClaimPermission } from 'contexts/Pools/types';
import { useSetup } from 'contexts/Setup';
import { defaultPoolProgress } from 'contexts/Setup/defaults';
import { useTransferOptions } from 'contexts/TransferOptions';
import { useTxMeta } from 'contexts/TxMeta';
import { BondFeedback } from 'library/Form/Bond/BondFeedback';
import { ClaimPermissionInput } from 'library/Form/ClaimPermissionInput';
import { useBondGreatestFee } from 'library/Hooks/useBondGreatestFee';
import { useSignerWarnings } from 'library/Hooks/useSignerWarnings';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { Close } from 'library/Modal/Close';
import { SubmitTx } from 'library/SubmitTx';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export const JoinPool = () => {
  const { t } = useTranslation('modals');
  const { api, network } = useApi();
  const { units } = network;
  const { setStatus: setModalStatus, config, setResize } = useModal();
  const { id: poolId, setActiveTab } = config;
  const { activeAccount } = useConnect();
  const { queryPoolMember, addToPoolMembers } = usePoolMembers();
  const { setActiveAccountSetup } = useSetup();
  const { getTransferOptions } = useTransferOptions();
  const { getSignerWarnings } = useSignerWarnings();
  const { txFees } = useTxMeta();

  const { totalPossibleBond, totalAdditionalBond } =
    getTransferOptions(activeAccount).pool;

  const largestTxFee = useBondGreatestFee({ bondFor: 'pool' });

  // if we are bonding, subtract tx fees from bond amount
  const freeBondAmount = BigNumber.max(totalAdditionalBond.minus(txFees), 0);

  // local bond value
  const [bond, setBond] = useState<{ bond: string }>({
    bond: planckToUnit(totalPossibleBond, units).toFixed(),
  });

  // Updated claim permission value
  const [claimPermission, setClaimPermission] = useState<
    ClaimPermission | undefined
  >('Permissioned');

  // bond valid
  const [bondValid, setBondValid] = useState<boolean>(false);

  // modal resize on form update
  useEffect(() => {
    setResize();
  }, [bond]);

  // tx to submit
  const getTx = () => {
    const tx = null;
    if (!api) {
      return tx;
    }

    const bondToSubmit = unitToPlanck(!bondValid ? '0' : bond.bond, units);
    const bondAsString = bondToSubmit.isNaN() ? '0' : bondToSubmit.toFixed();
    const txs = [api.tx.nominationPools.join(bondAsString, poolId)];

    if (
      ![undefined, 'Permissioned'].includes(claimPermission) &&
      network.name === 'westend'
    ) {
      txs.push(api.tx.nominationPools.setClaimPermission(claimPermission));
    }

    if (txs.length === 1) {
      return txs[0];
    }

    return api.tx.utility.batch(txs);
  };

  const submitExtrinsic = useSubmitExtrinsic({
    tx: getTx(),
    from: activeAccount,
    shouldSubmit: bondValid,
    callbackSubmit: () => {
      setModalStatus(2);
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
          bondFor="pool"
          listenIsValid={setBondValid}
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
        {network.name === 'westend' && (
          <ClaimPermissionInput
            current={undefined}
            permissioned={false}
            onChange={(val: ClaimPermission | undefined) => {
              setClaimPermission(val);
            }}
            disabled={freeBondAmount.isZero()}
          />
        )}
      </ModalPadding>
      <SubmitTx valid={bondValid} {...submitExtrinsic} />
    </>
  );
};
