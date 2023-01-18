// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors

export type DataClass = 'd1' | 'd2' | 'd3' | 'd4';

export interface LegendItemProps {
  dataClass?: DataClass;
  label: string;
  helpKey?: string;
}

export interface BarSegmentProps {
  dataClass: DataClass;
  label?: string;
  widthPercent: number;
  flexGrow: number;
  forceShow?: boolean;
}
