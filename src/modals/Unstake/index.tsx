// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ActionItem, ModalPadding, ModalWarnings } from '@polkadot-cloud/react';
import {
  greaterThanZero,
  planckToUnit,
  unitToPlanck,
} from '@polkadot-cloud/utils';
import { getUnixTime } from 'date-fns';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApi } from 'contexts/Api';
import { useBonded } from 'contexts/Bonded';
import { useTransferOptions } from 'contexts/TransferOptions';
import { Warning } from 'library/Form/Warning';
import { useBatchCall } from 'library/Hooks/useBatchCall';
import { useErasToTimeLeft } from 'library/Hooks/useErasToTimeLeft';
import { useSignerWarnings } from 'library/Hooks/useSignerWarnings';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { timeleftAsString } from 'library/Hooks/useTimeLeft/utils';
import { Close } from 'library/Modal/Close';
import { SubmitTx } from 'library/SubmitTx';
import { StaticNote } from 'modals/Utils/StaticNote';
import { useTxMeta } from 'contexts/TxMeta';
import { useOverlay } from '@polkadot-cloud/react/hooks';
import { useNetwork } from 'contexts/Network';
import { useActiveAccounts } from 'contexts/ActiveAccounts';

export const Unstake = () => {
  const { t } = useTranslation('modals');
  const { newBatchCall } = useBatchCall();
  const { notEnoughFunds } = useTxMeta();
  const { activeAccount } = useActiveAccounts();
  const { api, consts } = useApi();
  const {
    networkData: { units, unit },
  } = useNetwork();
  const { erasToSeconds } = useErasToTimeLeft();
  const { getSignerWarnings } = useSignerWarnings();
  const { getTransferOptions } = useTransferOptions();
  const { setModalStatus, setModalResize } = useOverlay().modal;
  const { getBondedAccount, getAccountNominations } = useBonded();

  const controller = getBondedAccount(activeAccount);
  const nominations = getAccountNominations(activeAccount);
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
  const freeToUnbond = planckToUnit(active, units);

  // local bond value
  const [bond, setBond] = useState<{ bond: string }>({
    bond: freeToUnbond.toString(),
  });

  // bond valid
  const [bondValid, setBondValid] = useState(false);

  // unbond all validation
  const isValid = (() => greaterThanZero(freeToUnbond))();

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
    const bondAsString = bondToSubmit.isNaN() ? '0' : bondToSubmit.toString();

    if (!bondAsString) {
      return api.tx.staking.chill();
    }
    const txs = [api.tx.staking.chill(), api.tx.staking.unbond(bondAsString)];
    return newBatchCall(txs, controller);
  };

  const submitExtrinsic = useSubmitExtrinsic({
    tx: getTx(),
    from: controller,
    shouldSubmit: bondValid,
    callbackSubmit: () => {
      setModalStatus('closing');
    },
    callbackInBlock: () => {},
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
        {greaterThanZero(freeToUnbond) ? (
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
