// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { planckToUnit, unitToPlanck } from '@w3ux/utils';
import { PoolUnbond } from 'api/tx/poolUnbond';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { useApi } from 'contexts/Api';
import { useNetwork } from 'contexts/Network';
import { useActivePool } from 'contexts/Pools/ActivePool';
import { useTransferOptions } from 'contexts/TransferOptions';
import { getUnixTime } from 'date-fns';
import { useErasToTimeLeft } from 'hooks/useErasToTimeLeft';
import { useSignerWarnings } from 'hooks/useSignerWarnings';
import { useSubmitExtrinsic } from 'hooks/useSubmitExtrinsic';
import { useOverlay } from 'kits/Overlay/Provider';
import { ModalPadding } from 'kits/Overlay/structure/ModalPadding';
import { ModalWarnings } from 'kits/Overlay/structure/ModalWarnings';
import { ActionItem } from 'library/ActionItem';
import { Warning } from 'library/Form/Warning';
import { SubmitTx } from 'library/SubmitTx';
import { StaticNote } from 'modals/Utils/StaticNote';
import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { ButtonSubmitInvert } from 'ui-buttons';
import { planckToUnitBn, timeleftAsString } from 'utils';

export const LeavePool = ({
  setSection,
  onResize,
}: {
  setSection: Dispatch<SetStateAction<number>>;
  onResize: () => void;
}) => {
  const { t } = useTranslation('modals');
  const { consts } = useApi();
  const {
    network,
    networkData: { units, unit },
  } = useNetwork();
  const { activePool } = useActivePool();
  const { erasToSeconds } = useErasToTimeLeft();
  const { activeAccount } = useActiveAccounts();
  const { getSignerWarnings } = useSignerWarnings();
  const { getTransferOptions } = useTransferOptions();
  const { setModalStatus, setModalResize } = useOverlay().modal;

  const allTransferOptions = getTransferOptions(activeAccount);
  const { active: activeBn } = allTransferOptions.pool;
  const { bondDuration } = consts;
  const pendingRewards = activePool?.pendingRewards || 0n;

  const bondDurationFormatted = timeleftAsString(
    t,
    getUnixTime(new Date()) + 1,
    erasToSeconds(bondDuration),
    true
  );

  const pendingRewardsUnit = planckToUnit(pendingRewards, units);

  // convert BigNumber values to number
  const freeToUnbond = planckToUnitBn(activeBn, units);

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
  useEffect(() => setModalResize(), [bond]);

  const getTx = () => {
    let tx = null;
    if (!activeAccount) {
      return tx;
    }
    tx = new PoolUnbond(
      network,
      activeAccount,
      unitToPlanck(!bondValid ? 0 : bond.bond, units)
    ).tx();
    return tx;
  };

  const submitExtrinsic = useSubmitExtrinsic({
    tx: getTx(),
    from: activeAccount,
    shouldSubmit: bondValid,
    callbackSubmit: () => {
      setModalStatus('closing');
    },
  });

  const warnings = getSignerWarnings(
    activeAccount,
    false,
    submitExtrinsic.proxySupported
  );

  if (pendingRewards > 0) {
    warnings.push(
      `${t('unbondingWithdraw')} ${pendingRewardsUnit.toString()} ${unit}.`
    );
  }

  return (
    <>
      <ModalPadding horizontalOnly>
        {warnings.length > 0 ? (
          <ModalWarnings withMargin>
            {warnings.map((text, i) => (
              <Warning key={`warning${i}`} text={text} />
            ))}
          </ModalWarnings>
        ) : null}
        <ActionItem text={`${t('unbond')} ${freeToUnbond} ${unit}`} />
        <StaticNote
          value={bondDurationFormatted}
          tKey="onceUnbonding"
          valueKey="bondDurationFormatted"
          deps={[bondDuration]}
        />
      </ModalPadding>
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
        onResize={onResize}
        {...submitExtrinsic}
      />
    </>
  );
};
