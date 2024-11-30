// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Polkicon } from '@w3ux/react-polkicon';
import { ellipsisFn, rmCommas, unitToPlanck } from '@w3ux/utils';
import { PoolUnbond } from 'api/tx/poolUnbond';
import BigNumber from 'bignumber.js';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { useApi } from 'contexts/Api';
import { useNetwork } from 'contexts/Network';
import type { PoolMembership } from 'contexts/Pools/types';
import { usePrompt } from 'contexts/Prompt';
import { getUnixTime } from 'date-fns';
import { useErasToTimeLeft } from 'hooks/useErasToTimeLeft';
import { useSignerWarnings } from 'hooks/useSignerWarnings';
import { useSubmitExtrinsic } from 'hooks/useSubmitExtrinsic';
import { ModalNotes } from 'kits/Overlay/structure/ModalNotes';
import { ModalPadding } from 'kits/Overlay/structure/ModalPadding';
import { ModalWarnings } from 'kits/Overlay/structure/ModalWarnings';
import { Warning } from 'library/Form/Warning';
import { Title } from 'library/Prompt/Title';
import { SubmitTx } from 'library/SubmitTx';
import { StaticNote } from 'modals/Utils/StaticNote';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { planckToUnitBn, timeleftAsString } from 'utils';

export const UnbondMember = ({
  who,
  member,
}: {
  who: string;
  member: PoolMembership;
}) => {
  const { t } = useTranslation('modals');
  const { consts } = useApi();
  const {
    network,
    networkData: { units, unit },
  } = useNetwork();
  const { closePrompt } = usePrompt();
  const { activeAccount } = useActiveAccounts();
  const { erasToSeconds } = useErasToTimeLeft();
  const { getSignerWarnings } = useSignerWarnings();

  const { bondDuration } = consts;
  const { points } = member;
  const freeToUnbond = planckToUnitBn(new BigNumber(rmCommas(points)), units);

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
  const [bondValid, setBondValid] = useState<boolean>(false);

  // unbond all validation
  const isValid = (() => freeToUnbond.isGreaterThan(0))();

  // update bond value on task change
  useEffect(() => {
    setBond({ bond: freeToUnbond.toString() });
    setBondValid(isValid);
  }, [freeToUnbond.toString(), isValid]);

  const getTx = () => {
    let tx = null;
    if (!activeAccount) {
      return tx;
    }
    tx = new PoolUnbond(
      network,
      who,
      unitToPlanck(!bondValid ? 0 : bond.bond, units)
    );
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
      <Title title={t('unbondPoolMember')} />
      <ModalPadding>
        {warnings.length > 0 ? (
          <ModalWarnings withMargin>
            {warnings.map((text, i) => (
              <Warning key={`warning${i}`} text={text} />
            ))}
          </ModalWarnings>
        ) : null}
        <h3 style={{ display: 'flex', alignItems: 'center' }}>
          <Polkicon address={who} transform="grow-3" />
          &nbsp; {ellipsisFn(who, 7)}
        </h3>
        <ModalNotes>
          <p>{t('amountWillBeUnbonded', { bond: bond.bond, unit })}</p>
          <StaticNote
            value={bondDurationFormatted}
            tKey="onceUnbondingPoolMember"
            valueKey="bondDurationFormatted"
            deps={[bondDuration]}
          />
        </ModalNotes>
      </ModalPadding>
      <SubmitTx noMargin valid={bondValid} {...submitExtrinsic} />
    </>
  );
};
