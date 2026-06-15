// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import checker from 'vite-plugin-checker'
import svgr from 'vite-plugin-svgr'

// https://vitejs.dev/config/
// - `BASE_URL`env variable is used in the codebase to refer to the supplied base.
export default defineConfig({
	plugins: [
		react(),
		svgr(),
		checker({
			typescript: true,
		}),
	],
	resolve: {
		tsconfigPaths: true,
	},
	build: {
		outDir: 'build',
		rollupOptions: {
			output: {
				// Split heavy vendor libraries into their own cacheable chunks so
				// they stay out of the entry bundle
				manualChunks: (id) => {
					if (!id.includes('node_modules')) {
						return
					}
					if (/chart\.js|chartjs|react-chartjs-2|chroma-js/.test(id)) {
						return 'charts'
					}
					if (id.includes('dedot')) {
						return 'dedot'
					}
					if (id.includes('@fortawesome')) {
						return 'fontawesome'
					}
				},
			},
		},
	},
	server: {
		fs: {
			strict: false,
		},
	},
	optimizeDeps: {
		include: ['react/jsx-runtime'],
	},
	worker: {
		format: 'es',
	},
})
