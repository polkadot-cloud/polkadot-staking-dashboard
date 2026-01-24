// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useAnimate } from 'motion/react'
import { useEffect, useState } from 'react'
import type { TipDisplay, TipItemsProps } from './types'
import { ItemInnerWrapper, ItemsWrapper, ItemWrapper } from './Wrappers'

export const Items = ({ items, page }: TipItemsProps) => {
	const [scope, animate] = useAnimate()

	// stores whether this is the initial display of tips
	const [initial, setInitial] = useState<boolean>(true)

	useEffect(() => {
		doControls(true)
		setInitial(false)
	}, [page])

	const doControls = async (transition: boolean) => {
		if (transition) {
			await animate(scope.current, { opacity: 0 }, { duration: 0 })
			await animate(scope.current, { opacity: 1 }, { duration: 0.3 })
		} else {
			await animate(scope.current, { opacity: 1 }, { duration: 0 })
		}
	}

	return (
		<ItemsWrapper ref={scope} initial={{ opacity: 0 }}>
			{items.map((item, index: number) => (
				<Item
					key={`tip_${index}_${page}`}
					index={index}
					{...item}
					initial={initial}
				/>
			))}
		</ItemsWrapper>
	)
}

const Item = ({
	subtitle,
	onTipClick,
	index,
	initial,
}: TipDisplay & { index: number; initial: boolean }) => {
	const [scope, animate] = useAnimate()
	const [isStopped, setIsStopped] = useState<boolean>(true)

	useEffect(() => {
		const delay = index * 75

		if (initial) {
			setTimeout(() => {
				if (isStopped) {
					setIsStopped(false)
				}
				// Animate the item in with spring transition
				animate(
					scope.current,
					{ y: 0, opacity: 1 },
					{
						delay: index * 0.2,
						duration: 0.7,
						type: 'spring' as const,
						bounce: 0.35,
					},
				)
			}, delay)
		} else {
			// Immediate animation without delay for non-initial renders
			animate(
				scope.current,
				{ y: 0, opacity: 1 },
				{
					delay: index * 0.2,
					duration: 0.7,
					type: 'spring' as const,
					bounce: 0.35,
				},
			)
		}
	}, [initial, index])

	return (
		<ItemWrapper ref={scope} initial={{ y: 15, opacity: 0 }}>
			<ItemInnerWrapper>
				<section />
				<section>
					<div className="desc active">
						<button onClick={() => onTipClick()} type="button">
							<h4>
								{subtitle}
								<FontAwesomeIcon
									icon={faExternalLinkAlt}
									transform="shrink-2"
								/>
							</h4>
						</button>
					</div>
				</section>
			</ItemInnerWrapper>
		</ItemWrapper>
	)
}
