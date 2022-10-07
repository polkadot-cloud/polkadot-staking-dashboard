// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { OpenHelpIcon } from 'library/OpenHelpIcon';
import { useTranslation } from 'react-i18next';
import { StatBox } from './Item';
import { TextProps } from './types';

export const Text = (props: TextProps) => {
  const { label, value, helpKey, chelpKey } = props;
  const { i18n } = useTranslation('common');

  const help = helpKey !== undefined;

  return (
    <StatBox>
      <div className="content chart">
        <div className="labels">
          <h3 className="text">{value}</h3>
          <h4>
            {label}
            {help && (
              <OpenHelpIcon
                helpKey={i18n.resolvedLanguage === 'en' ? helpKey : chelpKey}
              />
            )}
          </h4>
        </div>
      </div>
    </StatBox>
  );
};
