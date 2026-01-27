// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useOnResize } from '@w3ux/hooks'
import { setStateWithRef } from '@w3ux/utils'
import { useEffect, useRef, useState } from 'react'
import { Items } from './Items'
import styles from './index.module.scss'
import { PageToggle } from './PageToggle'
import { Syncing } from './Syncing'
import type { TipsProps } from './types'

export const Tips = ({
	items,
	syncing,
	onPageReset: { network, activeAddress },
	onUpdate,
}: TipsProps) => {
	// Helper function to determine which page we should be on upon page resize. This function ensures
	// totalPages is never surpassed
	const getPage = () => {
		const totalItems = syncing ? 1 : items.length
		return Math.min(pageRef.current, totalItems)
	}

	// Re-sync page on resize
	useOnResize(() => {
		setStateWithRef(getPage(), setPage, pageRef)
	})

	// re-sync page when active account changes
	useEffect(() => {
		setStateWithRef(getPage(), setPage, pageRef)
	}, [activeAddress, network])

	// store the current page
	const [page, setPage] = useState<number>(1)
	const pageRef = useRef(page)

	// determine items to be displayed - always show 1 item per page
	const itemsDisplay = syncing ? items.slice(0, 1) : items.slice(page - 1, page)

	// Notify parent component of current item
	useEffect(() => {
		onUpdate?.(itemsDisplay[0])
	}, [page, items, onUpdate])

	const setPageHandler = (newPage: number) => {
		setStateWithRef(newPage, setPage, pageRef)
	}

	// Get format from current item
	const currentFormat = itemsDisplay[0]?.format

	return (
		<div
			className={`${styles.tipsWrapper} ${currentFormat ? styles[currentFormat] : ''}`}
		>
			<div className={styles.inner}>
				<div className={styles.items}>
					{syncing ? (
						<Syncing />
					) : (
						<Items
							items={itemsDisplay}
							page={pageRef.current}
							showTitle={false}
						/>
					)}
				</div>
				<PageToggle
					syncing={syncing}
					page={page}
					totalItems={items.length}
					setPageHandler={setPageHandler}
				/>
			</div>
		</div>
	)
}
