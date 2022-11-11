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
import { useTransferOptions } from 'contexts/TransferOptions';
import { useTxFees } from 'contexts/TxFees';
import { useUi } from 'contexts/UI';
import { defaultPoolSetup } from 'contexts/UI/defaults';
import { SetupType } from 'contexts/UI/types';
import { EstimatedTxFee } from 'library/EstimatedTxFee';
import { BondFeedback } from 'library/Form/Bond/BondFeedback';
import useBondGreatestFee from 'library/Hooks/useBondGreatestFee';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { Title } from 'library/Modal/Title';
import { useEffect, useState } from 'react';
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
  const { setActiveAccountSetup } = useUi();
  const { txFeesValid } = useTxFees();
  const { getTransferOptions } = useTransferOptions();
  const { freeBalance } = getTransferOptions(activeAccount);
  const largestTxFee = useBondGreatestFee({ bondType: 'pool' });

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
  const tx = () => {
    let _tx = null;
    if (!bondValid || !api) {
      return _tx;
    }

    // remove decimal errors
    const bondToSubmit = unitToPlanckBn(bond.bond, units);
    _tx = api.tx.nominationPools.join(bondToSubmit, poolId);

    return _tx;
  };

  const { submitTx, submitting } = useSubmitExtrinsic({
    tx: tx(),
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
      setActiveAccountSetup(SetupType.Pool, defaultPoolSetup);
    },
  });

  const warnings = [];
  if (!accountHasSigner(activeAccount)) {
    warnings.push('Your account is read only, and cannot sign transactions.');
  }
  return (
    <>
      <Title title="Join Pool" icon={faUserPlus} />
      <PaddingWrapper>
        <ContentWrapper>
          <div>
            <BondFeedback
              syncing={largestTxFee.eq(new BN(0))}
              bondType="pool"
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
                text={`Submit${submitting ? 'ting' : ''}`}
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
