// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useNetwork } from 'contexts/Network';
import { Helmet } from 'react-helmet';
import type { PageItem } from 'types';
import { Page } from 'ui-structure';
import { useTranslation } from 'react-i18next';

export const PageWithTitle = ({ page }: { page: PageItem }) => {
  const { t } = useTranslation();
  const { network } = useNetwork();
  const { Entry, key } = page;

  return (
    <Page>
      <Helmet>
        <title>{`${t('title', {
          context: `${network}`,
          ns: 'base',
        })} : ${t(key, { ns: 'base' })}`}</title>
      </Helmet>
      <Entry page={page} />
    </Page>
  );
};
