// Copyright 2023 @paritytech/polkadot-live authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { ButtonText } from '@polkadotcloud/dashboard-ui';
import { useApi } from 'contexts/Api';
import { useLedgerHardware } from 'contexts/Hardware/Ledger';
import { getLedgerApp } from 'contexts/Hardware/Utils';
import { useTranslation } from 'react-i18next';
import type { AnyJson } from 'types';
import { Address } from './Address';
import { AddressWrapper } from './Wrappers';

export const Addresess = ({ addresses, handleLedgerLoop }: AnyJson) => {
  const { t } = useTranslation('modals');
  const { name } = useApi().network;
  const { getIsExecuting, setIsExecuting, pairDevice } = useLedgerHardware();
  const isExecuting = getIsExecuting();
  const { appName, Icon } = getLedgerApp(name);

  return (
    <>
      {addresses.length ? (
        <AddressWrapper>
          <div className="heading">
            <h4>
              <Icon />
              <span>{appName}</span>
            </h4>
          </div>
          <div className="items">
            {addresses.map(({ address, index }: AnyJson, i: number) => (
              <Address key={i} address={address} index={index} />
            ))}
          </div>
          <div className="more">
            <ButtonText
              iconLeft={faArrowDown}
              text={isExecuting ? t('gettingAccount') : t('getAnotherAccount')}
              disabled={isExecuting}
              onClick={async () => {
                // re-pair the device if it has been disconnected.
                const paired = await pairDevice();
                if (paired) {
                  setIsExecuting(true);
                  handleLedgerLoop();
                }
              }}
            />
          </div>
        </AddressWrapper>
      ) : null}
    </>
  );
};
