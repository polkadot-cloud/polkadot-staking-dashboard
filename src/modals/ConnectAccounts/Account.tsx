// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { useBalances } from 'contexts/Balances';
import Identicon from 'library/Identicon';
import { clipAddress, planckBnToUnit } from 'Utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGlasses,
  faLockOpen,
  faMoneyCheck,
  faUserCog,
  faUsersSlash,
  faCheckToSlot,
} from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { Extension } from 'contexts/Connect/types';
import { useApi } from 'contexts/Api';
import { useActivePool } from 'contexts/Pools/ActivePool';
import BN from 'bn.js';
import { useNetworkMetrics } from 'contexts/Network';
import { useStaking } from 'contexts/Staking';
import { AccountWrapper } from './Wrappers';
import { AccountElementProps } from './types';

export const AccountElement = (props: AccountElementProps) => {
  return (
    <AccountWrapper>
      <div>
        <AccountInner {...props} />
      </div>
    </AccountWrapper>
  );
};

export const AccountButton = (props: AccountElementProps) => {
  const { meta } = props;
  const disconnect = props.disconnect ?? false;
  const { connectToAccount, disconnectFromAccount } = useConnect();
  const { setStatus } = useModal();
  const imported = meta !== null;

  return (
    <AccountWrapper>
      <button
        type="button"
        disabled={!disconnect && !imported}
        onClick={() => {
          if (imported) {
            if (disconnect) {
              disconnectFromAccount();
            } else {
              connectToAccount(meta);
              setStatus(0);
            }
          }
        }}
      >
        <AccountInner {...props} />
      </button>
    </AccountWrapper>
  );
};

export const AccountInner = (props: AccountElementProps) => {
  const { address, meta } = props;

  const { extensions } = useConnect();
  const extension = extensions.find((e: Extension) => e.id === meta?.source);
  const Icon = extension?.icon ?? null;
  const label = props.label ?? null;
  const source = meta?.source ?? null;
  const imported = meta !== null && source !== 'external';

  const { network } = useApi();
  const { units } = network;
  const { getAccountBalance } = useBalances();
  const balance = getAccountBalance(address);
  const { free } = balance;
  const freeBase = planckBnToUnit(free, units);

  const { getLedgerForStash } = useBalances();
  const { getPoolUnlocking, isOwner, activeBondedPool } = useActivePool();
  const withUnlocking =
    getLedgerForStash(address).unlocking.length > 0 ||
    getPoolUnlocking().length > 0;

  const { metrics } = useNetworkMetrics();
  const { activeEra } = metrics;
  const unlocking = getLedgerForStash(address).unlocking;
  let withdrawAvailable = new BN(0);
  for (const _chunk of unlocking) {
    const { era, value } = _chunk;
    const left = era - activeEra.index;
    if (left <= 0) {
      withdrawAvailable = withdrawAvailable.add(value);
    }
  }
  const avaliableToWithdraw = withdrawAvailable.toNumber() > 0;

  const { getNominationsStatus } = useStaking();
  const nominationStatuses = getNominationsStatus();
  const active = Object.values(nominationStatuses).filter(
    (_v) => _v === 'active'
  ).length;

  const { unclaimedReward } = activeBondedPool || {};
  return (
    <>
      <div>
        <Identicon value={address ?? ''} size={26} />
        <span className="name">
          &nbsp; {meta?.name ?? clipAddress(address ?? '')}
          <>&nbsp; {freeBase}</>
        </span>
      </div>
      {!imported && (
        <div
          className="label warning"
          style={{ color: '#a17703', paddingLeft: '0.5rem' }}
        >
          Read Only
        </div>
      )}

      <div>
        {withUnlocking && (
          <FontAwesomeIcon
            icon={faLockOpen as IconProp}
            className="icon"
            style={{ opacity: 0.7 }}
          />
        )}
        {avaliableToWithdraw && (
          <FontAwesomeIcon
            icon={faCheckToSlot as IconProp}
            className="icon"
            style={{ opacity: 0.7 }}
          />
        )}
        {!active && (
          <FontAwesomeIcon
            icon={faUsersSlash as IconProp}
            className="icon"
            style={{ opacity: 0.7 }}
          />
        )}
        {isOwner() && (
          <FontAwesomeIcon
            icon={faUserCog as IconProp}
            className="icon"
            style={{ opacity: 0.7 }}
          />
        )}
        {unclaimedReward && (
          <FontAwesomeIcon
            icon={faMoneyCheck as IconProp}
            className="icon"
            style={{ opacity: 0.7 }}
          />
        )}
      </div>
      <div className={label === null ? `` : label[0]}>
        {label !== null && <h5>{label[1]}</h5>}
        {Icon !== null && <Icon className="icon" />}

        {!imported && (
          <FontAwesomeIcon
            icon={faGlasses as IconProp}
            className="icon"
            style={{ opacity: 0.7 }}
          />
        )}
      </div>
    </>
  );
};
