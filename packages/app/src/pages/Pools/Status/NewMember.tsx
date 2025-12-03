// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faUserPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useNetwork } from 'contexts/Network'
import { useStaking } from 'contexts/Staking'
import { useUi } from 'contexts/UI'
import {
	onCreatePoolButtonPressedEvent,
	onJoinPoolButtonPressedEvent,
} from 'event-tracking'
import { CallToActionWrapper } from 'library/CallToAction'
import { CallToActionLoader } from 'library/Loader/CallToAction'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useOverlay } from 'ui-overlay'
import type { NewMemberProps } from './types'
import { useStatusButtons } from './useStatusButtons'

export const NewMember = ({ syncing, showOtherOptions }: NewMemberProps) => {
	const { t } = useTranslation()
	const navigate = useNavigate()
	const { network } = useNetwork()
	const { advancedMode } = useUi()
	const { isBonding } = useStaking()
	const { openModal } = useOverlay().modal
	const { openCanvas } = useOverlay().canvas
	const { getJoinDisabled, getCreateDisabled } = useStatusButtons()

	// Alias for create button disabled state
	const createDisabled = getCreateDisabled() || isBonding

	// Disable opening the canvas if data is not ready.
	const joinButtonDisabled = getJoinDisabled() || isBonding

	// Handle join pool button press
	const handleOnJoinPool = () => {
		if (!advancedMode) {
			// On simple mode, open Join Pool modal
			openModal({ key: 'JoinPool', size: 'xs' })
		} else {
			// On advanced mode, open Pool canvas
			onJoinPoolButtonPressedEvent(network)
			openCanvas({
				key: 'Pool',
				options: {},
				size: 'xl',
			})
		}
	}

	return (
		<CallToActionWrapper style={{ marginTop: '1rem' }}>
			{syncing ? (
				<CallToActionLoader />
			) : (
				<>
					<section>
						<div className="buttons">
							<div
								className={`button primary standalone${joinButtonDisabled ? ` disabled` : ``}${!joinButtonDisabled ? ` pulse` : ``}`}
							>
								<button
									type="button"
									onClick={handleOnJoinPool}
									disabled={joinButtonDisabled}
								>
									{t('joinPool', { ns: 'pages' })}
									<FontAwesomeIcon icon={faUserPlus} />
								</button>
							</div>
						</div>
					</section>
					{advancedMode && (
						<section>
							<div className="buttons">
								<div
									className={`button standalone secondary ${createDisabled ? ` disabled` : ``}`}
								>
									<button
										type="button"
										onClick={() => {
											onCreatePoolButtonPressedEvent(network)
											openCanvas({
												key: 'CreatePool',
												options: {},
												size: 'xl',
											})
										}}
										disabled={createDisabled}
									>
										{t('createPool', { ns: 'pages' })}
									</button>
								</div>
								<div className={`button standalone secondary`}>
									<button type="button" onClick={() => navigate('/pools')}>
										{t('browsePools', { ns: 'pages' })}
									</button>
								</div>
							</div>
						</section>
					)}
					{showOtherOptions && (
						<section>
							<div className="buttons">
								<div className={`button standalone secondary`}>
									<button
										type="button"
										onClick={() =>
											openModal({
												key: 'StakingOptions',
												size: 'xs',
												options: { context: 'simple_other_options' },
											})
										}
									>
										{t('otherOptions', { ns: 'app' })}
									</button>
								</div>
							</div>
						</section>
					)}
				</>
			)}
		</CallToActionWrapper>
	)
}
