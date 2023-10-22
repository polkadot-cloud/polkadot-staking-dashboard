// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
  faBars,
  faChartLine,
  faGlobe,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useMenu } from 'contexts/Menu';
import { CopyAddress } from 'library/ListItem/Labels/CopyAddress';
import { ParaValidator } from 'library/ListItem/Labels/ParaValidator';
import {
  Labels,
  MenuPosition,
  Separator,
  Wrapper,
} from 'library/ListItem/Wrappers';
import { useOverlay } from '@polkadot-cloud/react/hooks';
import { usePlugins } from 'contexts/Plugins';
import type { AnyJson } from 'types';
import { Quartile } from 'library/ListItem/Labels/Quartile';
import { useValidators } from '../../../contexts/Validators/ValidatorEntries';
import { useList } from '../../List/context';
import { Blocked } from '../../ListItem/Labels/Blocked';
import { Commission } from '../../ListItem/Labels/Commission';
import { EraStatus } from '../../ListItem/Labels/EraStatus';
import { FavoriteValidator } from '../../ListItem/Labels/FavoriteValidator';
import { Identity } from '../../ListItem/Labels/Identity';
import { Oversubscribed } from '../../ListItem/Labels/Oversubscribed';
import { Select } from '../../ListItem/Labels/Select';
import { getIdentityDisplay } from './Utils';
import type { ValidatorItemProps } from './types';
import { Pulse } from './Pulse';

export const Default = ({
  validator,
  toggleFavorites,
  showMenu,
  displayFor,
}: ValidatorItemProps) => {
  const { t } = useTranslation('library');
  const { selectActive } = useList();
  const { pluginEnabled } = usePlugins();
  const { openModal } = useOverlay().modal;
  const { setMenuPosition, setMenuItems, open } = useMenu();
  const { validatorIdentities, validatorSupers } = useValidators();

  const { address, prefs, validatorStatus, totalStake } = validator;
  const commission = prefs?.commission ?? null;

  const identity = getIdentityDisplay(
    validatorIdentities[address],
    validatorSupers[address]
  );

  // configure floating menu
  const posRef = useRef(null);
  const menuItems: AnyJson[] = [];
  menuItems.push({
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
  });

  if (pluginEnabled('polkawatch')) {
    menuItems.push({
      icon: <FontAwesomeIcon icon={faGlobe} transform="shrink-3" />,
      wrap: null,
      title: `${t('viewDecentralization')}`,
      cb: () => {
        openModal({
          key: 'ValidatorGeo',
          options: {
            address,
            identity,
          },
        });
      },
    });
  }

  const toggleMenu = () => {
    if (!open) {
      setMenuItems(menuItems);
      setMenuPosition(posRef);
    }
  };

  return (
    <Wrapper>
      <div className={`inner ${displayFor}`}>
        <MenuPosition ref={posRef} />
        <div className="row top">
          {selectActive && <Select item={validator} />}
          <Identity address={address} />
          <div>
            <Labels className={displayFor}>
              <CopyAddress address={address} />
              {toggleFavorites && <FavoriteValidator address={address} />}

              {/* restrict opening modal within a canvas */}
              {displayFor === 'default' && showMenu && (
                <div className="label">
                  <button type="button" onClick={() => toggleMenu()}>
                    <FontAwesomeIcon icon={faBars} transform="shrink-2" />
                  </button>
                </div>
              )}
            </Labels>
          </div>
        </div>
        <Separator />
        <div className="row bottom lg">
          <div>
            <Pulse address={address} displayFor={displayFor} />
          </div>
          <div>
            <Labels style={{ marginBottom: '0.9rem' }}>
              <Quartile address={address} />
              <Oversubscribed address={address} />
              <Blocked prefs={prefs} />
              <Commission commission={commission} />
              <ParaValidator address={address} />
            </Labels>
            <EraStatus
              address={address}
              status={validatorStatus}
              totalStake={totalStake}
              noMargin
            />
          </div>
        </div>
      </div>
    </Wrapper>
  );
};
