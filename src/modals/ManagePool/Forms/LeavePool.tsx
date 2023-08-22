// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import {
  ActionItem,
  ButtonSubmitInvert,
  ModalWarnings,
} from '@polkadot-cloud/react';
import {
  greaterThanZero,
  planckToUnit,
  unitToPlanck,
} from '@polkadot-cloud/utils';
import BigNumber from 'bignumber.js';
import { getUnixTime } from 'date-fns';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { useTransferOptions } from 'contexts/TransferOptions';
import { Warning } from 'library/Form/Warning';
import { useErasToTimeLeft } from 'library/Hooks/useErasToTimeLeft';
import { useSignerWarnings } from 'library/Hooks/useSignerWarnings';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { timeleftAsString } from 'library/Hooks/useTimeLeft/utils';
import { SubmitTx } from 'library/SubmitTx';
import { StaticNote } from 'modals/Utils/StaticNote';
import { useOverlay } from 'contexts/Overlay';

export const LeavePool = ({ setSection }: any) => {
  const { t } = useTranslation('modals');
  const { api, network, consts } = useApi();
  const { activeAccount } = useConnect();
  const { units } = network;
  const { setModalStatus, setModalResize } = useOverlay().modal;
  const { getTransferOptions } = useTransferOptions();
  const { selectedActivePool } = useActivePools();
  const { erasToSeconds } = useErasToTimeLeft();
  const { getSignerWarnings } = useSignerWarnings();

  const allTransferOptions = getTransferOptions(activeAccount);
  const { active: activeBn } = allTransferOptions.pool;
  const { bondDuration } = consts;

  const bondDurationFormatted = timeleftAsString(
    t,
    getUnixTime(new Date()) + 1,
    erasToSeconds(bondDuration),
    true
  );

  let { pendingRewards } = selectedActivePool || {};
  pendingRewards = pendingRewards ?? new BigNumber(0);
  pendingRewards = planckToUnit(pendingRewards, network.units);

  // convert BigNumber values to number
  const freeToUnbond = planckToUnit(activeBn, units);

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
  useEffect(() => setModalResize(), [bond]);

  // tx to submit
  const getTx = () => {
    let tx = null;
    if (!api || !activeAccount) {
      return tx;
    }

    const bondToSubmit = unitToPlanck(!bondValid ? '0' : bond.bond, units);
    const bondAsString = bondToSubmit.isNaN() ? '0' : bondToSubmit.toString();
    tx = api.tx.nominationPools.unbond(activeAccount, bondAsString);
    return tx;
  };

  const submitExtrinsic = useSubmitExtrinsic({
    tx: getTx(),
    from: activeAccount,
    shouldSubmit: bondValid,
    callbackSubmit: () => {
      setModalStatus('closing');
    },
    callbackInBlock: () => {},
  });

  const warnings = getSignerWarnings(
    activeAccount,
    false,
    submitExtrinsic.proxySupported
  );

  if (greaterThanZero(pendingRewards)) {
    warnings.push(
      `${t('unbondingWithdraw')} ${pendingRewards.toString()} ${network.unit}.`
    );
  }

  return (
    <>
      <div className="padding">
        {warnings.length > 0 ? (
          <ModalWarnings withMargin>
            {warnings.map((text, i) => (
              <Warning key={`warning${i}`} text={text} />
            ))}
          </ModalWarnings>
        ) : null}
        <ActionItem text={`${t('unbond')} ${freeToUnbond} ${network.unit}`} />
        <StaticNote
          value={bondDurationFormatted}
          tKey="onceUnbonding"
          valueKey="bondDurationFormatted"
          deps={[bondDuration]}
        />
      </div>
      <SubmitTx
        valid={bondValid}
        buttons={[
          <ButtonSubmitInvert
            key="button_back"
            text={t('back')}
            iconLeft={faChevronLeft}
            iconTransform="shrink-1"
            onClick={() => setSection(0)}
          />,
        ]}
        {...submitExtrinsic}
      />
    </>
  );
};
