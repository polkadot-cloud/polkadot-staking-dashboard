/* @license Copyright 2024 @polkadot-cloud/library authors & contributors
SPDX-License-Identifier: GPL-3.0-only */

import type { FunctionComponent, SVGProps } from 'react';
import type { ComponentBase } from 'types';

export type HardwareStatusBarProps = ComponentBase & {
  // whether to animate in the status bar.
  show?: boolean;
  // help key and handler related to current status.
  help?: {
    // help key to display.
    helpKey: string;
    // handle help click.
    handleHelp: (key: string) => void;
  };
  // whether import process is in progress.
  inProgress: boolean;
  // text to display.
  text: string;
  // icon to display.
  Icon: FunctionComponent<SVGProps<SVGSVGElement>>;
  // handle cancel import.
  handleCancel?: () => void;
  // handle finish import.
  handleDone?: () => void;
  // required component translations.
  t: {
    tDone: string;
    tCancel: string;
  };
};
