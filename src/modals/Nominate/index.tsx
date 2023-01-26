// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
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
import { EstimatedTxFee } from 'library/EstimatedTxFee';
import { Warning } from 'library/Form/Warning';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { Title } from 'library/Modal/Title';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { planckBnToUnit } from 'Utils';
import {
  FooterWrapper,
  NotesWrapper,
  PaddingWrapper,
  Separator,
  WarningsWrapper,
} from '../Wrappers';

export const Nominate = () => {
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
  const { t } = useTranslation('modals');

  const activeBase = planckBnToUnit(active, units);
  const minNominatorBondBase = planckBnToUnit(minNominatorBond, units);

  // valid to submit transaction
  const [valid, setValid] = useState<boolean>(false);

  // ensure selected key is valid
  useEffect(() => {
    setValid(nominations.length > 0 && activeBase >= minNominatorBondBase);
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
  if (activeBase < minNominatorBondBase) {
    warnings.push(`${t('notMeetMinimum', { minNominatorBondBase, unit })}`);
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
        <NotesWrapper>
          <p>{t('onceSubmitted')}</p>
          <EstimatedTxFee />
        </NotesWrapper>
        <FooterWrapper>
          <div>
            <ButtonSubmit
              text={`${submitting ? t('submitting') : t('submit')}`}
              iconLeft={faArrowAltCircleUp}
              iconTransform="grow-2"
              onClick={() => submitTx()}
              disabled={
                !valid || submitting || warnings.length > 0 || !txFeesValid
              }
            />
          </div>
        </FooterWrapper>
      </PaddingWrapper>
    </>
  );
};

export default Nominate;
