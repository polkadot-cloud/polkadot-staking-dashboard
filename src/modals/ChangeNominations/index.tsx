// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useApi } from 'contexts/Api';
import { useBonded } from 'contexts/Bonded';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { Warning } from 'library/Form/Warning';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { Close } from 'library/Modal/Close';
import { SubmitTx } from 'library/SubmitTx';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PaddingWrapper, Separator, WarningsWrapper } from '../Wrappers';

export const ChangeNominations = () => {
  const { t } = useTranslation('modals');
  const { api } = useApi();
  const { activeAccount, accountHasSigner } = useConnect();
  const { getBondedAccount, getAccountNominations } = useBonded();
  const { setStatus: setModalStatus, config } = useModal();
  const { poolNominations, isNominator, isOwner, selectedActivePool } =
    useActivePools();

  const { nominations: newNominations, provider, bondFor } = config;

  const isPool = bondFor === 'pool';
  const isStaking = bondFor === 'nominator';
  const controller = getBondedAccount(activeAccount);
  const signingAccount = isPool ? activeAccount : controller;

  const nominations =
    isPool === true
      ? poolNominations.targets
      : getAccountNominations(activeAccount);
  const removing = nominations.length - newNominations.length;
  const remaining = newNominations.length;

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
  useEffect(() => {
    setValid(isValid);
  }, [isValid]);

  // tx to submit
  const getTx = () => {
    let tx = null;
    if (!valid || !api) {
      return tx;
    }

    // targets submission differs between staking and pools
    const targetsToSubmit = newNominations.map((item: any) =>
      isPool
        ? item
        : {
            Id: item,
          }
    );

    if (isPool) {
      // if nominations remain, call nominate
      if (remaining !== 0) {
        tx = api.tx.nominationPools.nominate(
          selectedActivePool?.id || 0,
          targetsToSubmit
        );
      } else {
        // wishing to stop all nominations, call chill
        tx = api.tx.nominationPools.chill(selectedActivePool?.id || 0);
      }
    } else if (isStaking) {
      if (remaining !== 0) {
        tx = api.tx.staking.nominate(targetsToSubmit);
      } else {
        tx = api.tx.staking.chill();
      }
    }
    return tx;
  };

  const submitExtrinsic = useSubmitExtrinsic({
    tx: getTx(),
    from: signingAccount,
    shouldSubmit: valid,
    callbackSubmit: () => {
      setModalStatus(2);

      // if removing a subset of nominations, reset selected list
      if (provider) {
        provider.setSelectActive(false);
        provider.resetSelected();
      }
    },
    callbackInBlock: () => {},
  });

  const warnings = [];
  if (!nominations.length) {
    warnings.push(<Warning text={t('noNominationsSet')} />);
  }
  if (!accountHasSigner(signingAccount)) {
    warnings.push(
      <Warning
        text={`${
          bondFor === 'nominator'
            ? t('youMust', { context: 'controller' })
            : t('youMust', { context: 'account' })
        }`}
      />
    );
  }

  return (
    <>
      <Close />
      <PaddingWrapper>
        <h2 className="title unbounded">
          {t('stop')}{' '}
          {!remaining
            ? t('allNominations')
            : `${t('nomination', { count: removing })}`}
        </h2>
        <Separator />
        {warnings.length ? (
          <WarningsWrapper noMargin>
            {warnings.map((warning, index) => (
              <React.Fragment key={`warning_${index}`}>
                {warning}
              </React.Fragment>
            ))}
          </WarningsWrapper>
        ) : null}
        <p>{t('changeNomination')}</p>
      </PaddingWrapper>
      <SubmitTx fromController={isStaking} valid={valid} {...submitExtrinsic} />
    </>
  );
};
