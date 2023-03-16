// Copyright 2023 @paritytech/polkadot-live authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { ButtonText } from '@polkadotcloud/dashboard-ui';
import { useLedgerHardware } from 'contexts/Hardware/Ledger';
import { ReactComponent as AppSVG } from 'img/appIcons/polkadot.svg';
import type { AnyJson } from 'types';
// import { Address } from './Address';
import { AddressWrapper } from './Wrappers';

export const Addresess = ({ addresses }: AnyJson) => {
  const { getIsImporting, setIsImporting } = useLedgerHardware();
  const isImporting = getIsImporting();
  return (
    <>
      {addresses.length ? (
        <AddressWrapper>
          <div className="heading">
            <h4>
              <AppSVG />
              <span>Polkadot</span>
            </h4>
          </div>
          <div className="items">
            {/* {addresses.map(({ address, index }: AnyJson, i: number) => (
              <Address key={i} address={address} index={index} />
            ))} */}
          </div>
          <div className="more">
            <ButtonText
              iconLeft={faArrowDown}
              text={isImporting ? ' Getting Account' : 'Get Another Account'}
              disabled={isImporting}
              onClick={() => setIsImporting(true)}
            />
          </div>
        </AddressWrapper>
      ) : null}
    </>
  );
};
