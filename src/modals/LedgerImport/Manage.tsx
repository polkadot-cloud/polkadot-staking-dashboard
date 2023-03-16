// Copyright 2023 @paritytech/polkadot-live authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ButtonMonoInvert } from '@polkadotcloud/dashboard-ui';
import { useLedgerHardware } from 'contexts/Hardware/Ledger';
import { ReactComponent as IconSVG } from 'img/ledgerIcon.svg';
import { Title } from 'library/Modal/Title';
import type { AnyJson } from 'types';
// import { Addresess } from './Addresses';
import { determineStatusFromCodes } from './Utils';
import { StatusBarWrapper } from './Wrappers';

export const Manage = ({ addresses }: AnyJson) => {
  const { setIsImporting, getIsImporting, getStatusCodes, resetStatusCodes } =
    useLedgerHardware();

  const isImporting = getIsImporting();
  const statusCodes = getStatusCodes();
  return (
    <>
      <Title title="" />
      {/* <Addresess
      addresses={addresses}
      isImporting={isImporting}
      toggleImport={toggleImport}
    /> */}

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
                {!isImporting
                  ? `Displaying ${addresses.length} Ledger Account${
                      addresses.length === 1 ? '' : 's'
                    }`
                  : !statusCodes.length
                  ? 'Connecting...'
                  : determineStatusFromCodes(statusCodes, true).title}
              </h3>
              {determineStatusFromCodes(statusCodes, true).subtitle ? (
                <h5>{determineStatusFromCodes(statusCodes, true).subtitle}</h5>
              ) : null}
            </div>
          </div>
          <div>
            {isImporting ? (
              <ButtonMonoInvert
                text="Cancel"
                onClick={() => {
                  setIsImporting(false);
                  resetStatusCodes();
                }}
              />
            ) : null}
          </div>
        </div>
      </StatusBarWrapper>
    </>
  );
};
