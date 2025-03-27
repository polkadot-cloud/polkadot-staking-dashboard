// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@w3ux/types'
import type { FC, RefObject } from 'react'
import type {
  ActiveOverlayInstance,
  CanvasSize,
  CanvasStatus,
  ModalSize,
  ModalStatus,
  OverlayInstanceDirection,
  OverlayType,
} from 'types'

export interface OverlayContextInterface {
  openOverlayInstances: number
  setOpenOverlayInstances: (
    direction: OverlayInstanceDirection,
    instanceType: OverlayType
  ) => void
  activeOverlayInstance: ActiveOverlayInstance
  setActiveOverlayInstance: (instance: ActiveOverlayInstance) => void
  canvas: {
    status: CanvasStatus
    config: CanvasConfig
    openCanvas: (config: CanvasConfig) => void
    closeCanvas: () => void
    setCanvasStatus: (status: CanvasStatus) => void
  }
  modal: {
    status: ModalStatus
    config: AnyJson
    modalHeight: number
    modalResizeCounter: number
    modalMaxHeight: number
    openModal: (config: ModalConfig) => void
    replaceModal: (config: ModalConfig) => void
    setModalHeight: (height: number) => void
    setModalResize: () => void
    setModalStatus: (status: ModalStatus) => void
    setModalRef: (modalRef: RefObject<HTMLDivElement>) => void
    setModalHeightRef: (heightRef: RefObject<HTMLDivElement>) => void
  }
}
export interface Fallback {
  fallback: FC
}

export type CanvasProps = Fallback & {
  canvas?: Record<string, FC>
  externalOverlayStatus: CanvasStatus
}

export type ModalProps = Fallback & {
  modals?: Record<string, FC>
  externalOverlayStatus: CanvasStatus
}
export type OverlayProps = ModalProps & CanvasProps
export type ConfigOptions = Record<string, AnyJson>

export interface ModalConfig {
  key: string
  options?: ConfigOptions
  size?: ModalSize
}

export interface CanvasConfig {
  key: string
  scroll?: boolean
  size?: CanvasSize
  options?: ConfigOptions
}
