// Copyright 2023 @paritytech/polkadot-live authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ButtonMonoInvert } from '@polkadotcloud/dashboard-ui';
import { useLedgerHardware } from 'contexts/Hardware/Ledger';
import { useModal } from 'contexts/Modal';
import { ReactComponent as IconSVG } from 'img/ledgerIcon.svg';
import type { AnyJson } from 'types';
import { Addresess } from './Addresses';
import { determineStatusFromCodes } from './Utils';
import { StatusBarWrapper } from './Wrappers';

export const Manage = ({ addresses, handleLedgerLoop }: AnyJson) => {
  const { replaceModalWith } = useModal();
  const { setIsImporting, getIsExecuting, getStatusCodes, resetStatusCodes } =
    useLedgerHardware();

  const isExecuting = getIsExecuting();
  const statusCodes = getStatusCodes();

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
                {!isExecuting || !statusCodes.length
                  ? `Displaying ${addresses.length} Ledger Account${
                      addresses.length === 1 ? '' : 's'
                    }`
                  : determineStatusFromCodes(statusCodes, true).title}
              </h3>
            </div>
          </div>
          <div>
            {isExecuting ? (
              <ButtonMonoInvert
                text="Cancel"
                onClick={() => {
                  setIsImporting(false);
                  resetStatusCodes();
                }}
              />
            ) : (
              <ButtonMonoInvert
                text="Done"
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
