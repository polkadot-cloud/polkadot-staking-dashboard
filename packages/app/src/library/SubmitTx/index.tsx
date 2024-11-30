// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { useBonded } from 'contexts/Bonded';
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts';
import { useNetwork } from 'contexts/Network';
import { useTxMeta } from 'contexts/TxMeta';
import { useOverlay } from 'kits/Overlay/Provider';
import { Tx } from 'library/Tx';
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
  submitAddress,
  valid = false,
  noMargin = false,
  submitting = false,
  proxySupported,
  displayFor = 'default',
  fromController = false,
}: SubmitTxProps) => {
  const { t } = useTranslation();
  const { getBondedAccount } = useBonded();
  const { unit } = useNetwork().networkData;
  const { setModalResize } = useOverlay().modal;
  const { notEnoughFunds, getTxSubmission } = useTxMeta();
  const { activeAccount, activeProxy } = useActiveAccounts();
  const { getAccount, requiresManualSign } = useImportedAccounts();
  const controller = getBondedAccount(activeAccount);

  const txSubmission = getTxSubmission(uid);
  const from = txSubmission?.from || null;

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
    setModalResize();
  }, [notEnoughFunds, fromController]);

  return (
    <Tx
      displayFor={displayFor}
      margin={!noMargin}
      label={signingOpts.label}
      name={signingOpts.who?.name || ''}
      notEnoughFunds={notEnoughFunds}
      dangerMessage={`${t('notEnough', { ns: 'library' })} ${unit}`}
      SignerComponent={
        requiresManualSign(from) ? (
          <ManualSign
            uid={uid}
            onSubmit={onSubmit}
            submitting={submitting}
            valid={valid}
            submitText={submitText}
            buttons={buttons}
            submitAddress={submitAddress}
            displayFor={displayFor}
          />
        ) : (
          <Default
            onSubmit={onSubmit}
            submitting={submitting}
            valid={valid}
            submitText={submitText}
            buttons={buttons}
            submitAddress={submitAddress}
            displayFor={displayFor}
          />
        )
      }
    />
  );
};
