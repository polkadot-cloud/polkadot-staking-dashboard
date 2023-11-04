// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faUsb } from '@fortawesome/free-brands-svg-icons';
import { faSquarePen } from '@fortawesome/free-solid-svg-icons';
import { ButtonSubmit } from '@polkadot-cloud/react';
import type { LedgerAccount } from '@polkadot-cloud/react/types';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts';
import { useLedgerHardware } from 'contexts/Hardware/Ledger';
import { getLedgerApp } from 'contexts/Hardware/Utils';
import { useNetwork } from 'contexts/Network';
import { useTxMeta } from 'contexts/TxMeta';
import { useLedgerLoop } from 'library/Hooks/useLedgerLoop';
import type { LedgerSubmitProps } from 'library/SubmitTx/types';
import { useTranslation } from 'react-i18next';

export const Submit = ({
  displayFor,
  submitting,
  submitText,
  onSubmit,
  disabled,
  isMounted,
}: LedgerSubmitProps) => {
  const { t } = useTranslation('library');
  const {
    getIsExecuting,
    integrityChecked,
    pairDevice,
    setIsExecuting,
    checkRuntimeVersion,
  } = useLedgerHardware();
  const { network } = useNetwork();
  const { getTxSignature } = useTxMeta();
  const { getAccount } = useImportedAccounts();
  const { activeAccount } = useActiveAccounts();
  const { appName } = getLedgerApp(network);

  const getAddressIndex = () =>
    (getAccount(activeAccount) as LedgerAccount)?.index || 0;

  const getIsMounted = () => isMounted;

  const { handleLedgerLoop } = useLedgerLoop({
    task: 'sign_tx',
    options: {
      accountIndex: getAddressIndex,
    },
    mounted: getIsMounted,
  });

  // Handle pairing of device.
  const onPair = async () => {
    const paired = await pairDevice();
    return paired;
  };

  // Handle transaction submission
  const handleTxSubmit = async () => {
    const paired = await onPair();
    if (paired) {
      setIsExecuting(true);
      handleLedgerLoop();
    }
  };

  // Check device runtime version.
  const handleCheckRuntimeVersion = async () => {
    const paired = await onPair();
    if (paired) checkRuntimeVersion(appName);
  };

  // Is the transaction ready to be submitted?
  const txReady = (getTxSignature() !== null && integrityChecked) || submitting;

  // Button `onClick` handler depends whether integrityChecked and whether tx has been submitted.
  const handleOnClick = !integrityChecked
    ? handleCheckRuntimeVersion
    : txReady
    ? onSubmit
    : handleTxSubmit;

  // Determine button text.
  const text = !integrityChecked
    ? 'Confirm'
    : txReady
    ? submitText || ''
    : getIsExecuting()
    ? t('signing')
    : t('sign');

  // Button icon.
  const icon = !integrityChecked ? faUsb : faSquarePen;

  return (
    <ButtonSubmit
      lg={displayFor === 'canvas'}
      iconLeft={icon}
      iconTransform="grow-2"
      text={text}
      onClick={handleOnClick}
      disabled={disabled}
      pulse={!disabled}
    />
  );
};
