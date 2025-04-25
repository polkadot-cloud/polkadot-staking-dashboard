// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faBars, faShare, faUnlockAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useApi } from 'contexts/Api'
import { useMenu } from 'contexts/Menu'
import { useActivePool } from 'contexts/Pools/ActivePool'
import type { FetchedPoolMember } from 'contexts/Pools/PoolMembers/types'
import { usePrompt } from 'contexts/Prompt'
import { motion } from 'framer-motion'
import { Identity } from 'library/ListItem/Labels/Identity'
import { PoolMemberBonded } from 'library/ListItem/Labels/PoolMemberBonded'
import { Wrapper } from 'library/ListItem/Wrappers'
import { MenuList } from 'library/Menu/List'
import type { MouseEvent as ReactMouseEvent } from 'react'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import type { AnyJson } from 'types'
import { HeaderButtonRow, Separator } from 'ui-core/list'
import { UnbondMember } from '../Prompts/UnbondMember'
import { WithdrawMember } from '../Prompts/WithdrawMember'

export const Member = ({ member }: { member: FetchedPoolMember }) => {
  const { t } = useTranslation()
  const { activeEra } = useApi()
  const { openMenu, open } = useMenu()
  const { openPromptWith } = usePrompt()
  const { activePool, isOwner, isBouncer, getPoolRoles } = useActivePool()

  // Ref for the member container.
  const memberRef = useRef<HTMLDivElement | null>(null)

  const roles = getPoolRoles()
  const state = activePool?.bondedPool.state
  const { bouncer, root, depositor } = roles

  const canUnbondBlocked =
    state === 'Blocked' &&
    (isOwner() || isBouncer()) &&
    ![root, bouncer].includes(member.address)

  const canUnbondDestroying =
    state === 'Destroying' && member.address !== depositor

  const menuItems: AnyJson[] = []

  if (canUnbondBlocked || canUnbondDestroying) {
    const { points, unbondingEras } = member

    if (points !== 0n) {
      menuItems.push({
        icon: <FontAwesomeIcon icon={faUnlockAlt} transform="shrink-3" />,
        wrap: null,
        title: `${t('unbondFunds', { ns: 'pages' })}`,
        cb: () => {
          openPromptWith(<UnbondMember who={member.address} member={member} />)
        },
      })
    }

    if (Object.values(unbondingEras).length) {
      let canWithdraw = false
      for (const k of Object.keys(unbondingEras)) {
        if (activeEra.index > Number(k)) {
          canWithdraw = true
        }
      }

      if (canWithdraw) {
        menuItems.push({
          icon: <FontAwesomeIcon icon={faShare} transform="shrink-3" />,
          wrap: null,
          title: `${t('withdrawFunds', { ns: 'pages' })}`,
          cb: () => {
            openPromptWith(
              <WithdrawMember
                who={member.address}
                member={member}
                memberRef={memberRef}
              />
            )
          },
        })
      }
    }
  }

  // Handler for opening menu.
  const toggleMenu = (ev: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (!open) {
      openMenu(ev, <MenuList items={menuItems} />)
    }
  }

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
          <div className="row top">
            <Identity address={member.address} />
            <div>
              <HeaderButtonRow>
                {menuItems.length > 0 && (
                  <button
                    type="button"
                    className="label"
                    disabled={!member}
                    onClick={(ev) => toggleMenu(ev)}
                  >
                    <FontAwesomeIcon icon={faBars} />
                  </button>
                )}
              </HeaderButtonRow>
            </div>
          </div>
          <Separator />
          <div className="row bottom">
            <PoolMemberBonded member={member} />
          </div>
        </div>
      </Wrapper>
    </motion.div>
  )
}
