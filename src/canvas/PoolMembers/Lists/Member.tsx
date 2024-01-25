// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
  faBars,
  faShare,
  faUnlockAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useMenu } from 'contexts/Menu';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { usePoolMembers } from 'contexts/Pools/PoolMembers';
import { useList } from 'library/List/context';
import { Identity } from 'library/ListItem/Labels/Identity';
import { PoolMemberBonded } from 'library/ListItem/Labels/PoolMemberBonded';
import { Select } from 'library/ListItem/Labels/Select';
import {
  Labels,
  MenuPosition,
  Separator,
  Wrapper,
} from 'library/ListItem/Wrappers';
import type { AnyJson } from 'types';
import { usePrompt } from 'contexts/Prompt';
import { UnbondMember } from '../Prompts/UnbondMember';
import { WithdrawMember } from '../Prompts/WithdrawMember';
import { motion } from 'framer-motion';
import { useApi } from 'contexts/Api';

export const Member = ({
  who,
  batchKey,
  batchIndex,
}: {
  who: string;
  batchKey: string;
  batchIndex: number;
}) => {
  const { t } = useTranslation();
  const { activeEra } = useApi();
  const { meta } = usePoolMembers();
  const { selectActive } = useList();
  const { openPromptWith } = usePrompt();
  const { setMenuPosition, setMenuItems, open } = useMenu();
  const { selectedActivePool, isOwner, isBouncer } = useActivePools();

  // Ref for the member container.
  const memberRef = useRef<HTMLDivElement>(null);

  const { state, roles } = selectedActivePool?.bondedPool || {};
  const { bouncer, root, depositor } = roles || {};

  const canUnbondBlocked =
    state === 'Blocked' &&
    (isOwner() || isBouncer()) &&
    ![root, bouncer].includes(who);

  const canUnbondDestroying = state === 'Destroying' && who !== depositor;
  const poolMembers = meta[batchKey]?.poolMembers ?? [];
  const member = poolMembers[batchIndex] ?? null;

  const menuItems: AnyJson[] = [];

  menuItems.push({
    icon: <FontAwesomeIcon icon={faUnlockAlt} transform="shrink-3" />,
    wrap: null,
    title: `${t('pools.withdrawFunds', { ns: 'pages' })}`,
    cb: () => {
      openPromptWith(<UnbondMember who={who} member={member} />);
    },
  });

  if (member && (canUnbondBlocked || canUnbondDestroying)) {
    const { points, unbondingEras } = member;

    if (points !== '0') {
      menuItems.push({
        icon: <FontAwesomeIcon icon={faUnlockAlt} transform="shrink-3" />,
        wrap: null,
        title: `${t('pools.unbondFunds', { ns: 'pages' })}`,
        cb: () => {
          openPromptWith(<UnbondMember who={who} member={member} />);
        },
      });
    }

    if (Object.values(unbondingEras).length) {
      let canWithdraw = false;
      for (const k of Object.keys(unbondingEras)) {
        if (activeEra.index.isGreaterThan(Number(k))) {
          canWithdraw = true;
        }
      }

      if (canWithdraw) {
        menuItems.push({
          icon: <FontAwesomeIcon icon={faShare} transform="shrink-3" />,
          wrap: null,
          title: `${t('pools.withdrawFunds', { ns: 'pages' })}`,
          cb: () => {
            openPromptWith(
              <WithdrawMember who={who} member={member} memberRef={memberRef} />
            );
          },
        });
      }
    }
  }

  // configure floating menu
  const posRef = useRef(null);
  const toggleMenu = () => {
    if (!open) {
      setMenuItems(menuItems);
      setMenuPosition(posRef);
    }
  };

  return (
    <motion.div
      className={`item col`}
      ref={memberRef}
      variants={{
        hidden: {
          y: 15,
          opacity: 0,
        },
        show: {
          y: 0,
          opacity: 1,
        },
      }}
    >
      <Wrapper className="member">
        <div className="inner canvas">
          <MenuPosition ref={posRef} />
          <div className="row top">
            {selectActive && <Select item={{ address: who }} />}
            <Identity address={who} />
            <div>
              <Labels>
                {menuItems.length > 0 && (
                  <button
                    type="button"
                    className="label"
                    disabled={!member}
                    onClick={() => toggleMenu()}
                  >
                    <FontAwesomeIcon icon={faBars} />
                  </button>
                )}
              </Labels>
            </div>
          </div>
          <Separator />
          <div className="row bottom">
            <PoolMemberBonded
              meta={meta}
              batchKey={batchKey}
              batchIndex={batchIndex}
            />
          </div>
        </div>
      </Wrapper>
    </motion.div>
  );
};
