// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useAnimate } from 'motion/react'
import type { ComponentType } from 'react'
import { Suspense, useEffect, useLayoutEffect, useRef } from 'react'
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

	const openWhenMeasured = () => {
		if (status !== 'opening') {
			return false
		}

		const height = modalRef.current?.clientHeight || 0
		if (height > 0) {
			setModalHeight(height, false)
			setModalStatus('open')
			return true
		}
		return false
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

	// Lazy modal content renders after the opening status is already set. Watch
	// for the first measurable height so the modal can transition to open.
	useLayoutEffect(() => {
		if (status !== 'opening' || !modalRef.current) {
			return
		}

		if (openWhenMeasured()) {
			return
		}

		let frame: number | undefined
		let observer: ResizeObserver | undefined
		const measure = () => {
			if (openWhenMeasured()) {
				observer?.disconnect()
				if (frame) {
					window.cancelAnimationFrame(frame)
				}
			}
		}

		if (typeof ResizeObserver === 'undefined') {
			frame = window.requestAnimationFrame(measure)
		} else {
			observer = new ResizeObserver(measure)
			observer.observe(modalRef.current)
		}

		return () => {
			observer?.disconnect()
			if (frame) {
				window.cancelAnimationFrame(frame)
			}
		}
	}, [key, status])

	const ActiveModal: ComponentType | null = modals?.[key] || null

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
						<Suspense fallback={null}>
							{ActiveModal && <ActiveModal />}
						</Suspense>
					</ErrorBoundary>
				</Card>
			</Scroll>
		</Container>
	) : null
}
