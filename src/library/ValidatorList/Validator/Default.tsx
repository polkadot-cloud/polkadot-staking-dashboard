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
import { Wrapper, Labels, MenuPosition } from './Wrappers';
import { useValidators } from '../../../contexts/Validators';
import { getIdentityDisplay } from './Utils';
import { Favourite } from './Labels/Favourite';
import { Identity } from './Labels/Identity';
import { Oversubscribed } from './Labels/Oversubscribed';
import { Blocked } from './Labels/Blocked';
import { useValidatorList } from '../context';

export const Default = (props: any) => {
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
  const { selectActive, addToSelected, removeFromSelected, selected } =
    useValidatorList();

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
  const notificationCopyAddress =
    address == null
      ? {}
      : {
          title: 'Address Copied to Clipboard',
          subtitle: address,
        };

  const menuItems: any = [
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
        addNotification(notificationCopyAddress);
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
          {selectActive && (
            <input
              type="checkbox"
              onClick={() => {
                if (selected.includes(validator)) {
                  removeFromSelected([validator]);
                } else {
                  addToSelected(validator);
                }
              }}
            />
          )}
          <Identity
            validator={validator}
            batchIndex={batchIndex}
            batchKey={batchKey}
          />
          <div>
            <Labels>
              <Oversubscribed batchIndex={batchIndex} batchKey={batchKey} />
              <Blocked prefs={prefs} />
              <div className="label comm">{commission}%</div>
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
