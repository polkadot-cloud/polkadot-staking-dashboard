// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ActionItem, ModalPadding, ModalWarnings } from '@polkadot-cloud/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { Warning } from 'library/Form/Warning';
import { useSignerWarnings } from 'library/Hooks/useSignerWarnings';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { Close } from 'library/Modal/Close';
import { SubmitTx } from 'library/SubmitTx';
import { useTxMeta } from 'contexts/TxMeta';

export const NominatePool = () => {
  const { t } = useTranslation('modals');
  const { api } = useApi();
  const { setStatus: setModalStatus, setResize } = useModal();
  const { activeAccount } = useConnect();
  const { selectedActivePool, isOwner, isNominator, targets } =
    useActivePools();
  const { getSignerWarnings } = useSignerWarnings();
  const { notEnoughFunds } = useTxMeta();

  const { nominations } = targets;

  // valid to submit transaction
  const [valid, setValid] = useState<boolean>(false);

  const poolId = selectedActivePool?.id ?? null;

  // ensure selected roles are valid
  const isValid =
    (poolId !== null && isNominator() && nominations.length > 0) ?? false;

  // tx to submit
  const getTx = () => {
    let tx = null;
    if (!valid || !api) {
      return tx;
    }
    const targetsToSubmit = nominations.map((item: any) => item.address);
    tx = api.tx.nominationPools.nominate(poolId, targetsToSubmit);
    return tx;
  };

  useEffect(() => setValid(isValid), [isValid]);

  useEffect(() => setResize(), [notEnoughFunds]);

  const submitExtrinsic = useSubmitExtrinsic({
    tx: getTx(),
    from: activeAccount,
    shouldSubmit: valid,
    callbackSubmit: () => {
      setModalStatus('closing');
    },
    callbackInBlock: () => {},
  });

  // warnings
  const warnings = getSignerWarnings(
    activeAccount,
    false,
    submitExtrinsic.proxySupported
  );

  if (!nominations.length) {
    warnings.push(t('noNominationsSet'));
  }
  if (!isOwner() || !isNominator()) {
    warnings.push(`${t('noNominatorRole')}`);
  }

  return (
    <>
      <Close />
      <ModalPadding>
        <h2 className="title unbounded">{t('nominate')}</h2>
        {warnings.length ? (
          <ModalWarnings withMargin>
            {warnings.map((text, i) => (
              <Warning key={`warning_${i}`} text={text} />
            ))}
          </ModalWarnings>
        ) : null}
        <ActionItem text={t('haveNomination', { count: nominations.length })} />
        <p>{t('onceSubmitted')}</p>
      </ModalPadding>
      <SubmitTx valid={valid && warnings.length === 0} {...submitExtrinsic} />
    </>
  );
};
