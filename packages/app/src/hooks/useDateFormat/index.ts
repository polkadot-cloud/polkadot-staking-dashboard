// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { Locale } from 'date-fns'
import { DefaultLocale, getDateFormat, loadDateFormat } from 'locales'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

// Returns the date-fns `Locale` for the active language, lazy-loading it on
// demand. Returns `undefined` until the locale's date format has loaded, at
// which point date-fns falls back to its default formatting.
export const useDateFormat = (): Locale | undefined => {
	const { i18n } = useTranslation()
	const lng = i18n.resolvedLanguage ?? DefaultLocale

	const [dateFormat, setDateFormat] = useState<Locale | undefined>(() =>
		getDateFormat(lng),
	)

	useEffect(() => {
		let active = true
		loadDateFormat(lng).then((locale) => {
			if (active) {
				setDateFormat(locale)
			}
		})
		return () => {
			active = false
		}
	}, [lng])

	return dateFormat
}
