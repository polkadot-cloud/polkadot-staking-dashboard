// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { getChainIcons } from 'assets'
import { format, startOfToday, subDays } from 'date-fns'
import { useNetwork } from 'hooks/useNetwork'
import { AnnouncementsList } from 'library/Announcements/AnnouncementsList'
import type { AnnouncementItem } from 'library/Announcements/types'
import { Balance } from 'library/Balance'
import { CardWrapper } from 'library/Card/Wrappers'
import { NominatorList } from 'library/NominatorList'
import { DefaultLocale, locales } from 'locales'
import { useTranslation } from 'react-i18next'
import { CardHeader, Separator } from 'ui-core/base'
import type { IncomingProjectionAccount } from './mockIncomingProjection'

interface IncomingPayoutsProps {
	accounts: IncomingProjectionAccount[]
	unit: string
	currency: string
}

export const IncomingPayouts = ({
	accounts,
	unit,
	currency,
}: IncomingPayoutsProps) => {
	const { i18n, t } = useTranslation('pages')
	const { network } = useNetwork()
	const Token = getChainIcons(network).token

	const totalIncoming30d = accounts.reduce(
		(acc, item) => acc + item.incomingPayouts30d,
		0,
	)

	const totalProjectedAnnual = accounts.reduce(
		(acc, item) => acc + item.stakedBalance * (item.validatorApy / 100),
		0,
	)

	const announcements: AnnouncementItem[] = [
		{
			label: t('last30dIncoming', { defaultValue: 'Last 30 Days' }),
			value: '',
			valueNode: (
				<Balance.WithFiat
					Token={<Token />}
					value={totalIncoming30d}
					currency={currency}
					caretAsUnit
				/>
			),
		},
		{
			label: t('projectedAnnualIncoming', {
				defaultValue: 'Projected Annual Total',
			}),
			value: '',
			valueNode: (
				<Balance.WithFiat
					Token={<Token />}
					value={totalProjectedAnnual}
					currency={currency}
					caretAsUnit
				/>
			),
		},
	]

	const fromDate = format(subDays(startOfToday(), 30), 'do MMM', {
		locale: locales[i18n.resolvedLanguage ?? DefaultLocale].dateFormat,
	})
	const toDate = format(startOfToday(), 'do MMM', {
		locale: locales[i18n.resolvedLanguage ?? DefaultLocale].dateFormat,
	})

	return (
		<CardWrapper>
			<CardHeader>
				<h4>
					{t('incomingPayoutAccounts', {
						defaultValue: 'Incoming Payouts',
					})}
				</h4>
				<h2>
					{fromDate}
					{toDate !== fromDate && <>&nbsp;-&nbsp;{toDate}</>}
				</h2>
			</CardHeader>

			<Separator transparent />
			<AnnouncementsList items={announcements} />
			<Separator transparent />

			<NominatorList items={accounts} unit={unit} />
		</CardWrapper>
	)
}
