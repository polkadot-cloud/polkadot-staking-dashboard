// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faArrowAltCircleUp } from '@fortawesome/free-regular-svg-icons';
import { faPlayCircle } from '@fortawesome/free-solid-svg-icons';
import { ButtonSubmit } from '@rossbulat/polkadot-dashboard-ui';
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
import {
  FooterWrapper,
  NotesWrapper,
  PaddingWrapper,
  Separator,
} from '../Wrappers';

export const NominatePool = () => {
  const { api } = useApi();
  const { setStatus: setModalStatus } = useModal();
  const { activeAccount, accountHasSigner } = useConnect();
  const { selectedActivePool, isOwner, isNominator, targets } =
    useActivePools();
  const { txFeesValid } = useTxFees();
  const { nominations } = targets;
  const { t } = useTranslation('modals');

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
    warnings.push(t('read_only'));
  }
  if (!nominations.length) {
    warnings.push(t('no_nominations_set'));
  }
  if (!isOwner() || !isNominator()) {
    warnings.push(`${t('no_nominator_role')}`);
  }

  return (
    <>
      <Title title={t('nominate')} icon={faPlayCircle} />
      <PaddingWrapper verticalOnly>
        <div style={{ padding: '0 1rem', width: '100%' }}>
          {warnings.map((text: string, index: number) => (
            <Warning key={`warning_${index}`} text={text} />
          ))}
          <h2>{t('have_nomination', { count: nominations.length })}</h2>
          <Separator />
          <NotesWrapper>
            <p>{t('once_submitted')}</p>
            <EstimatedTxFee />
          </NotesWrapper>
          <FooterWrapper>
            <div>
              <ButtonSubmit
                text={`${
                  submitting
                    ? t('submit', { context: 'submitting' })
                    : t('submit', { context: 'submit' })
                }`}
                iconLeft={faArrowAltCircleUp}
                iconTransform="grow-2"
                onClick={() => submitTx()}
                disabled={
                  !valid ||
                  submitting ||
                  warnings.length > 0 ||
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

export default NominatePool;
