// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { planckToUnit } from '@w3ux/utils';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { useNetwork } from 'contexts/Network';
import { useActivePool } from 'contexts/Pools/ActivePool';
import { useTxMeta } from 'contexts/TxMeta';
import { Apis } from 'controllers/Apis';
import { useSignerWarnings } from 'hooks/useSignerWarnings';
import { useSubmitExtrinsic } from 'hooks/useSubmitExtrinsic';
import { useOverlay } from 'kits/Overlay/Provider';
import { ModalPadding } from 'kits/Overlay/structure/ModalPadding';
import { ModalWarnings } from 'kits/Overlay/structure/ModalWarnings';
import { ActionItem } from 'library/ActionItem';
import { Warning } from 'library/Form/Warning';
import { Close } from 'library/Modal/Close';
import { SubmitTx } from 'library/SubmitTx';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export const ClaimReward = () => {
  const { t } = useTranslation('modals');
  const {
    network,
    networkData: { units, unit },
  } = useNetwork();
  const {
    setModalStatus,
    config: { options },
    setModalResize,
  } = useOverlay().modal;
  const { notEnoughFunds } = useTxMeta();
  const { activeAccount } = useActiveAccounts();
  const { getSignerWarnings } = useSignerWarnings();
  const { activePool, pendingPoolRewards } = useActivePool();
  const { claimType } = options;

  // ensure selected payout is valid
  useEffect(() => {
    if (pendingPoolRewards?.isGreaterThan(0)) {
      setValid(true);
    } else {
      setValid(false);
    }
  }, [activePool]);

  // valid to submit transaction
  const [valid, setValid] = useState<boolean>(false);

  // tx to submit
  const getTx = () => {
    const api = Apis.getApi(network);
    let tx = null;
    if (!api) {
      return tx;
    }

    if (claimType === 'bond') {
      tx = api.tx.NominationPools.bond_extra({
        extra: { type: 'Rewards', value: undefined },
      });
    } else {
      tx = api.tx.NominationPools.claim_payout();
    }
    return tx;
  };

  const submitExtrinsic = useSubmitExtrinsic({
    tx: getTx(),
    from: activeAccount,
    shouldSubmit: valid,
    callbackSubmit: () => {
      setModalStatus('closing');
    },
  });

  const warnings = getSignerWarnings(
    activeAccount,
    false,
    submitExtrinsic.proxySupported
  );

  if (!pendingPoolRewards.isGreaterThan(0)) {
    warnings.push(`${t('noRewards')}`);
  }

  useEffect(() => setModalResize(), [notEnoughFunds, warnings.length]);

  return (
    <>
      <Close />
      <ModalPadding>
        <h2 className="title unbounded">
          {claimType === 'bond' ? t('compound') : t('withdraw')} {t('rewards')}
        </h2>
        {warnings.length > 0 ? (
          <ModalWarnings withMargin>
            {warnings.map((text, i) => (
              <Warning key={`warning${i}`} text={text} />
            ))}
          </ModalWarnings>
        ) : null}
        <ActionItem
          text={`${t('claim')} ${`${planckToUnit(
            pendingPoolRewards.toString(),
            units
          )} ${unit}`}`}
        />
        {claimType === 'bond' ? (
          <p>{t('claimReward1')}</p>
        ) : (
          <p>{t('claimReward2')}</p>
        )}
      </ModalPadding>
      <SubmitTx valid={valid} {...submitExtrinsic} />
    </>
  );
};
