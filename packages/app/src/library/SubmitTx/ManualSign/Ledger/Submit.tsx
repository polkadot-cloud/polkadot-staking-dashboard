// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faUsb } from '@fortawesome/free-brands-svg-icons';
import { faSquarePen } from '@fortawesome/free-solid-svg-icons';
import { useLedgerHardware } from 'contexts/LedgerHardware';
import { getLedgerApp } from 'contexts/LedgerHardware/Utils';
import { useNetwork } from 'contexts/Network';
import { useTxMeta } from 'contexts/TxMeta';
import { ButtonSubmit } from 'ui-buttons';
import { ButtonSubmitLarge } from 'library/SubmitTx/ButtonSubmitLarge';
import type { LedgerSubmitProps } from 'library/SubmitTx/types';
import { useTranslation } from 'react-i18next';

export const Submit = ({
  displayFor,
  submitting,
  submitText,
  onSubmit,
  disabled,
}: LedgerSubmitProps) => {
  const { t } = useTranslation('library');
  const { network } = useNetwork();
  const { getTxSignature } = useTxMeta();
  const { txMetadataChainId } = getLedgerApp(network);
  const { getIsExecuting, integrityChecked, checkRuntimeVersion } =
    useLedgerHardware();

  // Check device runtime version.
  const handleCheckRuntimeVersion = async () => {
    await checkRuntimeVersion(txMetadataChainId);
  };

  // Is the transaction ready to be submitted?
  const txReady = (getTxSignature() !== null && integrityChecked) || submitting;

  // Button `onClick` handler depends whether integrityChecked and whether tx has been submitted.
  const handleOnClick = !integrityChecked
    ? handleCheckRuntimeVersion
    : onSubmit;

  // Determine button text.
  const text = !integrityChecked
    ? t('confirm')
    : txReady
      ? submitText || ''
      : getIsExecuting()
        ? t('signing')
        : t('sign');

  // Button icon.
  const icon = !integrityChecked ? faUsb : faSquarePen;

  return displayFor !== 'card' ? (
    <ButtonSubmit
      lg={displayFor === 'canvas'}
      iconLeft={icon}
      iconTransform="grow-2"
      text={text}
      onClick={handleOnClick}
      disabled={disabled}
      pulse={!disabled}
    />
  ) : (
    <ButtonSubmitLarge
      disabled={disabled}
      onSubmit={handleOnClick}
      submitText={text}
      icon={icon}
      pulse={!disabled}
    />
  );
};
