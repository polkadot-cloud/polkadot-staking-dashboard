// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faSquare } from '@fortawesome/free-regular-svg-icons'
import {
	faArrowDown,
	faPlus,
	faPlusCircle,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTooltip } from 'contexts/Tooltip'
import type { PalletNominationPoolsClaimPermission } from 'dedot/chaintypes'
import { useTranslation } from 'react-i18next'
import { TooltipArea } from 'ui-core/base'
import { Label } from 'ui-core/list'

export const ClaimPermission = ({
	claimPermission,
}: {
	claimPermission: PalletNominationPoolsClaimPermission | undefined
}) => {
	const { t } = useTranslation('app')
	const { setTooltipTextAndOpen } = useTooltip()

	let tooltipText = t('permissionlessClaimPermission')
	switch (claimPermission) {
		case 'PermissionlessCompound':
			tooltipText = t('permissionlessCompound')
			break
		case 'PermissionlessWithdraw':
			tooltipText = t('permissionlessWithdraw')
			break
		case 'Permissioned':
			tooltipText = t('permissionedClaimPermission')
			break
		default:
			break
	}

	let Icon: IconProp = faPlusCircle
	switch (claimPermission) {
		case 'Permissioned':
			Icon = faSquare
			break
		case 'PermissionlessWithdraw':
			Icon = faArrowDown
			break
		case 'PermissionlessCompound':
			Icon = faPlus
			break
		default:
			break
	}

	return (
		<Label>
			<TooltipArea
				text={tooltipText}
				onMouseMove={() => setTooltipTextAndOpen(tooltipText)}
			/>
			<FontAwesomeIcon icon={Icon} transform="grow-2" />
		</Label>
	)
}
