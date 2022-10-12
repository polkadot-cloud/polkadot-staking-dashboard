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
import {
  Wrapper,
  Labels,
  MenuPosition,
  Separator,
} from 'library/ListItem/Wrappers';
import CopyAddress from 'library/ListItem/Labels/CopyAddress';
import { ParaValidator } from 'library/ListItem/Labels/ParaValidator';
import { useTranslation } from 'react-i18next';
import { useValidators } from '../../../contexts/Validators';
import { getIdentityDisplay } from './Utils';
import { FavoriteValidator } from '../../ListItem/Labels/FavoriteValidator';
import { Identity } from '../../ListItem/Labels/Identity';
import { Oversubscribed } from '../../ListItem/Labels/Oversubscribed';
import { Blocked } from '../../ListItem/Labels/Blocked';
import { Commission } from '../../ListItem/Labels/Commission';
import { Select } from '../../ListItem/Labels/Select';
import { EraStatus } from '../../ListItem/Labels/EraStatus';
import { useList } from '../../List/context';
import { DefaultProps } from './types';

export const Default = (props: DefaultProps) => {
  const {
    validator,
    toggleFavorites,
    batchIndex,
    batchKey,
    showMenu,
    inModal,
  } = props;

  const { openModalWith } = useModal();
  const { addNotification } = useNotifications();
  const { setMenuPosition, setMenuItems, open }: any = useMenu();
  const { meta } = useValidators();
  const { selectActive } = useList();
  const { t } = useTranslation('common');

  const identities = meta[batchKey]?.identities ?? [];
  const supers = meta[batchKey]?.supers ?? [];

  const { address, prefs } = validator;
  const commission = prefs?.commission ?? null;

  const identity = getIdentityDisplay(
    identities[batchIndex],
    supers[batchIndex]
  );

  // copy address notification
  const notificationCopyAddress: NotificationText | null =
    address == null
      ? null
      : {
          title: t('library.address_copied_to_clipboard'),
          subtitle: address,
        };

  // configure floating menu
  const posRef = useRef(null);
  const menuItems = [
    {
      icon: <FontAwesomeIcon icon={faChartLine as IconProp} />,
      wrap: null,
      title: t('library.view_metrics'),
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
      title: t('library.copy_address'),
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
    <Wrapper format="nomination" inModal={inModal}>
      <div className="inner">
        <MenuPosition ref={posRef} />
        <div className="row">
          {selectActive && <Select item={validator} />}
          <Identity
            meta={meta}
            address={address}
            batchIndex={batchIndex}
            batchKey={batchKey}
          />
          <div>
            <Labels>
              <Oversubscribed batchIndex={batchIndex} batchKey={batchKey} />
              <Blocked prefs={prefs} />
              <Commission commission={commission} />
              <ParaValidator address={address} />

              {toggleFavorites && <FavoriteValidator address={address} />}
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
        <Separator />
        <div className="row status">
          <EraStatus address={address} />
          {inModal && (
            <>
              <Labels>
                <CopyAddress validator={validator} />
              </Labels>
            </>
          )}
        </div>
      </div>
    </Wrapper>
  );
};

export default Default;
