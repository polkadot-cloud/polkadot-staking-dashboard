// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { getChainIcons } from 'assets'
import BigNumber from 'bignumber.js'
import { format, startOfToday, subDays } from 'date-fns'
import { useNetwork } from 'hooks/useNetwork'
import { AnnouncementsList } from 'library/Announcements/AnnouncementsList'
import type { AnnouncementItem } from 'library/Announcements/types'
import { Balance } from 'library/Balance'
import { CardWrapper } from 'library/Card/Wrappers'
import { CopyAddress } from 'library/ListItem/Buttons/CopyAddress'
import { DefaultLocale, locales } from 'locales'
import { useTranslation } from 'react-i18next'
import { CardHeader, Identity, Separator } from 'ui-core/base'
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

			<div style={{ padding: '0.75rem 0.5rem 0.25rem 0.5rem' }}>
				{accounts.map((account) => {
					const annual = account.stakedBalance * (account.validatorApy / 100)

					return (
						<section
							key={account.address || account.label}
							style={{
								border: '1px solid var(--gray-500)',
								borderRadius: '0.75rem',
								marginBottom: '0.75rem',
								padding: '0.75rem',
								background: 'var(--bg-list)',
							}}
						>
							<Identity
								label={account.label}
								value={account.address || ''}
								address={account.address || ''}
								Action={<CopyAddress address={account.address || ''} />}
								iconSize="2.6rem"
							/>

							<div
								style={{
									marginTop: '0.75rem',
									display: 'grid',
									gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
									gap: '0.5rem',
								}}
							>
								<div>
									<h5 className="secondary">
										{t('stake', { defaultValue: 'Stake' })}
									</h5>
									<h4>
										{new BigNumber(account.stakedBalance).toFormat(3)} {unit}
									</h4>
								</div>
								<div>
									<h5 className="secondary">
										{t('validatorApy', { defaultValue: 'Validator APY' })}
									</h5>
									<h4>{account.validatorApy.toFixed(2)}%</h4>
								</div>
								<div>
									<h5 className="secondary">
										{t('annualProjection', {
											defaultValue: 'Annual Projection',
										})}
									</h5>
									<h4>
										{new BigNumber(annual).toFormat(3)} {unit}
									</h4>
								</div>
							</div>
						</section>
					)
				})}
			</div>
		</CardWrapper>
	)
}
