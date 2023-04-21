// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faGlasses } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { clipAddress } from '@polkadotcloud/utils';
import { useConnect } from 'contexts/Connect';
import { useExtensions } from 'contexts/Extensions';
import type { ExtensionInjected } from 'contexts/Extensions/types';
import { useModal } from 'contexts/Modal';
import { ReactComponent as LedgerIconSVG } from 'img/ledgerIcon.svg';
import { Identicon } from 'library/Identicon';
import { useTranslation } from 'react-i18next';
import { AccountWrapper } from './Wrappers';
import type { AccountItemProps } from './types';

export const AccountButton = ({
  meta,
  address,
  label,
  badge,
  disconnect = false,
  delegator,
}: AccountItemProps) => {
  const { t } = useTranslation('modals');
  const { setStatus } = useModal();
  const { extensions } = useExtensions();
  const { connectToAccount, disconnectFromAccount } = useConnect();

  const Icon =
    meta?.source === 'ledger'
      ? LedgerIconSVG
      : extensions.find((e: ExtensionInjected) => e.id === meta?.source)
          ?.icon ?? undefined;

  const imported = meta !== undefined && meta?.source !== 'external';

  return (
    <AccountWrapper>
      <button
        type="button"
        disabled={!disconnect && !imported}
        onClick={() => {
          if (imported && meta) {
            if (disconnect) {
              disconnectFromAccount();
            } else {
              connectToAccount(meta);
              setStatus(2);
            }
          }
        }}
      >
        <div>
          {delegator && (
            <div className="delegator">
              <Identicon value={delegator} size={26} />
            </div>
          )}
          <div className="identicon">
            <Identicon value={address ?? ''} size={26} />
          </div>
          <span className="name">
            &nbsp; {meta?.name ?? clipAddress(address ?? '')}
          </span>
          {badge && <span className="badge">{badge}</span>}
        </div>
        {!imported && (
          <div
            className="label warning"
            style={{ color: '#a17703', paddingLeft: '0.5rem' }}
          >
            {t('readOnly')}
          </div>
        )}

        <div className={label === undefined ? `` : label[0]}>
          {label !== undefined ? <h5>{label[1]}</h5> : null}
          {Icon !== undefined ? <Icon className="icon" /> : null}

          {!imported && (
            <FontAwesomeIcon
              icon={faGlasses}
              className="icon"
              style={{ opacity: 0.7 }}
            />
          )}
        </div>
      </button>
    </AccountWrapper>
  );
};
