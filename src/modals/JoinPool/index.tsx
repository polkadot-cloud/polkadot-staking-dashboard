// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { planckToUnit, unitToPlanck } from '@polkadotcloud/utils';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { usePoolMembers } from 'contexts/Pools/PoolMembers';
import { useSetup } from 'contexts/Setup';
import { defaultPoolProgress } from 'contexts/Setup/defaults';
import { useTransferOptions } from 'contexts/TransferOptions';
import { BondFeedback } from 'library/Form/Bond/BondFeedback';
import { useBondGreatestFee } from 'library/Hooks/useBondGreatestFee';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { Close } from 'library/Modal/Close';
import { SubmitTx } from 'library/SubmitTx';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PaddingWrapper } from '../Wrappers';

export const JoinPool = () => {
  const { t } = useTranslation('modals');
  const { api, network } = useApi();
  const { units } = network;
  const { setStatus: setModalStatus, config, setResize } = useModal();
  const { id: poolId, setActiveTab } = config;
  const { activeAccount, accountHasSigner } = useConnect();
  const { queryPoolMember, addToPoolMembers } = usePoolMembers();
  const { setActiveAccountSetup } = useSetup();
  const { getTransferOptions } = useTransferOptions();
  const { totalPossibleBond } = getTransferOptions(activeAccount).pool;
  const largestTxFee = useBondGreatestFee({ bondFor: 'pool' });

  // local bond value
  const [bond, setBond] = useState<{ bond: string }>({
    bond: planckToUnit(totalPossibleBond, units).toString(),
  });

  // bond valid
  const [bondValid, setBondValid] = useState<boolean>(false);

  // modal resize on form update
  useEffect(() => {
    setResize();
  }, [bond]);

  // tx to submit
  const getTx = () => {
    let tx = null;
    if (!bondValid || !api) {
      return tx;
    }

    const bondToSubmit = unitToPlanck(bond.bond, units);
    const bondAsString = bondToSubmit.isNaN() ? '0' : bondToSubmit.toString();
    tx = api.tx.nominationPools.join(bondAsString, poolId);
    return tx;
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

  const errors = [];
  if (!accountHasSigner(activeAccount)) {
    errors.push(t('readOnlyCannotSign'));
  }
  return (
    <>
      <Close />
      <PaddingWrapper>
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
          parentErrors={errors}
          txFees={largestTxFee}
        />
      </PaddingWrapper>
      <SubmitTx valid={bondValid} {...submitExtrinsic} />
    </>
  );
};
