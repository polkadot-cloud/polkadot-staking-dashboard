// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useOutsideAlerter } from '@w3ux/hooks'
import classNames from 'classnames'
import { PageCategories } from 'config/pages'
import { useUi } from 'contexts/UI'
import { type Dispatch, type SetStateAction, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import classes from './index.module.scss'

export const CategoriesPopover = ({
	setOpen,
}: {
	setOpen: Dispatch<SetStateAction<boolean>>
}) => {
	const { t } = useTranslation('app')
	const navigate = useNavigate()
	const { activeSection, setActiveSection } = useUi()

	const popoverRef = useRef<HTMLDivElement>(null)

	// Close the menu if clicked outside of its container
	useOutsideAlerter(popoverRef, () => {
		setOpen(false)
	}, ['menu-categories'])

	return (
		<div ref={popoverRef}>
			<div className={classes.Inner}>
				{PageCategories.map((category) => {
					const allClasses = classNames(classes.Button, {
						[classes.active]: category.key === activeSection,
					})

					return (
						<button
							type="button"
							onClick={() => {
								setOpen(false)
								setActiveSection(category.key)
								navigate(category.defaultRoute)
							}}
							className={allClasses}
							key={category.id}
						>
							{t(category.key)}
						</button>
					)
				})}
			</div>
		</div>
	)
}
