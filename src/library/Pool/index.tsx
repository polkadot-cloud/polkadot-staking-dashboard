// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faProjectDiagram } from '@fortawesome/free-solid-svg-icons';
import { faCopy } from '@fortawesome/free-regular-svg-icons';
import { useModal } from 'contexts/Modal';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { useBondedPools } from 'contexts/Pools/BondedPools';
import { usePoolsTabs } from 'pages/Pools/Home/context';
import { useConnect } from 'contexts/Connect';
import {
  Wrapper,
  Labels,
  Separator,
  MenuPosition,
} from 'library/ListItem/Wrappers';
import { useMenu } from 'contexts/Menu';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { NotificationText } from 'contexts/Notifications/types';
import { useNotifications } from 'contexts/Notifications';
import { useStaking } from 'contexts/Staking';
import { useValidators } from 'contexts/Validators';
import { FavoritePool } from 'library/ListItem/Labels/FavoritePool';
import { useUi } from 'contexts/UI';
import { PoolBonded } from 'library/ListItem/Labels/PoolBonded';
import { PoolState } from 'contexts/Pools/types';
import { PoolIdentity } from 'library/ListItem/Labels/PoolIdentity';
import { useTranslation } from 'react-i18next';
import { PoolProps } from './types';
import { Members } from '../ListItem/Labels/Members';
import { JoinPool } from '../ListItem/Labels/JoinPool';
import { PoolId } from '../ListItem/Labels/PoolId';

export const Pool = (props: PoolProps) => {
  const { pool, batchKey, batchIndex } = props;
  const { memberCounter, addresses, id, state } = pool;
  const { t } = useTranslation('common');

  const { openModalWith } = useModal();
  const { activeAccount, isReadOnlyAccount } = useConnect();
  const { meta } = useBondedPools();
  const { isBonding } = useActivePools();
  const { addNotification } = useNotifications();
  const { eraStakers, getNominationsStatusFromTargets } = useStaking();
  const { validators } = useValidators();
  const { isSyncing } = useUi();

  // assumes component is under `PoolsTabsProvider` (Pools page)
  const { setActiveTab } = usePoolsTabs();
  const { setMenuPosition, setMenuItems, open }: any = useMenu();

  // get metadata from pools metabatch
  const nominations = meta[batchKey]?.nominations ?? [];

  // get pool targets from nominations metadata
  const targets = nominations[batchIndex]?.targets ?? [];

  // extract validator entries from pool targets
  const targetValidators = validators.filter((v: any) =>
    targets.includes(v.address)
  );

  const [nominationsStatus, setNominationsStatus] = useState<{
    [key: string]: string;
  } | null>(null);

  // update pool nomination status as nominations metadata becomes available.
  // we cannot add effect dependencies here as this needs to trigger
  // as soon as the component displays. (upon tab change).
  const handleNominationsStatus = () => {
    const _nominationStatus = getNominationsStatusFromTargets(
      addresses.stash,
      targets
    );
    setNominationsStatus(_nominationStatus);
  };

  // recalculate nominations status as app syncs
  useEffect(() => {
    if (
      nominationsStatus === null &&
      eraStakers.stakers.length &&
      nominations.length
    ) {
      handleNominationsStatus();
    }
  });

  // metadata has changed, which means pool items may have been added.
  // recalculate nominations status
  useEffect(() => {
    handleNominationsStatus();
  }, [meta]);

  // configure floating menu position
  const posRef = useRef(null);

  // copy address notification
  const notificationCopyAddress: NotificationText | null =
    addresses.stash == null
      ? null
      : {
          title: t('library.address_copied_to_clipboard'),
          subtitle: addresses.stash,
        };

  // consruct pool menu items
  const menuItems: Array<any> = [];

  // add view pool nominations button to menu
  menuItems.push({
    icon: <FontAwesomeIcon icon={faProjectDiagram as IconProp} />,
    wrap: null,
    title: `${t('library.view_pool_nominations')}`,
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
    icon: <FontAwesomeIcon icon={faCopy as IconProp} />,
    wrap: null,
    title: t('library.copy_pool_address'),
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
              <FavoritePool address={addresses.stash} />
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
          <PoolBonded pool={pool} batchIndex={batchIndex} batchKey={batchKey} />
          {!isSyncing &&
            state === PoolState.Open &&
            !isBonding() &&
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

export default Pool;
