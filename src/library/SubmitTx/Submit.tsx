// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faArrowAltCircleUp } from '@fortawesome/free-regular-svg-icons';
import { ButtonSubmit } from '@polkadotcloud/dashboard-ui';
import { useConnect } from 'contexts/Connect';
import { useTxFees } from 'contexts/TxFees';
import type { SubmitProps } from './types';

export const Submit = ({
  onSubmit,
  submitting,
  valid,
  submitText,
}: SubmitProps) => {
  const { txFeesValid } = useTxFees();
  const { activeAccount, accountHasSigner } = useConnect();

  return (
    <ButtonSubmit
      text={`${submitText}`}
      iconLeft={faArrowAltCircleUp}
      iconTransform="grow-2"
      onClick={() => onSubmit()}
      disabled={
        submitting || !valid || !accountHasSigner(activeAccount) || !txFeesValid
      }
    />
  );
};
