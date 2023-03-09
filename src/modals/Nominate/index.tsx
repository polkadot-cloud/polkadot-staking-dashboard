// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faArrowAltCircleUp } from '@fortawesome/free-regular-svg-icons';
import { ButtonSubmit } from '@rossbulat/polkadot-dashboard-ui';
import { useBalances } from 'contexts/Accounts/Balances';
import { useLedgers } from 'contexts/Accounts/Ledgers';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { useStaking } from 'contexts/Staking';
import { useTxFees } from 'contexts/TxFees';
import { Warning } from 'library/Form/Warning';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { Action } from 'library/Modal/Action';
import { Close } from 'library/Modal/Close';
import { SubmitTx } from 'library/SubmitTx';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { planckToUnit } from 'Utils';
import { PaddingWrapper, WarningsWrapper } from '../Wrappers';

export const Nominate = () => {
  const { t } = useTranslation('modals');
  const { api, network } = useApi();
  const { activeAccount } = useConnect();
  const { targets, staking, getControllerNotImported } = useStaking();
  const { getBondedAccount } = useBalances();
  const { getLedgerForStash } = useLedgers();
  const { setStatus: setModalStatus } = useModal();
  const { txFeesValid } = useTxFees();
  const { units, unit } = network;
  const { minNominatorBond } = staking;
  const controller = getBondedAccount(activeAccount);
  const { nominations } = targets;
  const ledger = getLedgerForStash(activeAccount);
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

  const { submitTx, submitting } = useSubmitExtrinsic({
    tx: getTx(),
    from: controller,
    shouldSubmit: valid,
    callbackSubmit: () => {
      setModalStatus(2);
    },
    callbackInBlock: () => {},
  });

  // warnings
  const warnings = [];
  if (getControllerNotImported(controller)) {
    warnings.push(t('mustHaveController'));
  }
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
          <WarningsWrapper>
            {warnings.map((text: any, index: number) => (
              <Warning key={index} text={text} />
            ))}
          </WarningsWrapper>
        ) : null}
        <Action text={t('haveNomination', { count: nominations.length })} />
        <p>{t('onceSubmitted')}</p>
      </PaddingWrapper>
      <SubmitTx
        fromController
        buttons={[
          <ButtonSubmit
            key="button_submit"
            text={`${submitting ? t('submitting') : t('submit')}`}
            iconLeft={faArrowAltCircleUp}
            iconTransform="grow-2"
            onClick={() => submitTx()}
            disabled={
              !valid || submitting || warnings.length > 0 || !txFeesValid
            }
          />,
        ]}
      />
    </>
  );
};
