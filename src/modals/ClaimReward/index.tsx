// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faArrowAltCircleUp } from '@fortawesome/free-regular-svg-icons';
import { faPlus, faShare } from '@fortawesome/free-solid-svg-icons';
import { ButtonSubmit } from '@rossbulat/polkadot-dashboard-ui';
import { BN } from 'bn.js';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { useTxFees } from 'contexts/TxFees';
import { EstimatedTxFee } from 'library/EstimatedTxFee';
import { Warning } from 'library/Form/Warning';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { Title } from 'library/Modal/Title';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { planckBnToUnit } from 'Utils';
import { FooterWrapper, PaddingWrapper, Separator } from '../Wrappers';

export const ClaimReward = () => {
  const { api, network } = useApi();
  const { setStatus: setModalStatus, config } = useModal();
  const { selectedActivePool } = useActivePools();
  const { activeAccount, accountHasSigner } = useConnect();
  const { txFeesValid } = useTxFees();
  const { units, unit } = network;
  let { unclaimedRewards } = selectedActivePool || {};
  unclaimedRewards = unclaimedRewards ?? new BN(0);
  const { claimType } = config;
  const { t } = useTranslation('common');

  // ensure selected payout is valid
  useEffect(() => {
    if (unclaimedRewards?.gtn(0)) {
      setValid(true);
    } else {
      setValid(false);
    }
  }, [selectedActivePool]);

  // valid to submit transaction
  const [valid, setValid] = useState<boolean>(false);

  // tx to submit
  const tx = () => {
    let _tx = null;
    if (!api) {
      return _tx;
    }

    if (claimType === 'bond') {
      _tx = api.tx.nominationPools.bondExtra('Rewards');
    } else {
      _tx = api.tx.nominationPools.claimPayout();
    }
    return _tx;
  };

  const { submitTx, submitting } = useSubmitExtrinsic({
    tx: tx(),
    from: activeAccount,
    shouldSubmit: valid,
    callbackSubmit: () => {
      setModalStatus(2);
    },
    callbackInBlock: () => {},
  });

  return (
    <>
      <Title
        title={`${
          claimType === 'bond' ? t('modals.bond') : t('modals.withdraw')
        } ${t('modals.rewards')}`}
        icon={claimType === 'bond' ? faPlus : faShare}
      />
      <PaddingWrapper>
        <div
          style={{
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          {!accountHasSigner(activeAccount) && (
            <Warning text={t('modals.w1')} />
          )}
          {!unclaimedRewards?.gtn(0) && <Warning text={t('modals.w2')} />}
          <h2>
            {planckBnToUnit(unclaimedRewards, units)} {unit}
          </h2>
          <Separator />
          <div className="notes">
            {claimType === 'bond' ? (
              <p>{t('modals.claim_reward1')}</p>
            ) : (
              <p>{t('modals.claim_reward2')}</p>
            )}
            <EstimatedTxFee />
          </div>
          <FooterWrapper>
            <div>
              <ButtonSubmit
                text={`Submit${submitting ? 'ting' : ''}`}
                iconLeft={faArrowAltCircleUp}
                iconTransform="grow-2"
                onClick={() => submitTx()}
                disabled={
                  !valid ||
                  submitting ||
                  !accountHasSigner(activeAccount) ||
                  !txFeesValid
                }
              />
            </div>
          </FooterWrapper>
        </div>
      </PaddingWrapper>
    </>
  );
};

export default ClaimReward;
