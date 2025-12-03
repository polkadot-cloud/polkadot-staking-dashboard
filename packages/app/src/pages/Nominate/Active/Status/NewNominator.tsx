// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useApi } from 'contexts/Api'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { useNetwork } from 'contexts/Network'
import { useActivePool } from 'contexts/Pools/ActivePool'
import { useStaking } from 'contexts/Staking'
import { onNewNominatorButtonPressedEvent } from 'event-tracking'
import { CallToActionWrapper } from 'library/CallToAction'
import { CallToActionLoader } from 'library/Loader/CallToAction'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useOverlay } from 'ui-overlay'
import type { NewNominatorProps } from '../types'

export const NewNominator = ({ syncing }: NewNominatorProps) => {
	const { t } = useTranslation()
	const { isReady } = useApi()
	const navigate = useNavigate()
	const { network } = useNetwork()
	const { inPool } = useActivePool()
	const { openModal } = useOverlay().modal
	const { activeAddress } = useActiveAccounts()
	const { isBonding, isNominating } = useStaking()
	const { isReadOnlyAccount } = useImportedAccounts()

	const nominateButtonDisabled =
		!isReady ||
		!activeAddress ||
		inPool ||
		isBonding ||
		isNominating ||
		isReadOnlyAccount(activeAddress)

	return (
		<CallToActionWrapper>
			{syncing ? (
				<CallToActionLoader />
			) : (
				<>
					<section className="standalone">
						<div className="buttons">
							<div
								className={`button primary standalone${nominateButtonDisabled ? ` disabled` : ` pulse`}`}
							>
								<button
									type="button"
									onClick={() => {
										onNewNominatorButtonPressedEvent(network)
										openModal({
											key: 'StartNominating',
											options: {},
											size: 'xs',
										})
									}}
									disabled={nominateButtonDisabled}
								>
									{t('startNominating', { ns: 'pages' })}
								</button>
							</div>
						</div>
					</section>
					<section>
						<div className="buttons">
							<div className={`button secondary standalone`}>
								<button type="button" onClick={() => navigate('/validators')}>
									{t('browseValidators', { ns: 'app' })}
								</button>
							</div>
						</div>
					</section>
				</>
			)}
		</CallToActionWrapper>
	)
}
