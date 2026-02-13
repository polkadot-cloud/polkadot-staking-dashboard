// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faChartLine, faUsers } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Title } from 'library/Modal/Title'
import { useTranslation } from 'react-i18next'
import type { ModalSize } from 'types'
import { Padding } from 'ui-core/modal'
import { useOverlay } from 'ui-overlay'
import { ItemsWrapper, ItemWrapper } from '../StakingOptions/Wrappers'

export const DualStakeAction = () => {
	const { t } = useTranslation()
	const { openModal, closeModal, config } = useOverlay().modal

	const title = config.options?.title as string

	const handleSelect = (bondFor: 'nominator' | 'pool') => {
		closeModal()

		const modalKey = config.options?.modalKey as string
		const modalSize = (config.options?.modalSize as ModalSize) || 'sm'

		if (modalKey) {
			openModal({
				key: modalKey,
				options: { bondFor, ...config.options?.modalOptions },
				size: modalSize,
			})
		} else if (typeof config.options?.onSelect === 'function') {
			config.options.onSelect(bondFor)
		}
	}

	return (
		<>
			<Title title={title || ''} />
			<Padding horizontalOnly style={{ marginTop: '1rem' }}>
				<ItemsWrapper>
					<ItemWrapper type="button" onClick={() => handleSelect('nominator')}>
						<FontAwesomeIcon icon={faChartLine} size="2x" />
						<h2>{t('nominator', { ns: 'modals' })}</h2>
					</ItemWrapper>
					<ItemWrapper type="button" onClick={() => handleSelect('pool')}>
						<FontAwesomeIcon icon={faUsers} size="2x" />
						<h2>{t('pool', { ns: 'modals' })}</h2>
					</ItemWrapper>
				</ItemsWrapper>
			</Padding>
		</>
	)
}
