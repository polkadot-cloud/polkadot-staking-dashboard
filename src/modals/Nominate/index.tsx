// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlayCircle } from '@fortawesome/free-solid-svg-icons';
import { faArrowAltCircleUp } from '@fortawesome/free-regular-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { useBalances } from 'contexts/Balances';
import { useApi } from 'contexts/Api';
import { useModal } from 'contexts/Modal';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { useConnect } from 'contexts/Connect';
import { Warning } from 'library/Form/Warning';
import { useStaking } from 'contexts/Staking';
import { planckBnToUnit } from 'Utils';
import { EstimatedTxFee } from 'library/EstimatedTxFee';
import { useTxFees } from 'contexts/TxFees';
import { Title } from 'library/Modal/Title';
import { useTranslation } from 'react-i18next';
import {
  FooterWrapper,
  Separator,
  NotesWrapper,
  PaddingWrapper,
} from '../Wrappers';

export const Nominate = () => {
  const { api, network } = useApi();
  const { activeAccount } = useConnect();
  const { targets, staking, getControllerNotImported } = useStaking();
  const { getBondedAccount, getLedgerForStash } = useBalances();
  const { setStatus: setModalStatus } = useModal();
  const { txFeesValid } = useTxFees();
  const { units } = network;
  const { minNominatorBond } = staking;
  const controller = getBondedAccount(activeAccount);
  const { nominations } = targets;
  const ledger = getLedgerForStash(activeAccount);
  const { active } = ledger;
  const { t } = useTranslation('common');

  const activeBase = planckBnToUnit(active, units);
  const minNominatorBondBase = planckBnToUnit(minNominatorBond, units);

  // valid to submit transaction
  const [valid, setValid] = useState<boolean>(false);

  // ensure selected key is valid
  useEffect(() => {
    setValid(nominations.length > 0 && activeBase >= minNominatorBondBase);
  }, [targets]);

  // tx to submit
  const tx = () => {
    let _tx = null;
    if (!valid || !api) {
      return _tx;
    }
    const targetsToSubmit = nominations.map((item: any) => {
      return {
        Id: item.address,
      };
    });
    _tx = api.tx.staking.nominate(targetsToSubmit);
    return _tx;
  };

  const { submitTx, submitting } = useSubmitExtrinsic({
    tx: tx(),
    from: controller,
    shouldSubmit: valid,
    callbackSubmit: () => {
      setModalStatus(2);
    },
    callbackInBlock: () => {},
  });

  const unit = network.unit;
  // warnings
  const warnings = [];
  if (getControllerNotImported(controller)) {
    warnings.push(t('modals.w5'));
  }
  if (!nominations.length) {
    warnings.push(t('modals.w6'));
  }
  if (activeBase < minNominatorBondBase) {
    warnings.push(`${(t('modals.w7'), { minNominatorBondBase, unit })}`);
  }

  return (
    <>
      <Title title={t('modals.nominate1')} icon={faPlayCircle} />
      <PaddingWrapper verticalOnly>
        <div
          style={{ padding: '0 1rem', width: '100%', boxSizing: 'border-box' }}
        >
          {warnings.map((text: any, index: number) => (
            <Warning key={index} text={text} />
          ))}
          {t('modals.have_nomination', { count: nominations.length })}
          <Separator />
          <NotesWrapper>
            <p>{t('modals.nominate')}</p>
            <EstimatedTxFee />
          </NotesWrapper>
          <FooterWrapper>
            <div>
              <button
                type="button"
                className="submit"
                onClick={() => submitTx()}
                disabled={
                  !valid || submitting || warnings.length > 0 || !txFeesValid
                }
              >
                <FontAwesomeIcon
                  transform="grow-2"
                  icon={faArrowAltCircleUp as IconProp}
                />
                {t('modals.submit')}
              </button>
            </div>
          </FooterWrapper>
        </div>
      </PaddingWrapper>
    </>
  );
};

export default Nominate;
