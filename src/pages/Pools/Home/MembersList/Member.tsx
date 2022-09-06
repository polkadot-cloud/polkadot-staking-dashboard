// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useRef } from 'react';
import { usePoolMembers } from 'contexts/Pools/PoolMembers';
import { useList } from 'library/List/context';
import { Identity } from 'library/ListItem/Labels/Identity';
import { Select } from 'library/ListItem/Labels/Select';
import {
  Wrapper,
  Labels,
  Separator,
  MenuPosition,
} from 'library/ListItem/Wrappers';
import { PoolMemberBonded } from 'library/ListItem/Labels/PoolMemberBonded';
import { useMenu } from 'contexts/Menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars,
  faShare,
  faUnlockAlt,
} from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { useModal } from 'contexts/Modal';
import { useActivePool } from 'contexts/Pools/ActivePool';
import { PoolState } from 'contexts/Pools/types';
import { useNetworkMetrics } from 'contexts/Network';

export const Member = (props: any) => {
  const { meta } = usePoolMembers();
  const { openModalWith } = useModal();
  const { selectActive } = useList();
  const { metrics } = useNetworkMetrics();
  const { activeBondedPool, isOwner, isStateToggler } = useActivePool();
  const { setMenuPosition, setMenuItems, open }: any = useMenu();
  const { activeEra } = metrics;
  const { state, roles } = activeBondedPool || {};

  const { member, batchKey, batchIndex } = props;
  const { who, unbondingEras, points } = member;
  const { stateToggler, root, depositor } = roles || {};

  // configure floating menu
  const posRef = useRef(null);
  const menuItems: Array<any> = [];

  const canUnbondBlocked =
    state === PoolState.Block &&
    (isOwner() || isStateToggler()) &&
    ![root, stateToggler].includes(who);

  const canUnbondDestroying = state === PoolState.Destroy && who !== depositor;

  if (canUnbondBlocked || canUnbondDestroying) {
    if (points !== '0') {
      menuItems.push({
        icon: <FontAwesomeIcon icon={faUnlockAlt as IconProp} />,
        wrap: null,
        title: `Unbond Funds`,
        cb: () => {
          openModalWith(
            'UnbondPoolMember',
            {
              member,
            },
            'small'
          );
        },
      });
    }

    if (Object.values(unbondingEras).length) {
      let canWithdraw = false;

      for (const k of Object.keys(unbondingEras)) {
        if (Number(k) > Number(activeEra.index)) {
          canWithdraw = true;
        }
      }

      if (canWithdraw) {
        menuItems.push({
          icon: <FontAwesomeIcon icon={faShare as IconProp} />,
          wrap: null,
          title: `Withdraw Funds`,
          cb: () => {
            openModalWith('WithdrawPoolMember', { member }, 'small');
          },
        });
      }
    }
  }

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
          {selectActive && <Select item={member} />}
          <Identity
            meta={meta}
            address={who}
            batchIndex={batchIndex}
            batchKey={batchKey}
          />
          <div>
            <Labels>
              {menuItems.length > 0 && (
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
          <PoolMemberBonded member={member} />
        </div>
      </div>
    </Wrapper>
  );
};
