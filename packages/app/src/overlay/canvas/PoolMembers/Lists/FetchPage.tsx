// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { ListProvider } from 'contexts/List'
import { useNetwork } from 'contexts/Network'
import { usePlugins } from 'contexts/Plugins'
import { useActivePool } from 'contexts/Pools/ActivePool'
import { usePoolMembers } from 'contexts/Pools/PoolMembers'
import { Subscan } from 'controllers/Subscan'
import { List, ListStatusHeader, Wrapper as ListWrapper } from 'library/List'
import { MotionContainer } from 'library/List/MotionContainer'
import { Pagination } from 'library/List/Pagination'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { PoolMember } from 'types'
import { Member } from './Member'
import type { MembersListProps } from './types'

export const MembersListInner = ({
  pagination,
  batchKey,
  memberCount,
  itemsPerPage,
}: MembersListProps) => {
  const { t } = useTranslation('pages')
  const { network } = useNetwork()
  const { pluginEnabled } = usePlugins()
  const { activeAccount } = useActiveAccounts()
  const { activePool } = useActivePool()
  const {
    poolMembersApi,
    setPoolMembersApi,
    fetchedPoolMembersApi,
    setFetchedPoolMembersApi,
    fetchPoolMembersMetaBatch,
  } = usePoolMembers()

  // current page.
  const [page, setPage] = useState<number>(1)

  // pagination
  const totalPages = Math.ceil(Number(memberCount) / itemsPerPage)
  const pageEnd = itemsPerPage - 1
  const pageStart = pageEnd - (itemsPerPage - 1)

  // handle validator list bootstrapping
  const fetchingMemberList = useRef<boolean>(false)

  const setupMembersList = async () => {
    const poolId = activePool?.id || 0

    if (poolId > 0 && !fetchingMemberList.current) {
      fetchingMemberList.current = true

      const newMembers = (await Subscan.handleFetchPoolMembers(
        poolId,
        page,
        itemsPerPage
      )) as PoolMember[]

      fetchingMemberList.current = false
      setPoolMembersApi([...newMembers])
      fetchPoolMembersMetaBatch(batchKey, newMembers, true)
      setFetchedPoolMembersApi('synced')
    }
  }

  // get throttled subset or entire list
  const listMembers = poolMembersApi.slice(pageStart).slice(0, itemsPerPage)

  // Refetch list when page changes.
  useEffect(() => {
    if (pluginEnabled('subscan')) {
      setFetchedPoolMembersApi('unsynced')
      setPoolMembersApi([])
    }
  }, [page, activeAccount, pluginEnabled('subscan')])

  // Refetch list when network changes.
  useEffect(() => {
    setFetchedPoolMembersApi('unsynced')
    setPoolMembersApi([])
    setPage(1)
  }, [network])

  // Configure list when network is ready to fetch.
  useEffect(() => {
    if (fetchedPoolMembersApi === 'unsynced') {
      setupMembersList()
    }
  }, [fetchedPoolMembersApi, activePool])

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
            {t('pools.fetchingMemberList')}....
          </ListStatusHeader>
        ) : (
          <MotionContainer>
            {listMembers.map((member: PoolMember, index: number) => (
              <Member
                key={`nomination_${index}`}
                who={member.who}
                batchKey={batchKey}
                batchIndex={poolMembersApi.indexOf(member)}
              />
            ))}
          </MotionContainer>
        )}
      </List>
    </ListWrapper>
  )
}

export const MembersList = (props: MembersListProps) => {
  const { selectToggleable } = props

  return (
    <ListProvider selectToggleable={selectToggleable}>
      <MembersListInner {...props} />
    </ListProvider>
  )
}
