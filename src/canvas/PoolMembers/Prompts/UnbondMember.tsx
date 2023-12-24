// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ActionItem, ModalPadding, ModalWarnings } from '@polkadot-cloud/react';
import {
  greaterThanZero,
  planckToUnit,
  rmCommas,
  unitToPlanck,
} from '@polkadot-cloud/utils';
import BigNumber from 'bignumber.js';
import { getUnixTime } from 'date-fns';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApi } from 'contexts/Api';
import { Warning } from 'library/Form/Warning';
import { useErasToTimeLeft } from 'library/Hooks/useErasToTimeLeft';
import { useSignerWarnings } from 'library/Hooks/useSignerWarnings';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { timeleftAsString } from 'library/Hooks/useTimeLeft/utils';
import { SubmitTx } from 'library/SubmitTx';
import { StaticNote } from 'modals/Utils/StaticNote';
import { useNetwork } from 'contexts/Network';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { usePrompt } from 'contexts/Prompt';
import type { PoolMembership } from 'contexts/Pools/PoolMemberships/types';
import { CloseWrapper } from 'library/Modal/Wrappers';
import CrossSVG from 'img/cross.svg?react';

export const UnbondMember = ({
  who,
  member,
}: {
  who: string;
  member: PoolMembership;
}) => {
  const { t } = useTranslation('modals');
  const { api, consts } = useApi();
  const {
    networkData: { units, unit },
  } = useNetwork();
  const { closePrompt } = usePrompt();
  const { activeAccount } = useActiveAccounts();
  const { erasToSeconds } = useErasToTimeLeft();
  const { getSignerWarnings } = useSignerWarnings();

  const { bondDuration } = consts;
  const { points } = member;
  const freeToUnbond = planckToUnit(new BigNumber(rmCommas(points)), units);

  const bondDurationFormatted = timeleftAsString(
    t,
    getUnixTime(new Date()) + 1,
    erasToSeconds(bondDuration),
    true
  );

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

  // tx to submit
  const getTx = () => {
    let tx = null;
    if (!api || !activeAccount) {
      return tx;
    }
    // remove decimal errors
    const bondToSubmit = unitToPlanck(!bondValid ? '0' : bond.bond, units);
    const bondAsString = bondToSubmit.isNaN() ? '0' : bondToSubmit.toString();
    tx = api.tx.nominationPools.unbond(who, bondAsString);
    return tx;
  };

  const submitExtrinsic = useSubmitExtrinsic({
    tx: getTx(),
    from: activeAccount,
    shouldSubmit: bondValid,
    callbackSubmit: () => {
      closePrompt();
    },
  });

  const warnings = getSignerWarnings(
    activeAccount,
    false,
    submitExtrinsic.proxySupported
  );

  return (
    <>
      <CloseWrapper>
        <button type="button" onClick={() => closePrompt()}>
          <CrossSVG style={{ width: '1.25rem', height: '1.25rem' }} />
        </button>
      </CloseWrapper>
      <ModalPadding>
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
      <SubmitTx valid={bondValid} {...submitExtrinsic} />
    </>
  );
};
