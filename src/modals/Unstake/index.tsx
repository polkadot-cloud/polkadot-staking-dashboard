// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { unitToPlanck } from '@w3ux/utils';
import { getUnixTime } from 'date-fns';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApi } from 'contexts/Api';
import { useBonded } from 'contexts/Bonded';
import { useTransferOptions } from 'contexts/TransferOptions';
import { Warning } from 'library/Form/Warning';
import { useBatchCall } from 'hooks/useBatchCall';
import { useErasToTimeLeft } from 'hooks/useErasToTimeLeft';
import { useSignerWarnings } from 'hooks/useSignerWarnings';
import { useSubmitExtrinsic } from 'hooks/useSubmitExtrinsic';
import { timeleftAsString } from 'hooks/useTimeLeft/utils';
import { Close } from 'library/Modal/Close';
import { SubmitTx } from 'library/SubmitTx';
import { StaticNote } from 'modals/Utils/StaticNote';
import { useTxMeta } from 'contexts/TxMeta';
import { useOverlay } from 'kits/Overlay/Provider';
import { useNetwork } from 'contexts/Network';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { useBalances } from 'contexts/Balances';
import { ModalPadding } from 'kits/Overlay/structure/ModalPadding';
import { ModalWarnings } from 'kits/Overlay/structure/ModalWarnings';
import { ActionItem } from 'library/ActionItem';
import { planckToUnitBn } from 'Utils';

export const Unstake = () => {
  const { t } = useTranslation('modals');
  const {
    networkData: { units, unit },
  } = useNetwork();
  const { api, consts } = useApi();
  const { notEnoughFunds } = useTxMeta();
  const { newBatchCall } = useBatchCall();
  const { getBondedAccount } = useBonded();
  const { getNominations } = useBalances();
  const { activeAccount } = useActiveAccounts();
  const { erasToSeconds } = useErasToTimeLeft();
  const { getSignerWarnings } = useSignerWarnings();
  const { getTransferOptions } = useTransferOptions();
  const { setModalStatus, setModalResize } = useOverlay().modal;

  const controller = getBondedAccount(activeAccount);
  const nominations = getNominations(activeAccount);
  const { bondDuration } = consts;
  const allTransferOptions = getTransferOptions(activeAccount);
  const { active } = allTransferOptions.nominate;

  const bondDurationFormatted = timeleftAsString(
    t,
    getUnixTime(new Date()) + 1,
    erasToSeconds(bondDuration),
    true
  );

  // convert BigNumber values to number
  const freeToUnbond = planckToUnitBn(active, units);

  // local bond value
  const [bond, setBond] = useState<{ bond: string }>({
    bond: freeToUnbond.toString(),
  });

  // bond valid
  const [bondValid, setBondValid] = useState<boolean>(false);

  // unbond all validation
  const isValid = (() => freeToUnbond.isGreaterThan(0))();

  // update bond value on task change
  useEffect(() => {
    setBond({ bond: freeToUnbond.toString() });
    setBondValid(isValid);
  }, [freeToUnbond.toString(), isValid]);

  // modal resize on form update
  useEffect(() => setModalResize(), [bond, notEnoughFunds]);

  // tx to submit
  const getTx = () => {
    const tx = null;
    if (!api || !activeAccount) {
      return tx;
    }
    // remove decimal errors
    const bondToSubmit = unitToPlanck(
      String(!bondValid ? '0' : bond.bond),
      units
    );

    if (bondToSubmit == 0n) {
      return api.tx.staking.chill();
    }

    const txs = [
      api.tx.staking.chill(),
      api.tx.staking.unbond(bondToSubmit.toString()),
    ];
    return newBatchCall(txs, controller);
  };

  const submitExtrinsic = useSubmitExtrinsic({
    tx: getTx(),
    from: controller,
    shouldSubmit: bondValid,
    callbackSubmit: () => {
      setModalStatus('closing');
    },
  });

  const warnings = getSignerWarnings(
    activeAccount,
    true,
    submitExtrinsic.proxySupported
  );

  return (
    <>
      <Close />
      <ModalPadding>
        <h2 className="title unbounded">{t('unstake')} </h2>
        {warnings.length > 0 ? (
          <ModalWarnings withMargin>
            {warnings.map((text, i) => (
              <Warning key={`warning${i}`} text={text} />
            ))}
          </ModalWarnings>
        ) : null}
        {freeToUnbond.isGreaterThan(0) ? (
          <ActionItem
            text={t('unstakeUnbond', {
              bond: freeToUnbond.toFormat(),
              unit,
            })}
          />
        ) : null}
        {nominations.length > 0 && (
          <ActionItem
            text={t('unstakeStopNominating', { count: nominations.length })}
          />
        )}
        <StaticNote
          value={bondDurationFormatted}
          tKey="onceUnbonding"
          valueKey="bondDurationFormatted"
          deps={[bondDuration]}
        />
      </ModalPadding>
      <SubmitTx fromController valid={bondValid} {...submitExtrinsic} />
    </>
  );
};
