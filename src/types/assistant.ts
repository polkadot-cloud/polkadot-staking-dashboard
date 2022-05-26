// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

export enum ConnectionStatus {
  Connecting = 'connecting',
  Connected = 'connected',
  Disconnected = 'disconnected',
}

export type AssistantConfig = Array<AssistantItem>;

export interface AssistantItem {
  key: string;
  definitions?: AssistantDefinition | [];
  external?: AssistantExternal | [];
}

export type AssistantDefinition = Array<{
  title: string;
  description: Array<string>;
}>;

export interface AssistantExternal {
  label: string;
  title: string;
  subtitle: string;
  url: string;
}
