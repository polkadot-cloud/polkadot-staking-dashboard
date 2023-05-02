// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Tx } from '@polkadotcloud/core-ui';
import { useApi } from 'contexts/Api';
import { useBonded } from 'contexts/Bonded';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { useTxMeta } from 'contexts/TxMeta';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Default } from './Default';
import { ManualSign } from './ManualSign';
import type { SubmitTxProps } from './types';

export const SubmitTx = ({
  uid,
  onSubmit,
  submitText,
  buttons = [],
  valid = false,
  submitting = false,
  proxySupported,
  fromController = false,
}: SubmitTxProps) => {
  const { t } = useTranslation();
  const { unit } = useApi().network;
  const { notEnoughFunds, sender, setTxSignature } = useTxMeta();
  const { requiresManualSign, activeAccount, activeProxy, getAccount } =
    useConnect();
  const { setResize } = useModal();
  const { getBondedAccount } = useBonded();
  const controller = getBondedAccount(activeAccount);

  // Default to active account, or controller / proxy if from those accounts.
  let signingOpts = {
    label: t('signer', { ns: 'library' }),
    who: getAccount(activeAccount),
  };

  if (!(activeProxy && proxySupported) && fromController) {
    signingOpts = {
      label: t('signedByController', { ns: 'library' }),
      who: getAccount(controller),
    };
  }
  if (activeProxy && proxySupported) {
    signingOpts = {
      label: t('signedByProxy', { ns: 'library' }),
      who: getAccount(activeProxy),
    };
  }

  submitText =
    submitText ||
    `${
      submitting
        ? t('submitting', { ns: 'modals' })
        : t('submit', { ns: 'modals' })
    }`;

  // Set resize on not enough funds
  useEffect(() => {
    setResize();
  }, [notEnoughFunds, fromController]);

  // Reset tx metadata on unmount
  useEffect(() => {
    return () => {
      setTxSignature(null);
    };
  }, []);

  return (
    <Tx
      margin
      label={signingOpts.label}
      name={signingOpts.who?.name || ''}
      notEnoughFunds={notEnoughFunds}
      dangerMessage={`${t('notEnough', { ns: 'library' })} ${unit}`}
      requiresManualSign={requiresManualSign(sender)}
      ManualSign={
        <ManualSign
          uid={uid}
          onSubmit={onSubmit}
          submitting={submitting}
          valid={valid}
          submitText={submitText}
          buttons={buttons}
        />
      }
      DefaultSign={
        <Default
          onSubmit={onSubmit}
          submitting={submitting}
          valid={valid}
          submitText={submitText}
          buttons={buttons}
        />
      }
    />
  );
};
