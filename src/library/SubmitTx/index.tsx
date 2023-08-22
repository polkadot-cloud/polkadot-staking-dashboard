// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Tx } from '@polkadot-cloud/react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useApi } from 'contexts/Api';
import { useBonded } from 'contexts/Bonded';
import { useConnect } from 'contexts/Connect';
import { useTxMeta } from 'contexts/TxMeta';
import { useOverlay } from 'contexts/Overlay';
import { Default } from './Default';
import { ManualSign } from './ManualSign';
import type { SubmitTxProps } from './types';

export const SubmitTx = ({
  uid,
  onSubmit,
  submitText,
  buttons = [],
  submitAddress,
  valid = false,
  submitting = false,
  proxySupported,
  fromController = false,
}: SubmitTxProps) => {
  const { t } = useTranslation();
  const { unit } = useApi().network;
  const { getBondedAccount } = useBonded();
  const { setResize } = useOverlay().modal;
  const { notEnoughFunds, sender, setTxSignature } = useTxMeta();
  const { requiresManualSign, activeAccount, activeProxy, getAccount } =
    useConnect();
  const controller = getBondedAccount(activeAccount);

  // Default to active account
  let signingOpts = {
    label: t('signer', { ns: 'library' }),
    who: getAccount(activeAccount),
  };

  if (activeProxy && proxySupported) {
    signingOpts = {
      label: t('signedByProxy', { ns: 'library' }),
      who: getAccount(activeProxy),
    };
  } else if (!(activeProxy && proxySupported) && fromController) {
    signingOpts = {
      label: t('signedByController', { ns: 'library' }),
      who: getAccount(controller),
    };
  }

  submitText =
    submitText ||
    `${
      submitting
        ? t('submitting', { ns: 'modals' })
        : t('submit', { ns: 'modals' })
    }`;

  // Set resize on not enough funds.
  useEffect(() => {
    setResize();
  }, [notEnoughFunds, fromController]);

  // Reset tx metadata on unmount.
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
      SignerComponent={
        requiresManualSign(sender) ? (
          <ManualSign
            uid={uid}
            onSubmit={onSubmit}
            submitting={submitting}
            valid={valid}
            submitText={submitText}
            buttons={buttons}
            submitAddress={submitAddress}
          />
        ) : (
          <Default
            onSubmit={onSubmit}
            submitting={submitting}
            valid={valid}
            submitText={submitText}
            buttons={buttons}
            submitAddress={submitAddress}
          />
        )
      }
    />
  );
};
