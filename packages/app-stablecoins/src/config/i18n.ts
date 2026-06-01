// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import i18n from 'i18next'

export const i18next = i18n.createInstance()

void i18next.init({
	lng: 'en',
	fallbackLng: 'en',
	defaultNS: 'app',
	interpolation: {
		escapeValue: false,
	},
	resources: {
		en: {
			app: {
				connectAccounts: 'Connect Accounts',
				network: 'Network',
				notification: 'Notification',
				notification_other: 'Notifications',
				selectAccount: 'Select Account',
				send: 'Send',
				switchAccount: 'Switch Account',
				wallets: 'Wallets',
				webExtensions: 'Web Extensions',
			},
			modals: {
				cancel: 'Cancel',
				connect: 'Connect',
				developerTools: 'Developer Tools',
				disconnect: 'Disconnect',
				disconnectFromExtension: 'Disconnect from this extension?',
				hardware: 'Hardware',
				notInstalled: 'Not Installed',
				readOnly: 'Read Only',
				readOnlyAccounts: 'Read Only Accounts',
			},
		},
	},
})
