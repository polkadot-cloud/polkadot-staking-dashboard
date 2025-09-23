// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useOutsideAlerter } from '@w3ux/hooks'
import classNames from 'classnames'
import { PageCategories } from 'config/pages'
import { usePageFromHash } from 'hooks/usePageFromHash'
import { type Dispatch, type SetStateAction, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import type { NavSection } from 'types'
import classes from './index.module.scss'

export const CategoriesPopover = ({
	setOpen,
	setLocalCategory,
}: {
	setOpen: Dispatch<SetStateAction<boolean>>
	setLocalCategory: Dispatch<SetStateAction<NavSection>>
}) => {
	const { t } = useTranslation('app')
	const navigate = useNavigate()
	const { categoryKey } = usePageFromHash()

	const popoverRef = useRef<HTMLDivElement>(null)

	// Close the menu if clicked outside of its container
	useOutsideAlerter(popoverRef, () => {
		setOpen(false)
	}, ['menu-categories'])

	return (
		<div ref={popoverRef}>
			<div className={classes.inner}>
				{PageCategories.map((category) => {
					const allClasses = classNames(classes.button, {
						[classes.active]: category.key === categoryKey,
					})

					return (
						<button
							type="button"
							onClick={() => {
								setOpen(false)
								setLocalCategory(category.key)
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
