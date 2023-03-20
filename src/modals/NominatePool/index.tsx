// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { Warning } from 'library/Form/Warning';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { Action } from 'library/Modal/Action';
import { Close } from 'library/Modal/Close';
import { SubmitTx } from 'library/SubmitTx';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PaddingWrapper, WarningsWrapper } from '../Wrappers';

export const NominatePool = () => {
  const { t } = useTranslation('modals');
  const { api } = useApi();
  const { setStatus: setModalStatus } = useModal();
  const { activeAccount, accountHasSigner } = useConnect();
  const { selectedActivePool, isOwner, isNominator, targets } =
    useActivePools();
  const { nominations } = targets;

  // valid to submit transaction
  const [valid, setValid] = useState<boolean>(false);

  const poolId = selectedActivePool?.id ?? null;

  // ensure selected roles are valid
  const isValid =
    (poolId !== null && isNominator() && nominations.length > 0) ?? false;
  useEffect(() => {
    setValid(isValid);
  }, [isValid]);

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

  const { submitTx, submitting } = useSubmitExtrinsic({
    tx: getTx(),
    from: activeAccount,
    shouldSubmit: valid,
    callbackSubmit: () => {
      setModalStatus(2);
    },
    callbackInBlock: () => {},
  });

  // warnings
  const warnings = [];
  if (!accountHasSigner(activeAccount)) {
    warnings.push(t('readOnly'));
  }
  if (!nominations.length) {
    warnings.push(t('noNominationsSet'));
  }
  if (!isOwner() || !isNominator()) {
    warnings.push(`${t('noNominatorRole')}`);
  }

  return (
    <>
      <Close />
      <PaddingWrapper>
        <h2 className="title unbounded">{t('nominate')}</h2>
        {warnings.length ? (
          <WarningsWrapper>
            {warnings.map((text: string, index: number) => (
              <Warning key={`warning_${index}`} text={text} />
            ))}
          </WarningsWrapper>
        ) : null}
        <Action text={t('haveNomination', { count: nominations.length })} />
        <p>{t('onceSubmitted')}</p>
      </PaddingWrapper>
      <SubmitTx
        submit={submitTx}
        submitting={submitting}
        valid={valid && warnings.length === 0}
      />
    </>
  );
};
