// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { IconProp } from '@fortawesome/fontawesome-svg-core';
import {
  faArrowDown,
  faArrowRight,
  faArrowRightFromBracket,
  faRotate,
  faStop,
} from '@fortawesome/free-solid-svg-icons';
import { PayeeOptions } from 'contexts/Setup/types';

export interface PayeeItem {
  icon: IconProp;
  value: PayeeOptions;
  title: string;
  activeTitle: string;
  subtitle: string;
}

export const usePayeeConfig = () => {
  const getPayeeItems = (extended?: boolean): Array<PayeeItem> => {
    let items: Array<PayeeItem> = [
      {
        value: 'Staked',
        title: 'Compound',
        activeTitle: 'Compounding',
        subtitle: 'Add payouts to your existing staked balance automatically.',
        icon: faRotate,
      },
      {
        value: 'Stash',
        title: 'To Staking Account',
        activeTitle: 'To Staking Account',
        subtitle: 'Payouts are sent to your account as free balance.',
        icon: faArrowDown,
      },
      {
        value: 'Account',
        title: 'To Another Account',
        activeTitle: 'To Another Account',
        subtitle: 'Send payouts to another account as free balance.',
        icon: faArrowRightFromBracket,
      },
    ];

    if (extended) {
      items = items.concat([
        {
          value: 'Controller',
          title: 'To Controller Account',
          activeTitle: 'To Controller Account',
          subtitle:
            'Payouts are sent to your controller account as free balance.',
          icon: faArrowRight,
        },
        {
          value: 'None',
          title: 'None',
          activeTitle: 'Not Assigned',
          subtitle: 'Have no payout destination set.',
          icon: faStop,
        },
      ]);
    }

    return items;
  };

  return { getPayeeItems };
};
