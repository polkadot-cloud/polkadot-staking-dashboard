// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faArrowAltCircleUp } from '@fortawesome/free-regular-svg-icons';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { ButtonSubmit } from '@rossbulat/polkadot-dashboard-ui';
import { BN } from 'bn.js';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { usePoolMembers } from 'contexts/Pools/PoolMembers';
import { useSetup } from 'contexts/Setup';
import { defaultPoolSetup } from 'contexts/Setup/defaults';
import { useTransferOptions } from 'contexts/TransferOptions';
import { useTxFees } from 'contexts/TxFees';
import { EstimatedTxFee } from 'library/EstimatedTxFee';
import { BondFeedback } from 'library/Form/Bond/BondFeedback';
import useBondGreatestFee from 'library/Hooks/useBondGreatestFee';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { Title } from 'library/Modal/Title';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { planckBnToUnit, unitToPlanckBn } from 'Utils';
import { FooterWrapper, NotesWrapper, PaddingWrapper } from '../Wrappers';
import { ContentWrapper } from './Wrapper';

export const JoinPool = () => {
  const { api, network } = useApi();
  const { units } = network;
  const { setStatus: setModalStatus, config, setResize } = useModal();
  const { id: poolId, setActiveTab } = config;
  const { activeAccount, accountHasSigner } = useConnect();
  const { queryPoolMember, addToPoolMembers } = usePoolMembers();
  const { setActiveAccountSetup } = useSetup();
  const { txFeesValid } = useTxFees();
  const { getTransferOptions } = useTransferOptions();
  const { freeBalance } = getTransferOptions(activeAccount);
  const largestTxFee = useBondGreatestFee({ bondFor: 'pool' });
  const { t } = useTranslation('modals');

  // local bond value
  const [bond, setBond] = useState({
    bond: planckBnToUnit(freeBalance, units),
  });

  // bond valid
  const [bondValid, setBondValid] = useState<boolean>(false);

  // modal resize on form update
  useEffect(() => {
    setResize();
  }, [bond]);

  // tx to submit
  const getTx = () => {
    let tx = null;
    if (!bondValid || !api) {
      return tx;
    }

    // remove decimal errors
    const bondToSubmit = unitToPlanckBn(String(bond.bond), units);
    tx = api.tx.nominationPools.join(bondToSubmit, poolId);

    return tx;
  };

  const { submitTx, submitting } = useSubmitExtrinsic({
    tx: getTx(),
    from: activeAccount,
    shouldSubmit: bondValid,
    callbackSubmit: () => {
      setModalStatus(2);
      setActiveTab(0);
    },
    callbackInBlock: async () => {
      // query and add account to poolMembers list
      const member = await queryPoolMember(activeAccount);
      addToPoolMembers(member);

      // reset localStorage setup progress
      setActiveAccountSetup('pool', defaultPoolSetup);
    },
  });

  const warnings = [];
  if (!accountHasSigner(activeAccount)) {
    warnings.push(t('readOnly'));
  }
  return (
    <>
      <Title title={t('joinPool')} icon={faUserPlus} />
      <PaddingWrapper>
        <ContentWrapper>
          <div>
            <BondFeedback
              syncing={largestTxFee.eq(new BN(0))}
              bondFor="pool"
              listenIsValid={setBondValid}
              defaultBond={null}
              setters={[
                {
                  set: setBond,
                  current: bond,
                },
              ]}
              warnings={warnings}
              txFees={largestTxFee}
            />
            <NotesWrapper>
              <EstimatedTxFee />
            </NotesWrapper>
          </div>
          <FooterWrapper>
            <div>
              <ButtonSubmit
                text={`${submitting ? t('submitting') : t('submit')}`}
                iconLeft={faArrowAltCircleUp}
                iconTransform="grow-2"
                onClick={() => submitTx()}
                disabled={
                  submitting ||
                  !bondValid ||
                  !accountHasSigner(activeAccount) ||
                  !txFeesValid
                }
              />
            </div>
          </FooterWrapper>
        </ContentWrapper>
      </PaddingWrapper>
    </>
  );
};
