import { faCircleUp, faTrashCan } from '@fortawesome/free-regular-svg-icons'
import type { WarningMessage } from 'pages/Overview/Summaries/types'

export const useWarnings = () => {
	// TODO: dynamically generate based on Staking API response
	const warningMessages: WarningMessage[] = [
		{
			value: 'Pool is Destroying',
			description:
				'Your pool is being destroyed and you cannot earn pool rewards.',
			format: 'danger',
			faIcon: faTrashCan,
		},
		{
			value: 'High Commission',
			faIcon: faCircleUp,
			description:
				"Your pool's commission is high. Consider joining a different pool to increase rewards.",
			format: 'warning',
		},
		// NOTE: Currently not active on API side
		// {
		// 	value: 'No Change Rate',
		// 	faIcon: faHourglassHalf,
		// 	description:
		// 		'Your pool can increase its commission rate to any value, at any time.',
		// 	format: 'warning',
		// },
	]
	return { warningMessages }
}
