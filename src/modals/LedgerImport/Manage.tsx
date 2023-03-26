// Copyright 2023 @paritytech/polkadot-live authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ButtonMonoInvert } from '@polkadotcloud/dashboard-ui';
import { capitalizeFirstLetter } from 'Utils';
import { useApi } from 'contexts/Api';
import { useLedgerHardware } from 'contexts/Hardware/Ledger';
import { useModal } from 'contexts/Modal';
import { ReactComponent as IconSVG } from 'img/ledgerIcon.svg';
import { useTranslation } from 'react-i18next';
import type { AnyJson } from 'types';
import { Addresess } from './Addresses';
import { determineStatusFromCodes } from './Utils';
import { StatusBarWrapper } from './Wrappers';

export const Manage = ({ addresses, handleLedgerLoop }: AnyJson) => {
  const { t } = useTranslation('modals');
  const { network } = useApi();
  const { replaceModalWith } = useModal();
  const {
    setIsExecuting,
    getIsExecuting,
    getStatusCodes,
    resetStatusCodes,
    getDefaultMessage,
  } = useLedgerHardware();

  const isExecuting = getIsExecuting();
  const statusCodes = getStatusCodes();

  const { title, statusCode } = determineStatusFromCodes(
    capitalizeFirstLetter(network.name),
    statusCodes,
    false
  );
  const fallbackMessage = `${t('ledgerAccounts', { count: addresses.length })}`;
  const defaultMessage = getDefaultMessage();

  return (
    <>
      <Addresess addresses={addresses} handleLedgerLoop={handleLedgerLoop} />
      <StatusBarWrapper
        initial="hidden"
        animate="show"
        variants={{
          hidden: { bottom: -50 },
          show: {
            bottom: 0,
            transition: {
              staggerChildren: 0.01,
            },
          },
        }}
        transition={{
          duration: 2,
          type: 'spring',
          bounce: 0.4,
        }}
      >
        <div className="inner">
          <div>
            <IconSVG width="24" height="24" className="ledgerIcon" />
            <div className="text">
              <h3>
                {defaultMessage ||
                  (!isExecuting || !statusCodes.length
                    ? fallbackMessage
                    : statusCode === 'TransactionRejected'
                    ? fallbackMessage
                    : title)}
              </h3>
            </div>
          </div>
          <div>
            {isExecuting ? (
              <ButtonMonoInvert
                text={t('cancel')}
                onClick={() => {
                  setIsExecuting(false);
                  resetStatusCodes();
                }}
              />
            ) : (
              <ButtonMonoInvert
                text={t('done')}
                onClick={() => {
                  replaceModalWith('Connect', {}, 'large');
                }}
              />
            )}
          </div>
        </div>
      </StatusBarWrapper>
    </>
  );
};
