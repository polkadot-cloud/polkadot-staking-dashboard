// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faArrowAltCircleUp } from '@fortawesome/free-regular-svg-icons';
import { ButtonSubmit } from '@polkadotcloud/dashboard-ui';
import BigNumber from 'bignumber.js';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { useTxFees } from 'contexts/TxFees';
import { Warning } from 'library/Form/Warning';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { Action } from 'library/Modal/Action';
import { Close } from 'library/Modal/Close';
import { SubmitTx } from 'library/SubmitTx';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { greaterThanZero, planckToUnit } from 'Utils';
import { PaddingWrapper, WarningsWrapper } from '../Wrappers';

export const ClaimReward = () => {
  const { t } = useTranslation('modals');
  const { api, network } = useApi();
  const { setStatus: setModalStatus, config } = useModal();
  const { selectedActivePool } = useActivePools();
  const { activeAccount, accountHasSigner } = useConnect();
  const { txFeesValid } = useTxFees();
  const { units, unit } = network;
  let { unclaimedRewards } = selectedActivePool || {};
  unclaimedRewards = unclaimedRewards ?? new BigNumber(0);
  const { claimType } = config;

  // ensure selected payout is valid
  useEffect(() => {
    if (unclaimedRewards?.isGreaterThan(0)) {
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

  const { submitTx, submitting } = useSubmitExtrinsic({
    tx: getTx(),
    from: activeAccount,
    shouldSubmit: valid,
    callbackSubmit: () => {
      setModalStatus(2);
    },
    callbackInBlock: () => {},
  });

  const warnings = [];
  if (!accountHasSigner(activeAccount)) {
    warnings.push(<Warning text={t('readOnly')} />);
  }
  if (!greaterThanZero(unclaimedRewards)) {
    warnings.push(<Warning text={t('noRewards')} />);
  }

  return (
    <>
      <Close />
      <PaddingWrapper>
        <h2 className="title unbounded">
          {claimType === 'bond' ? t('bond') : t('withdraw')} {t('rewards')}
        </h2>
        {warnings.length ? (
          <WarningsWrapper>
            {warnings.map((warning: React.ReactNode, index: number) => (
              <React.Fragment key={`warning_${index}`}>
                {warning}
              </React.Fragment>
            ))}
          </WarningsWrapper>
        ) : null}
        <Action
          text={`${t('claim')} ${`${planckToUnit(
            unclaimedRewards,
            units
          )} ${unit}`}`}
        />
        {claimType === 'bond' ? (
          <p>{t('claimReward1')}</p>
        ) : (
          <p>{t('claimReward2')}</p>
        )}
      </PaddingWrapper>
      <SubmitTx
        buttons={[
          <ButtonSubmit
            key="button_submit"
            text={`${submitting ? t('submitting') : t('submit')}`}
            iconLeft={faArrowAltCircleUp}
            iconTransform="grow-2"
            onClick={() => submitTx()}
            disabled={
              !valid ||
              submitting ||
              !accountHasSigner(activeAccount) ||
              !txFeesValid
            }
          />,
        ]}
      />
    </>
  );
};
