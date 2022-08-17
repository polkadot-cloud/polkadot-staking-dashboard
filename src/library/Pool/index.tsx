// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars,
  faPlusCircle,
  faProjectDiagram,
} from '@fortawesome/free-solid-svg-icons';
import { faCopy } from '@fortawesome/free-regular-svg-icons';
import { useModal } from 'contexts/Modal';
import { useActivePool } from 'contexts/Pools/ActivePool';
import { clipAddress } from 'Utils';
import Identicon from 'library/Identicon';
import { u8aToString, u8aUnwrapBytes } from '@polkadot/util';
import { useBondedPools } from 'contexts/Pools/BondedPools';
import { usePoolsTabs } from 'pages/Pools/context';
import { useConnect } from 'contexts/Connect';
import {
  Wrapper,
  Labels,
  Separator,
  MenuPosition,
  IdentityWrapper,
  NominationStatusWrapper,
} from 'library/ListItem/Wrappers';
import { useMenu } from 'contexts/Menu';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { NotificationText } from 'contexts/Notifications/types';
import { useNotifications } from 'contexts/Notifications';
import { useStaking } from 'contexts/Staking';
import { PoolProps } from './types';
import { Members } from '../ListItem/Labels/Members';
import { PoolId } from '../ListItem/Labels/PoolId';

export const Pool = (props: PoolProps) => {
  const { pool, batchKey, batchIndex } = props;
  const { memberCounter, addresses, id } = pool;
  const { openModalWith } = useModal();
  const { activeAccount, isReadOnlyAccount } = useConnect();
  const { meta } = useBondedPools();
  const { isBonding } = useActivePool();
  const { addNotification } = useNotifications();
  const { eraStakers, getNominationsStatusFromTargets } = useStaking();

  // assumes component is under `PoolsTabsProvider` (Pools page)
  const { setActiveTab } = usePoolsTabs();
  const { setMenuPosition, setMenuItems, open }: any = useMenu();

  // get metadata from pools metabatch
  const metadata = meta[batchKey]?.metadata ?? [];
  const nominations = meta[batchKey]?.nominations ?? [];

  // get pool targets from nominations metadata
  const targets = nominations[batchIndex]?.targets ?? [];

  // aggregate synced status
  const metadataSynced = metadata.length > 0 ?? false;

  // display value
  const defaultDisplay = clipAddress(addresses.stash);

  // fallback to address on empty metadata string
  let display = metadata[batchIndex] ?? defaultDisplay;
  // check if super identity has been byte encoded
  const displayAsBytes = u8aToString(u8aUnwrapBytes(display));
  if (displayAsBytes !== '') {
    display = displayAsBytes;
  }
  // if still empty string, default to clipped address
  if (display === '') {
    display = defaultDisplay;
  }

  const [nominationsStatus, setNominationsStatus] = useState(null);

  // update pool nomination status as nominations metadata becomes available.
  // we cannot add effect dependencies here as this needs to trigger
  // as soon as the component displays. (upon tab change).
  useEffect(() => {
    if (
      nominationsStatus === null &&
      eraStakers.stakers.length &&
      nominations.length
    ) {
      const _nominationStatus = getNominationsStatusFromTargets(
        addresses.stash,
        targets
      );
      setNominationsStatus(_nominationStatus);
    }
  });

  // configure floating menu position
  const posRef = useRef(null);

  // copy address notification
  const notificationCopyAddress: NotificationText | null =
    addresses.stash == null
      ? null
      : {
          title: 'Address Copied to Clipboard',
          subtitle: addresses.stash,
        };

  // consruct pool menu items
  const menuItems: Array<any> = [];

  // add join pool button to menu if user is not already in a pool, and not ready only
  if (!isBonding() && !isReadOnlyAccount(activeAccount) && activeAccount) {
    menuItems.push({
      icon: (
        <FontAwesomeIcon icon={faPlusCircle as IconProp} transform="grow-4" />
      ),
      wrap: null,
      title: `Join Pool`,
      cb: () =>
        openModalWith(
          'JoinPool',
          {
            id,
            setActiveTab,
          },
          'small'
        ),
    });
  }

  // add view pool nominations button to menu
  menuItems.push({
    icon: <FontAwesomeIcon icon={faProjectDiagram as IconProp} />,
    wrap: null,
    title: `View Pool Nominations`,
    cb: () => {
      /* TODO: pool nominations modal */
    },
  });

  // add copy pool address button to menu
  menuItems.push({
    icon: <FontAwesomeIcon icon={faCopy as IconProp} />,
    wrap: null,
    title: `Copy Pool Address`,
    cb: () => {
      navigator.clipboard.writeText(addresses.stash);
      if (notificationCopyAddress) {
        addNotification(notificationCopyAddress);
      }
    },
  });

  // toggle menu handler
  const toggleMenu = () => {
    if (!open) {
      setMenuItems(menuItems);
      setMenuPosition(posRef);
    }
  };

  // configure nominations status
  // TODO.

  return (
    <Wrapper format="nomination">
      <div className="inner">
        <MenuPosition ref={posRef} />
        <div className="row">
          <IdentityWrapper className="identity">
            <Identicon value={addresses.stash} size={26} />
            <div className="inner">
              {!metadataSynced ? (
                <h4>{clipAddress(addresses.stash)}</h4>
              ) : (
                <h4>{display}</h4>
              )}
            </div>
          </IdentityWrapper>
          <div>
            <Labels>
              <PoolId id={id} />
              <Members members={memberCounter} />
              <button
                type="button"
                className="label"
                onClick={() => toggleMenu()}
              >
                <FontAwesomeIcon icon={faBars} />
              </button>
            </Labels>
          </div>
        </div>
        <Separator />
        <div className="row status">
          <NominationStatusWrapper status="waiting">
            <h5>
              {nominationsStatus === null
                ? `Syncing...`
                : `Some status to display`}
            </h5>
          </NominationStatusWrapper>
        </div>
      </div>
    </Wrapper>
  );
};

export default Pool;
