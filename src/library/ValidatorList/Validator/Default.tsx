// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faCopy } from '@fortawesome/free-regular-svg-icons';
import { faBars, faChartLine } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useMenu } from 'contexts/Menu';
import { useNotifications } from 'contexts/Notifications';
import type { NotificationText } from 'contexts/Notifications/types';
import { CopyAddress } from 'library/ListItem/Labels/CopyAddress';
import { ParaValidator } from 'library/ListItem/Labels/ParaValidator';
import {
  Labels,
  MenuPosition,
  Separator,
  Wrapper,
} from 'library/ListItem/Wrappers';
import { useOverlay } from 'contexts/Overlay';
import { useValidators } from '../../../contexts/Validators';
import { useList } from '../../List/context';
import { Blocked } from '../../ListItem/Labels/Blocked';
import { Commission } from '../../ListItem/Labels/Commission';
import { EraStatus } from '../../ListItem/Labels/EraStatus';
import { FavoriteValidator } from '../../ListItem/Labels/FavoriteValidator';
import { Identity } from '../../ListItem/Labels/Identity';
import { Oversubscribed } from '../../ListItem/Labels/Oversubscribed';
import { Select } from '../../ListItem/Labels/Select';
import { getIdentityDisplay } from './Utils';
import type { DefaultProps } from './types';

export const Default = ({
  validator,
  toggleFavorites,
  showMenu,
  inModal,
}: DefaultProps) => {
  const { t } = useTranslation('library');
  const { selectActive } = useList();
  const { openModal } = useOverlay().modal;
  const { addNotification } = useNotifications();
  const { setMenuPosition, setMenuItems, open }: any = useMenu();
  const { validatorIdentities, validatorSupers } = useValidators();

  const { address, prefs } = validator;
  const commission = prefs?.commission ?? null;

  const identity = getIdentityDisplay(
    validatorIdentities[address],
    validatorSupers[address]
  );

  // copy address notification.
  const notificationCopyAddress: NotificationText | null =
    address == null
      ? null
      : {
          title: t('addressCopiedToClipboard'),
          subtitle: address,
        };

  // configure floating menu
  const posRef = useRef(null);
  const menuItems = [
    {
      icon: <FontAwesomeIcon icon={faChartLine} transform="shrink-3" />,
      wrap: null,
      title: `${t('viewMetrics')}`,
      cb: () => {
        openModal({
          key: 'ValidatorMetrics',
          options: {
            address,
            identity,
          },
        });
      },
    },
    {
      icon: <FontAwesomeIcon icon={faCopy} transform="shrink-3" />,
      wrap: null,
      title: `${t('copyAddress')}`,
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
    <Wrapper $format="nomination" $inModal={inModal}>
      <div className="inner">
        <MenuPosition ref={posRef} />
        <div className="row">
          {selectActive && <Select item={validator} />}
          <Identity address={address} />
          <div>
            <Labels>
              <Oversubscribed address={address} />
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
                <CopyAddress address={address} />
              </Labels>
            </>
          )}
        </div>
      </div>
    </Wrapper>
  );
};
