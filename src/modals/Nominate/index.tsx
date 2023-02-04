// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faArrowAltCircleUp } from '@fortawesome/free-regular-svg-icons';
import { faPlayCircle } from '@fortawesome/free-solid-svg-icons';
import { ButtonSubmit } from '@rossbulat/polkadot-dashboard-ui';
import { useApi } from 'contexts/Api';
import { useBalances } from 'contexts/Balances';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { useStaking } from 'contexts/Staking';
import { useTxFees } from 'contexts/TxFees';
import { Warning } from 'library/Form/Warning';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { Title } from 'library/Modal/Title';
import { SubmitTx } from 'library/SubmitTx';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { planckToUnit } from 'Utils';
import { PaddingWrapper, Separator, WarningsWrapper } from '../Wrappers';

export const Nominate = () => {
  const { t } = useTranslation('modals');
  const { api, network } = useApi();
  const { activeAccount } = useConnect();
  const { targets, staking, getControllerNotImported } = useStaking();
  const { getBondedAccount, getLedgerForStash } = useBalances();
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
    const targetsToSubmit = nominations.map((item: any) => {
      return {
        Id: item.address,
      };
    });
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
    warnings.push(`${t('notMeetMinimum', { minNominatorBondUnit, unit })}`);
  }

  return (
    <>
      <Title title={t('nominate')} icon={faPlayCircle} />
      <PaddingWrapper>
        {warnings.length > 0 && (
          <WarningsWrapper>
            {warnings.map((text: any, index: number) => (
              <Warning key={index} text={text} />
            ))}
          </WarningsWrapper>
        )}
        <h2 className="title">
          {t('haveNomination', { count: nominations.length })}
        </h2>
        <Separator />
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
