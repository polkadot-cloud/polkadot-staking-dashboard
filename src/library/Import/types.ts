import type { FunctionComponent, SVGProps } from 'react';
import type { MaybeString } from 'types';

export interface StatusBarProps {
  handleCancel?: () => void;
  helpKey?: MaybeString;
  inProgress: boolean;
  text: string;
  StatusBarIcon: FunctionComponent<SVGProps<SVGSVGElement>>;
}

export interface HeadingProps {
  connectTo?: string;
  disabled: boolean;
  handleReset: () => void;
  Icon?: FunctionComponent<SVGProps<SVGSVGElement>>;
  title: string;
}
