// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faCopy } from '@fortawesome/free-regular-svg-icons';
import { faBars, faProjectDiagram } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useConnect } from 'contexts/Connect';
import { useMenu } from 'contexts/Menu';
import { useModal } from 'contexts/Modal';
import { useNotifications } from 'contexts/Notifications';
import type { NotificationText } from 'contexts/Notifications/types';
import { useBondedPools } from 'contexts/Pools/BondedPools';
import { usePoolMemberships } from 'contexts/Pools/PoolMemberships';
import { useUi } from 'contexts/UI';
import { useValidators } from 'contexts/Validators';
import { usePoolCommission } from 'library/Hooks/usePoolCommission';
import { FavoritePool } from 'library/ListItem/Labels/FavoritePool';
import { PoolBonded } from 'library/ListItem/Labels/PoolBonded';
import { PoolCommission } from 'library/ListItem/Labels/PoolCommission';
import { PoolIdentity } from 'library/ListItem/Labels/PoolIdentity';
import {
  Labels,
  MenuPosition,
  Separator,
  Wrapper,
} from 'library/ListItem/Wrappers';
import { usePoolsTabs } from 'pages/Pools/Home/context';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { JoinPool } from '../ListItem/Labels/JoinPool';
import { Members } from '../ListItem/Labels/Members';
import { PoolId } from '../ListItem/Labels/PoolId';
import type { PoolProps } from './types';

export const Pool = ({ pool, batchKey, batchIndex }: PoolProps) => {
  const { t } = useTranslation('library');
  const { memberCounter, addresses, id, state } = pool;
  const { openModalWith } = useModal();
  const { activeAccount, isReadOnlyAccount } = useConnect();
  const { meta } = useBondedPools();
  const { membership } = usePoolMemberships();
  const { addNotification } = useNotifications();
  const { validators } = useValidators();
  const { isPoolSyncing } = useUi();
  const { setActiveTab } = usePoolsTabs();
  const { setMenuPosition, setMenuItems, open }: any = useMenu();
  const { getCommission } = usePoolCommission(id);

  const currentCommission = getCommission();

  // get metadata from pools metabatch
  const nominations = meta[batchKey]?.nominations ?? [];

  // get pool targets from nominations metadata
  const targets = nominations[batchIndex]?.targets ?? [];

  // extract validator entries from pool targets
  const targetValidators = validators.filter((v: any) =>
    targets.includes(v.address)
  );

  // configure floating menu position
  const posRef = useRef(null);

  // copy address notification
  const notificationCopyAddress: NotificationText | null =
    addresses.stash == null
      ? null
      : {
          title: t('addressCopiedToClipboard'),
          subtitle: addresses.stash,
        };

  // consruct pool menu items
  const menuItems: any[] = [];

  // add view pool nominations button to menu
  menuItems.push({
    icon: <FontAwesomeIcon icon={faProjectDiagram} transform="shrink-3" />,
    wrap: null,
    title: `${t('viewPoolNominations')}`,
    cb: () => {
      openModalWith(
        'PoolNominations',
        {
          nominator: addresses.stash,
          targets: targetValidators,
        },
        'large'
      );
    },
  });

  // add copy pool address button to menu
  menuItems.push({
    icon: <FontAwesomeIcon icon={faCopy} transform="shrink-3" />,
    wrap: null,
    title: t('copyPoolAddress'),
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

  return (
    <Wrapper format="nomination">
      <div className="inner">
        <MenuPosition ref={posRef} />
        <div className="row">
          <PoolIdentity
            batchKey={batchKey}
            batchIndex={batchIndex}
            pool={pool}
          />
          <div>
            <Labels>
              {currentCommission && (
                <PoolCommission commission={currentCommission} />
              )}
              <PoolId id={id} />
              <Members members={memberCounter} />
              <FavoritePool address={addresses.stash} />
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
          <PoolBonded pool={pool} batchIndex={batchIndex} batchKey={batchKey} />
          {!isPoolSyncing &&
            state === 'Open' &&
            !membership &&
            !isReadOnlyAccount(activeAccount) &&
            activeAccount && (
              <Labels>
                <JoinPool id={id} setActiveTab={setActiveTab} />
              </Labels>
            )}
        </div>
      </div>
    </Wrapper>
  );
};
