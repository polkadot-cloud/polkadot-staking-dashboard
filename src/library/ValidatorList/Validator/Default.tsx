// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useRef } from 'react';
import { faBars, faChartLine } from '@fortawesome/free-solid-svg-icons';
import { faCopy } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMenu } from 'contexts/Menu';
import { useNotifications } from 'contexts/Notifications';
import { useModal } from 'contexts/Modal';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { NotificationText } from 'contexts/Notifications/types';
import { Wrapper, Labels, MenuPosition } from './Wrappers';
import { useValidators } from '../../../contexts/Validators';
import { getIdentityDisplay } from './Utils';
import { Favourite } from './Labels/Favourite';
import { Identity } from './Labels/Identity';
import { Oversubscribed } from './Labels/Oversubscribed';
import { Blocked } from './Labels/Blocked';
import { Commission } from './Labels/Commission';
import { Select } from './Labels/Select';
import { useValidatorList } from '../context';
import { DefaultProps } from './types';

export const Default = (props: DefaultProps) => {
  const {
    validator,
    toggleFavourites,
    batchIndex,
    batchKey,
    showStatus,
    showMenu,
  } = props;

  const { openModalWith } = useModal();
  const { addNotification } = useNotifications();
  const { setMenuPosition, setMenuItems, open }: any = useMenu();
  const { meta } = useValidators();
  const { selectActive } = useValidatorList();

  const identities = meta[batchKey]?.identities ?? [];
  const supers = meta[batchKey]?.supers ?? [];

  const { address, prefs } = validator;
  const commission = prefs?.commission ?? null;

  const posRef = useRef(null);

  const identity = getIdentityDisplay(
    identities[batchIndex],
    supers[batchIndex]
  );

  // copy address notification
  const notificationCopyAddress: NotificationText | null =
    address == null
      ? null
      : {
          title: 'Address Copied to Clipboard',
          subtitle: address,
        };

  const menuItems = [
    {
      icon: <FontAwesomeIcon icon={faChartLine as IconProp} />,
      wrap: null,
      title: `View Metrics`,
      cb: () => {
        openModalWith(
          'ValidatorMetrics',
          {
            address,
            identity,
          },
          'large'
        );
      },
    },
    {
      icon: <FontAwesomeIcon icon={faCopy as IconProp} />,
      wrap: null,
      title: `Copy Address`,
      cb: () => {
        navigator.clipboard.writeText(address);
        if (notificationCopyAddress) {
          addNotification(notificationCopyAddress);
        }
      },
    },
  ];

  const toggleMenu = () => {
    if (!open) {
      setMenuItems(menuItems);
      setMenuPosition(posRef);
    }
  };

  return (
    <Wrapper showStatus={showStatus}>
      <div className="inner">
        <MenuPosition ref={posRef} />
        <div className="row">
          {selectActive && <Select validator={validator} />}
          <Identity
            validator={validator}
            batchIndex={batchIndex}
            batchKey={batchKey}
          />
          <div>
            <Labels>
              <Oversubscribed batchIndex={batchIndex} batchKey={batchKey} />
              <Blocked prefs={prefs} />
              <Commission commission={commission} />
              {toggleFavourites && <Favourite address={address} />}
              {showMenu && (
                <button
                  type="button"
                  className="label"
                  onClick={() => toggleMenu()}
                >
                  <FontAwesomeIcon icon={faBars} />
                </button>
              )}
            </Labels>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default Default;
