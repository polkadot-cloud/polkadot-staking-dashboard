// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ActionItem, ModalWarnings } from '@polkadotcloud/core-ui';
import { planckToUnit } from '@polkadotcloud/utils';
import { useApi } from 'contexts/Api';
import { useBalances } from 'contexts/Balances';
import { useBonded } from 'contexts/Bonded';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { useStaking } from 'contexts/Staking';
import { Warning } from 'library/Form/Warning';
import { useSignerWarnings } from 'library/Hooks/useSignerWarnings';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { Close } from 'library/Modal/Close';
import { SubmitTx } from 'library/SubmitTx';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PaddingWrapper } from '../Wrappers';

export const Nominate = () => {
  const { t } = useTranslation('modals');
  const { api, network } = useApi();
  const { activeAccount } = useConnect();
  const { targets, staking } = useStaking();
  const { getBondedAccount } = useBonded();
  const { getStashLedger } = useBalances();
  const { setStatus: setModalStatus } = useModal();
  const { getSignerWarnings } = useSignerWarnings();

  const { units, unit } = network;
  const { minNominatorBond } = staking;
  const controller = getBondedAccount(activeAccount);
  const { nominations } = targets;
  const ledger = getStashLedger(activeAccount);
  const { active } = ledger;

  const activeUnit = planckToUnit(active, units);
  const minNominatorBondUnit = planckToUnit(minNominatorBond, units);

  // valid to submit transaction
  const [valid, setValid] = useState<boolean>(false);

  // ensure selected key is valid
  useEffect(() => {
    setValid(
      nominations.length > 0 &&
        activeUnit.isGreaterThanOrEqualTo(minNominatorBondUnit)
    );
  }, [targets]);

  // tx to submit
  const getTx = () => {
    let tx = null;
    if (!valid || !api) {
      return tx;
    }
    const targetsToSubmit = nominations.map((item: any) => ({
      Id: item.address,
    }));
    tx = api.tx.staking.nominate(targetsToSubmit);
    return tx;
  };

  const submitExtrinsic = useSubmitExtrinsic({
    tx: getTx(),
    from: controller,
    shouldSubmit: valid,
    callbackSubmit: () => {
      setModalStatus(2);
    },
    callbackInBlock: () => {},
  });

  // warnings
  const warnings = getSignerWarnings(
    activeAccount,
    true,
    submitExtrinsic.proxySupported
  );
  if (!nominations.length) {
    warnings.push(`${t('noNominationsSet')}`);
  }

  if (!activeUnit.isGreaterThan(minNominatorBondUnit)) {
    warnings.push(
      `${t('notMeetMinimum', {
        minNominatorBondUnit: minNominatorBondUnit.toString(),
        unit,
      })}`
    );
  }

  return (
    <>
      <Close />
      <PaddingWrapper>
        <h2 className="title unbounded">{t('nominate')}</h2>
        {warnings.length > 0 ? (
          <ModalWarnings withMargin>
            {warnings.map((text, i) => (
              <Warning key={`warning_${i}`} text={text} />
            ))}
          </ModalWarnings>
        ) : null}
        <ActionItem text={t('haveNomination', { count: nominations.length })} />
        <p>{t('onceSubmitted')}</p>
      </PaddingWrapper>
      <SubmitTx
        fromController
        valid={valid && warnings.length === 0}
        {...submitExtrinsic}
      />
    </>
  );
};
