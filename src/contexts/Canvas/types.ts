// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';

export type CanvasItems = CanvasItem[];

export interface CanvasItem {
  key?: string;
  external?: ExternalItems;
}

export type ExternalItems = ExternalItem[];
export type ExternalItem = [string, string, string];

export interface ExternalWithKeys {
  title: string;
  url: string;
  website?: string;
}

export interface CanvasContextInterface {
  openCanvas: () => void;
  closeCanvas: () => void;
  setStatus: (s: number) => void;
  status: number;
}

export interface CanvasContextState {
  status: number;
}

export interface CanvasContextProps {
  children: ReactNode;
}

export type CanvasConfig = Record<string, string | any>;
