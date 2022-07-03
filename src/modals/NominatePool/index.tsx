// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlayCircle } from '@fortawesome/free-solid-svg-icons';
import { faArrowAltCircleUp } from '@fortawesome/free-regular-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { useActivePool } from 'contexts/Pools/ActivePool';
import { useApi } from 'contexts/Api';
import { useModal } from 'contexts/Modal';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { useConnect } from 'contexts/Connect';
import { Warning } from 'library/Form/Warning';
import { usePoolMemberships } from 'contexts/Pools/PoolMemberships';
import {
  HeadingWrapper,
  FooterWrapper,
  Separator,
  NotesWrapper,
  PaddingWrapper,
} from '../Wrappers';

export const NominatePool = () => {
  const { api } = useApi();
  const { setStatus: setModalStatus } = useModal();
  const { activeAccount, accountHasSigner } = useConnect();
  const { membership } = usePoolMemberships();
  const { isNominator, targets } = useActivePool();
  const { nominations } = targets;
  const poolId = membership?.poolId;

  // valid to submit transaction
  const [valid, setValid] = useState<boolean>(false);

  // ensure selected membership and targests are valid
  const isValid = membership && isNominator() && nominations.length > 0;
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

  const { submitTx, estimatedFee, submitting } = useSubmitExtrinsic({
    tx: tx(),
    from: activeAccount,
    shouldSubmit: valid,
    callbackSubmit: () => {
      setModalStatus(0);
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
  if (!membership || !isNominator()) {
    warnings.push(`You do not have a nominator role in any pools.`);
  }

  return (
    <PaddingWrapper verticalOnly>
      <HeadingWrapper>
        <FontAwesomeIcon transform="grow-2" icon={faPlayCircle} />
        Nominate
      </HeadingWrapper>
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
          <p>
            Estimated Tx Fee:{' '}
            {estimatedFee === null ? '...' : `${estimatedFee}`}
          </p>
        </NotesWrapper>
        <FooterWrapper>
          <div>
            <button
              type="button"
              className="submit"
              onClick={() => submitTx()}
              disabled={
                !valid ||
                submitting ||
                warnings.length > 0 ||
                !accountHasSigner(activeAccount)
              }
            >
              <FontAwesomeIcon
                transform="grow-2"
                icon={faArrowAltCircleUp as IconProp}
              />
              Submit
            </button>
          </div>
        </FooterWrapper>
      </div>
    </PaddingWrapper>
  );
};

export default NominatePool;
