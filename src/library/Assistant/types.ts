// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { AssistantItem } from 'types/assistant';

export interface ActionProps {
  onClick: () => void;
  height: number | string;
  subtitle: string;
  label: string;
  title: string;
}

export interface DefinitionProps {
  onClick: () => void;
  title: string;
  description: Array<string>;
}

export interface ExternalProps {
  width: number | string;
  height?: number | string | undefined;
  subtitle: string;
  label: string;
  title: string;
  url: string;
}

export interface HeadingProps {
  title: string;
}

export interface HeightWrapperProps {
  transition?: number;
}

export interface ItemWrapperProps {
  width: number | string;
  height: number | string;
}

export interface SectionProps {
  pageMeta: AssistantItem | undefined;
}
