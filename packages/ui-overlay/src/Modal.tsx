// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useAnimate } from 'motion/react'
import type { FC } from 'react'
import { useEffect, useRef } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { Card, Container, Scroll } from 'ui-core/modal'
import { useOverlay } from './Provider'
import type { ModalProps } from './Provider/types'

export const Modal = ({
	modals,
	externalOverlayStatus,
	fallback: Fallback,
}: ModalProps) => {
	const {
		activeOverlayInstance,
		setOpenOverlayInstances,
		setActiveOverlayInstance,
		modal: {
			config: { key, size, options },
			status,
			modalHeight,
			closeModal,
			modalResizeCounter,
			setModalRef,
			modalMaxHeight,
			setModalHeight,
			setModalStatus,
			setModalHeightRef,
		},
	} = useOverlay()
	const [scope, animate] = useAnimate()
	const { status: canvasStatus } = useOverlay().canvas

	const modalRef = useRef<HTMLDivElement | null>(null)
	const heightRef = useRef<HTMLDivElement | null>(null)

	// Whether the modal card is currently dimmed
	const dimmed = externalOverlayStatus === 'open' || canvasStatus === 'open'

	// Determine modal overflow behaviour based on scroll and height
	const overflow = options?.disableScroll
		? 'hidden'
		: modalHeight >= modalMaxHeight
			? 'scroll'
			: 'hidden'

	const onOutClose = async () => {
		setOpenOverlayInstances('dec', 'modal')
		setActiveOverlayInstance(null)
		await animate(scope.current, { opacity: 0, scale: 0.9 }, { duration: 0.2 })
		setModalStatus('closed')
	}
	const onIn = async () => {
		if (!scope.current) {
			return
		}
		await animate(scope.current, { opacity: 1, scale: 1 }, { duration: 0.2 })
	}

	const onOut = async () => {
		if (!scope.current) {
			return
		}
		await animate(scope.current, { opacity: 0, scale: 0.9 }, { duration: 0.2 })
	}

	const windowResize = () => {
		if (!options?.disableWindowResize) {
			window.addEventListener('resize', handleResize)
		}
	}

	const handleResize = () => {
		if (status !== 'open' || options?.disableWindowResize) {
			return
		}
		setModalHeight(modalRef.current?.clientHeight || 0)
	}

	// Control on modal status change
	useEffect(() => {
		if (activeOverlayInstance === 'modal' && status === 'open') {
			onIn()
		}
		if (status === 'closing') {
			onOutClose()
		}
	}, [status])

	// Control on canvas status change
	useEffect(() => {
		// fade out modal if canvas has been opened
		if (canvasStatus === 'open' && status === 'open') {
			onOut()
		}
		// fade in modal if its open & canvas is closing
		if (canvasStatus === 'closing') {
			if (status === 'open') {
				onIn()
			}
		}
	}, [canvasStatus])

	// Control dim external overlay change
	useEffect(() => {
		// fade out modal if external overlay has been opened
		if (externalOverlayStatus === 'open' && status === 'open') {
			onOut()
		}
		// fade in modal if its open & external overlay is closing
		if (
			externalOverlayStatus === 'closing' &&
			activeOverlayInstance === 'modal'
		) {
			onIn()
		}
	}, [externalOverlayStatus])

	// Resize modal on status or resize change
	useEffect(() => handleResize(), [modalResizeCounter, status])

	// Resize modal on window size change
	useEffect(() => {
		windowResize()
		return () => {
			window.removeEventListener('resize', handleResize)
		}
	})

	// Update the modal's content ref as they are initialised
	useEffect(() => {
		setModalRef(modalRef)
		setModalHeightRef(heightRef)
	}, [modalRef?.current, heightRef?.current])

	const ActiveModal: FC | null = modals?.[key] || null

	return status === 'closed' ? null : status !== 'replacing' ? (
		<Container
			ref={scope}
			initial={{
				opacity: 0,
				scale: 0.9,
			}}
			style={{ opacity: status === 'opening' ? 0 : 1 }}
			onClose={() => closeModal()}
		>
			<Scroll
				ref={heightRef}
				size={size}
				overflow={overflow}
				style={{
					height: modalHeight,
					overflow: 'hidden',
				}}
			>
				<Card ref={modalRef} dimmed={dimmed}>
					<ErrorBoundary FallbackComponent={Fallback || null}>
						{ActiveModal && <ActiveModal />}
					</ErrorBoundary>
				</Card>
			</Scroll>
		</Container>
	) : null
}
