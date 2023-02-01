// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { IconProp } from '@fortawesome/fontawesome-svg-core';
import {
  faArrowDown,
  faArrowRight,
  faArrowRightFromBracket,
  faRedoAlt,
  faStop,
} from '@fortawesome/free-solid-svg-icons';
import { PayeeOptions } from 'contexts/Setup/types';
import { useTranslation } from 'react-i18next';

export interface PayeeItem {
  icon: IconProp;
  value: PayeeOptions;
  title: string;
  activeTitle: string;
  subtitle: string;
}

export const usePayeeConfig = () => {
  const { t } = useTranslation('base');
  const getPayeeItems = (extended?: boolean): Array<PayeeItem> => {
    let items: Array<PayeeItem> = [
      {
        value: 'Staked',
        title: t('payee.staked.title', { context: 'default' }),
        activeTitle: t('payee.staked.title', { context: 'active' }),
        subtitle: t('payee.staked.subtitle'),
        icon: faRedoAlt,
      },
      {
        value: 'Stash',
        title: t('payee.stash.title', { context: 'default' }),
        activeTitle: t('payee.stash.title', { context: 'active' }),
        subtitle: t('payee.stash.subtitle'),
        icon: faArrowDown,
      },
      {
        value: 'Account',
        title: t('payee.account.title', { context: 'default' }),
        activeTitle: t('payee.account.title', { context: 'active' }),
        subtitle: t('payee.account.subtitle'),
        icon: faArrowRightFromBracket,
      },
    ];

    if (extended) {
      items = items.concat([
        {
          value: 'Controller',
          title: t('payee.controller.title', { context: 'default' }),
          activeTitle: t('payee.controller.title', { context: 'active' }),
          subtitle: t('payee.controller.subtitle'),
          icon: faArrowRight,
        },
        {
          value: 'None',
          title: t('payee.none.title', { context: 'default' }),
          activeTitle: t('payee.none.title', { context: 'active' }),
          subtitle: t('payee.none.subtitle'),
          icon: faStop,
        },
      ]);
    }

    return items;
  };

  return { getPayeeItems };
};
