// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ActionItem } from '@polkadotcloud/core-ui';
import { greaterThanZero, planckToUnit } from '@polkadotcloud/utils';
import BigNumber from 'bignumber.js';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { Warning } from 'library/Form/Warning';
import { useSignerWarnings } from 'library/Hooks/useSignerWarnings';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { Close } from 'library/Modal/Close';
import { SubmitTx } from 'library/SubmitTx';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PaddingWrapper, WarningsWrapper } from '../Wrappers';

export const ClaimReward = () => {
  const { t } = useTranslation('modals');
  const { api, network } = useApi();
  const { activeAccount } = useConnect();
  const { setStatus: setModalStatus, config } = useModal();
  const { selectedActivePool } = useActivePools();
  const { getSignerWarnings } = useSignerWarnings();

  const { units, unit } = network;
  let { pendingRewards } = selectedActivePool || {};
  pendingRewards = pendingRewards ?? new BigNumber(0);
  const { claimType } = config;

  // ensure selected payout is valid
  useEffect(() => {
    if (pendingRewards?.isGreaterThan(0)) {
      setValid(true);
    } else {
      setValid(false);
    }
  }, [selectedActivePool]);

  // valid to submit transaction
  const [valid, setValid] = useState<boolean>(false);

  // tx to submit
  const getTx = () => {
    let tx = null;
    if (!api) {
      return tx;
    }

    if (claimType === 'bond') {
      tx = api.tx.nominationPools.bondExtra('Rewards');
    } else {
      tx = api.tx.nominationPools.claimPayout();
    }
    return tx;
  };

  const submitExtrinsic = useSubmitExtrinsic({
    tx: getTx(),
    from: activeAccount,
    shouldSubmit: valid,
    callbackSubmit: () => {
      setModalStatus(2);
    },
    callbackInBlock: () => {},
  });

  const warnings = getSignerWarnings(
    activeAccount,
    false,
    submitExtrinsic.proxySupported
  );

  if (!greaterThanZero(pendingRewards)) {
    warnings.push(`${t('noRewards')}`);
  }

  return (
    <>
      <Close />
      <PaddingWrapper>
        <h2 className="title unbounded">
          {claimType === 'bond' ? t('compound') : t('withdraw')} {t('rewards')}
        </h2>
        {warnings.length > 0 ? (
          <WarningsWrapper>
            {warnings.map((text, i) => (
              <Warning key={`warning${i}`} text={text} />
            ))}
          </WarningsWrapper>
        ) : null}
        <ActionItem
          text={`${t('claim')} ${`${planckToUnit(
            pendingRewards,
            units
          )} ${unit}`}`}
        />
        {claimType === 'bond' ? (
          <p>{t('claimReward1')}</p>
        ) : (
          <p>{t('claimReward2')}</p>
        )}
      </PaddingWrapper>
      <SubmitTx valid={valid} {...submitExtrinsic} />
    </>
  );
};
