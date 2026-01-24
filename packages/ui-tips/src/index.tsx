// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useOnResize } from '@w3ux/hooks'
import { setStateWithRef } from '@w3ux/utils'
import { TipsThresholdMedium, TipsThresholdSmall } from 'consts'
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
}: TipsProps) => {
	// multiple tips per row is currently turned off
	const multiTipsPerRow = false

	// helper function to determine the number of items to display per page. UI displays 1 item by
	// default.
	const getItemsPerPage = () => {
		if (!multiTipsPerRow) {
			return 1
		}
		if (window.innerWidth < TipsThresholdSmall) {
			return 1
		}
		if (
			window.innerWidth >= TipsThresholdSmall &&
			window.innerWidth < TipsThresholdMedium
		) {
			return 2
		}
		return 3
	}

	// Helper function to determine which page we should be on upon page resize. This function ensures
	// totalPages is never surpassed, but does not guarantee that the start item will maintain across
	// resizes
	const getPage = () => {
		const totalItmes = syncing ? 1 : items.length
		const itemsPerPage = getItemsPerPage()
		const totalPages = Math.ceil(totalItmes / itemsPerPage)
		if (pageRef.current > totalPages) {
			return totalPages
		}
		const end = pageRef.current * itemsPerPage
		const start = end - (itemsPerPage - 1)
		return Math.ceil(start / itemsPerPage)
	}

	// Re-sync page and items per page on resize
	useOnResize(() => {
		setStateWithRef(getPage(), setPage, pageRef)
		setStateWithRef(getItemsPerPage(), setItemsPerPageState, itemsPerPageRef)
	})

	// re-sync page when active account changes
	useEffect(() => {
		setStateWithRef(getPage(), setPage, pageRef)
	}, [activeAddress, network])

	// store the current amount of allowed items on display
	const [itemsPerPage, setItemsPerPageState] = useState<number>(
		getItemsPerPage(),
	)
	const itemsPerPageRef = useRef(itemsPerPage)

	// store the current page
	const [page, setPage] = useState<number>(1)
	const pageRef = useRef(page)

	// determine items to be displayed
	const end = syncing
		? 1
		: Math.min(pageRef.current * itemsPerPageRef.current, items.length)
	const start = syncing
		? 1
		: pageRef.current * itemsPerPageRef.current - (itemsPerPageRef.current - 1)

	const itemsDisplay = items.slice(start - 1, end)

	const setPageHandler = (newPage: number) => {
		setStateWithRef(newPage, setPage, pageRef)
	}
	return (
		<div className={styles.tipsWrapper}>
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
					start={start}
					end={end}
					page={page}
					itemsPerPage={itemsPerPage}
					totalItems={items.length}
					setPageHandler={setPageHandler}
				/>
			</div>
		</div>
	)
}
