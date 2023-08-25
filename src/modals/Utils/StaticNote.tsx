// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { AnyJson } from 'types';

interface StaticNoteProps {
  value: string;
  tKey: string;
  valueKey: string;
  deps?: AnyJson[];
}

// Static notes store a single piece of text that is not updated after the initial render unless
// `deps` change. Deps should only change when syncing is complete.
export const StaticNote = ({
  value,
  tKey,
  valueKey,
  deps = [],
}: StaticNoteProps) => {
  const { t } = useTranslation('modals');

  // store the next to be displayed.
  const [staticText, setStaticText] = useState<string>(value);

  useEffect(() => {
    setStaticText(value);
  }, [...deps]);

  return <p>{t(tKey, { [valueKey]: staticText })}</p>;
};
