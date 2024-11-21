// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { unitToPlanck } from '@w3ux/utils';
import { getUnixTime } from 'date-fns';
import type { Dispatch, SetStateAction } from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApi } from 'contexts/Api';
import { useActivePool } from 'contexts/Pools/ActivePool';
import { useTransferOptions } from 'contexts/TransferOptions';
import { Warning } from 'library/Form/Warning';
import { useErasToTimeLeft } from 'hooks/useErasToTimeLeft';
import { useSignerWarnings } from 'hooks/useSignerWarnings';
import { timeleftAsString, planckToUnitBn } from 'library/Utils';
import { SubmitTx } from 'library/SubmitTx';
import { StaticNote } from 'modals/Utils/StaticNote';
import { useOverlay } from 'kits/Overlay/Provider';
import { useNetwork } from 'contexts/Network';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { ButtonSubmitInvert } from 'ui-buttons';
import { ModalPadding } from 'kits/Overlay/structure/ModalPadding';
import { ModalWarnings } from 'kits/Overlay/structure/ModalWarnings';
import { ActionItem } from 'library/ActionItem';
import { ApiController } from 'controllers/Api';
import { useSubmitExtrinsic } from 'hooks/useSubmitExtrinsic';

export const LeavePool = ({
  setSection,
}: {
  setSection: Dispatch<SetStateAction<number>>;
}) => {
  const { t } = useTranslation('modals');
  const { consts } = useApi();
  const {
    network,
    networkData: { units, unit },
  } = useNetwork();
  const { erasToSeconds } = useErasToTimeLeft();
  const { activeAccount } = useActiveAccounts();
  const { pendingPoolRewards } = useActivePool();
  const { getSignerWarnings } = useSignerWarnings();
  const { getTransferOptions } = useTransferOptions();
  const { setModalStatus, setModalResize } = useOverlay().modal;

  const allTransferOptions = getTransferOptions(activeAccount);
  const { active: activeBn } = allTransferOptions.pool;
  const { bondDuration } = consts;

  const bondDurationFormatted = timeleftAsString(
    t,
    getUnixTime(new Date()) + 1,
    erasToSeconds(bondDuration),
    true
  );

  const pendingRewardsUnit = planckToUnitBn(pendingPoolRewards, units);

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

  // tx to submit
  const getTx = () => {
    const { pApi } = ApiController.get(network);
    let tx = null;
    if (!pApi || !activeAccount) {
      return tx;
    }

    const bondToSubmit = unitToPlanck(
      !bondValid ? '0' : bond.bond,
      units
    ).toString();

    tx = pApi.tx.NominationPools.unbond({
      member_account: {
        type: 'Id',
        value: activeAccount,
      },
      unbonding_points: BigInt(bondToSubmit),
    });
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

  if (pendingRewardsUnit.isGreaterThan(0)) {
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
        {...submitExtrinsic}
      />
    </>
  );
};
