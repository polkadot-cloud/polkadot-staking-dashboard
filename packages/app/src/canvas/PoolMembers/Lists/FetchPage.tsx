// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ListProvider } from 'contexts/List'
import { useNetwork } from 'contexts/Network'
import { useActivePool } from 'contexts/Pools/ActivePool'
import { usePoolMembers } from 'contexts/Pools/PoolMembers'
import { List, ListStatusHeader, Wrapper as ListWrapper } from 'library/List'
import { MotionContainer } from 'library/List/MotionContainer'
import { Pagination } from 'library/List/Pagination'
import { fetchPoolMembers } from 'plugin-staking-api'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Member } from './Member'
import type { MembersListProps } from './types'

export const MembersListInner = ({
	pagination,
	memberCount,
	itemsPerPage,
}: MembersListProps) => {
	const { t } = useTranslation('pages')
	const {
		meta,
		fetchPoolMemberData,
		fetchedPoolMembersApi,
		setFetchedPoolMembersApi,
	} = usePoolMembers()
	const { network } = useNetwork()
	const { activePool } = useActivePool()

	// current page
	const [page, setPage] = useState<number>(1)

	// pagination
	const totalPages = Math.ceil(Number(memberCount) / itemsPerPage)
	const pageEnd = itemsPerPage - 1
	const pageStart = pageEnd - (itemsPerPage - 1)

	// handle validator list bootstrapping
	const fetchingMemberList = useRef<boolean>(false)

	const syncMemberList = async () => {
		try {
			const poolId = activePool?.id || 0
			if (poolId > 0 && !fetchingMemberList.current) {
				fetchingMemberList.current = true
				// Calculate offset based on page number (1-indexed)
				const offset = (page - 1) * itemsPerPage
				const result = await fetchPoolMembers(
					network,
					poolId,
					itemsPerPage,
					offset,
				)
				fetchingMemberList.current = false
				if (result?.members) {
					fetchPoolMemberData(result.members.map(({ address }) => address))
				}
				setFetchedPoolMembersApi('synced')
			}
		} catch {
			fetchingMemberList.current = false
			setFetchedPoolMembersApi('unsynced')
		}
	}

	// get throttled subset or entire list
	const members = meta.poolMembers.filter((m) => m !== undefined)
	const listMembers = members.slice(pageStart).slice(0, itemsPerPage)

	// Configure list when network is ready to fetch
	useEffect(() => {
		setFetchedPoolMembersApi('unsynced')
		syncMemberList()
	}, [activePool, page])

	return (
		<ListWrapper>
			<List $flexBasisLarge={'33.33%'}>
				{pagination && (
					<Pagination
						page={page}
						total={totalPages}
						setter={setPage}
						disabled={fetchedPoolMembersApi !== 'synced'}
					/>
				)}
				{fetchedPoolMembersApi !== 'synced' ? (
					<ListStatusHeader style={{ marginTop: '0.5rem' }}>
						{t('fetchingMemberList')}....
					</ListStatusHeader>
				) : (
					<MotionContainer>
						{listMembers.map((member, index) => (
							<Member key={`nomination_${index}`} member={member} />
						))}
					</MotionContainer>
				)}
			</List>
		</ListWrapper>
	)
}

export const MembersList = (props: MembersListProps) => (
	<ListProvider>
		<MembersListInner {...props} />
	</ListProvider>
)
