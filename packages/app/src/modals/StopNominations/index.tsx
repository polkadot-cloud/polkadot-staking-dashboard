// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { PoolChill } from 'api/tx/poolChill';
import { StakingChill } from 'api/tx/stakingChill';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { useBalances } from 'contexts/Balances';
import { useBonded } from 'contexts/Bonded';
import { useNetwork } from 'contexts/Network';
import { useActivePool } from 'contexts/Pools/ActivePool';
import { useTxMeta } from 'contexts/TxMeta';
import { useSignerWarnings } from 'hooks/useSignerWarnings';
import { useSubmitExtrinsic } from 'hooks/useSubmitExtrinsic';
import { useOverlay } from 'kits/Overlay/Provider';
import { ModalPadding } from 'kits/Overlay/structure/ModalPadding';
import { ModalSeparator } from 'kits/Overlay/structure/ModalSeparator';
import { ModalWarnings } from 'kits/Overlay/structure/ModalWarnings';
import { Warning } from 'library/Form/Warning';
import { Close } from 'library/Modal/Close';
import { SubmitTx } from 'library/SubmitTx';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export const StopNominations = () => {
  const { t } = useTranslation('modals');
  const { network } = useNetwork();
  const { notEnoughFunds } = useTxMeta();
  const { getBondedAccount } = useBonded();
  const { getNominations } = useBalances();
  const { activeAccount } = useActiveAccounts();
  const { getSignerWarnings } = useSignerWarnings();
  const {
    setModalStatus,
    config: { options },
    setModalResize,
  } = useOverlay().modal;
  const { activePoolNominations, isNominator, isOwner, activePool } =
    useActivePool();

  const { bondFor } = options;
  const isPool = bondFor === 'pool';
  const isStaking = bondFor === 'nominator';
  const controller = getBondedAccount(activeAccount);
  const signingAccount = isPool ? activeAccount : controller;

  const nominations =
    isPool === true
      ? activePoolNominations?.targets || []
      : getNominations(activeAccount);

  // valid to submit transaction
  const [valid, setValid] = useState<boolean>(false);

  // ensure selected key is valid
  useEffect(() => {
    setValid(nominations.length > 0);
  }, [nominations]);

  // ensure roles are valid
  let isValid = nominations.length > 0;
  if (isPool) {
    isValid = (isNominator() || isOwner()) ?? false;
  }

  const getTx = () => {
    let tx = null;
    if (!valid) {
      return tx;
    }
    if (isPool) {
      tx = new PoolChill(network, activePool?.id || 0).tx();
    } else if (isStaking) {
      tx = new StakingChill(network).tx();
    }
    return tx;
  };

  const submitExtrinsic = useSubmitExtrinsic({
    tx: getTx(),
    from: signingAccount,
    shouldSubmit: valid,
    callbackSubmit: () => {
      setModalStatus('closing');
    },
  });

  const warnings = getSignerWarnings(
    activeAccount,
    isStaking,
    submitExtrinsic.proxySupported
  );

  if (!nominations.length) {
    warnings.push(`${t('noNominationsSet')}`);
  }

  useEffect(() => setModalResize(), [notEnoughFunds]);

  useEffect(() => setValid(isValid), [isValid]);

  return (
    <>
      <Close />
      <ModalPadding>
        <h2 className="title unbounded">
          {t('stop')} {t('allNominations')}
        </h2>
        <ModalSeparator />
        {warnings.length ? (
          <ModalWarnings>
            {warnings.map((text, i) => (
              <Warning key={`warning_${i}`} text={text} />
            ))}
          </ModalWarnings>
        ) : null}
        <p>{t('changeNomination')}</p>
      </ModalPadding>
      <SubmitTx fromController={isStaking} valid={valid} {...submitExtrinsic} />
    </>
  );
};
