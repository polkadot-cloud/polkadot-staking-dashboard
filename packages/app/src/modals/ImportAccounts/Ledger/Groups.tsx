// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faCheckCircle, faCircle } from '@fortawesome/free-regular-svg-icons'
import { faChevronDown, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { HardwareAccount } from '@w3ux/types'
import { useMenu } from 'contexts/Menu'
import type { MenuItem } from 'contexts/Menu/types'
import { MenuList } from 'library/Menu/List'
import type { MouseEvent as ReactMouseEvent } from 'react'
import { useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { ButtonMenu } from 'ui-buttons'
import { ButtonWrapper, GroupWrapper } from './Wrappers'

interface GroupsProps {
	activeGroup: number
	addressGroups: number[]
	groupedAddresses: Record<number, HardwareAccount[]>
	canAddGroup: boolean
	onGroupChange: (group: number) => void
	onAddGroup: () => void
}

export const Groups = ({
	activeGroup,
	addressGroups,
	groupedAddresses,
	canAddGroup,
	onGroupChange,
	onAddGroup,
}: GroupsProps) => {
	const { t } = useTranslation()
	const { openMenu, open } = useMenu()
	const dropdownButtonRef = useRef<HTMLDivElement>(null)

	const groupMenuItems = useMemo((): MenuItem[] => {
		const items: MenuItem[] = addressGroups.map((group) => {
			return {
				icon: (
					<FontAwesomeIcon
						icon={group === activeGroup ? faCheckCircle : faCircle}
						transform="shrink-3"
					/>
				),
				title: `${t('ledgerDevice', { ns: 'modals', group })}`,
				cb: () => onGroupChange(group),
			}
		})
		items.push({
			icon: <FontAwesomeIcon icon={faPlus} transform="shrink-3" />,
			title: t('newGroup', { ns: 'modals' }),
			cb: onAddGroup,
			disabled: !canAddGroup,
		})
		return items
	}, [
		addressGroups,
		groupedAddresses,
		activeGroup,
		t,
		onGroupChange,
		onAddGroup,
		canAddGroup,
	])

	const handleOpenGroupMenu = () => {
		if (!open && dropdownButtonRef.current) {
			const rect = dropdownButtonRef.current.getBoundingClientRect()
			const bodyRect = document.body.getBoundingClientRect()

			// Create a synthetic event with coordinates at the bottom-left corner of the button
			const syntheticEvent = {
				clientX: rect.left - bodyRect.left,
				clientY: rect.bottom - bodyRect.top + 3,
			} as ReactMouseEvent<HTMLButtonElement, MouseEvent>

			openMenu(syntheticEvent, <MenuList items={groupMenuItems} />)
		}
	}

	return (
		<GroupWrapper>
			<ButtonWrapper ref={dropdownButtonRef}>
				<ButtonMenu
					text={`${t('ledgerDevice', { ns: 'modals', group: activeGroup })}`}
					iconRight={faChevronDown}
					iconTransform="shrink-3"
					onClick={handleOpenGroupMenu}
				/>
			</ButtonWrapper>
		</GroupWrapper>
	)
}
