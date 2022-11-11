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
  const tx = () => {
    let _tx = null;
    if (!valid || !api) {
      return _tx;
    }
    const targetsToSubmit = nominations.map((item: any) => item.address);
    _tx = api.tx.nominationPools.nominate(poolId, targetsToSubmit);
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

  // warnings
  const warnings = [];
  if (!accountHasSigner(activeAccount)) {
    warnings.push('Your account is read only, and cannot sign transactions.');
  }
  if (!nominations.length) {
    warnings.push('You have no nominations set.');
  }
  if (!isOwner() || !isNominator()) {
    warnings.push(`You do not have a nominator role in any pools.`);
  }

  return (
    <>
      <Title title="Nominate" icon={faPlayCircle} />
      <PaddingWrapper verticalOnly>
        <div
          style={{ padding: '0 1rem', width: '100%', boxSizing: 'border-box' }}
        >
          {warnings.map((text: string, index: number) => (
            <Warning key={`warning_${index}`} text={text} />
          ))}
          <h2>
            You Have {nominations.length} Nomination
            {nominations.length === 1 ? '' : 's'}
          </h2>
          <Separator />
          <NotesWrapper>
            <p>
              Once submitted, you will start nominating your chosen validators.
            </p>
            <EstimatedTxFee />
          </NotesWrapper>
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
