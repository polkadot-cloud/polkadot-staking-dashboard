// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Preloader } from 'library/StatusPreloader/Preloader'
import { Suspense } from 'react'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import type { PageItem } from 'types'
import { Page } from 'ui-core/base'

export const PageWithTitle = ({ page }: { page: PageItem }) => {
	const { t } = useTranslation()
	const { Entry, key } = page

	return (
		<Page.Container>
			<Helmet>
				<title>{`${t(key, { ns: 'app' })} | ${t('title', {
					ns: 'app',
				})}`}</title>
			</Helmet>
			<Suspense fallback={<Preloader />}>
				<Entry page={page} />
			</Suspense>
		</Page.Container>
	)
}
