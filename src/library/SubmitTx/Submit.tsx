// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faArrowAltCircleUp } from '@fortawesome/free-regular-svg-icons';
import { ButtonSubmit } from '@polkadotcloud/dashboard-ui';
import { useConnect } from 'contexts/Connect';
import { useTxMeta } from 'contexts/TxMeta';
import type { SubmitProps } from './types';

export const Submit = ({
  onSubmit,
  submitting,
  valid,
  submitText,
  customEvent,
}: SubmitProps) => {
  const { txFeesValid } = useTxMeta();
  const { activeAccount, accountHasSigner } = useConnect();

  return (
    <ButtonSubmit
      text={`${submitText}`}
      iconLeft={faArrowAltCircleUp}
      iconTransform="grow-2"
      onClick={() => onSubmit(customEvent)}
      disabled={
        submitting || !valid || !accountHasSigner(activeAccount) || !txFeesValid
      }
    />
  );
};
