// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { capitalizeFirstLetter } from '@w3ux/utils'
import { getStakingChainData } from 'consts/util/chains'
import { useApi } from 'contexts/Api'
import { usePrompt } from 'contexts/Prompt'
import { getRpcEndpoints, setRpcEndpoints } from 'global-bus'
import { measureChainLatencies } from 'global-bus/util'
import { useNetwork } from 'hooks/useNetwork'
import { Title } from 'library/Prompt/Title'
import { PromptSelectItem } from 'library/Prompt/Wrappers'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { ChainId } from 'types'

export const OptimalRpcPrompt = () => {
	const { t } = useTranslation('modals')
	const { network } = useNetwork()
	const { closePrompt } = usePrompt()
	const { getRpcEndpoint } = useApi()

	const { name: chainId, endpoints } = getStakingChainData(network)
	const providers = Object.entries(endpoints.rpc)
	const currentKey = getRpcEndpoint(chainId as ChainId)

	// Measured latency per provider label (ms, or Infinity on failure). Absent => still measuring
	const [latencies, setLatencies] = useState<Record<string, number>>({})
	const [done, setDone] = useState(false)

	// Kick off measurement when the prompt opens. Opening it is the user's explicit opt-in, so no
	// extra confirmation is needed. Guard against state updates after the prompt is closed
	useEffect(() => {
		let active = true
		measureChainLatencies(chainId, (label, latencyMs) => {
			if (active) {
				setLatencies((prev) => ({ ...prev, [label]: latencyMs }))
			}
		}).then(() => {
			if (active) {
				setDone(true)
			}
		})
		return () => {
			active = false
		}
	}, [chainId])

	// Only reorder once all results are in, so rows don't jump around while measuring
	const ordered = done
		? [...providers].sort(
				([a], [b]) => (latencies[a] ?? Infinity) - (latencies[b] ?? Infinity),
			)
		: providers

	// The fastest reachable provider, recommended once measuring completes
	const fastestKey =
		done && Number.isFinite(latencies[ordered[0]?.[0]])
			? ordered[0][0]
			: undefined

	const latencyLabel = (label: string): string => {
		const latency = latencies[label]
		if (latency === undefined) {
			return t('optimalRpcMeasuring')
		}
		if (!Number.isFinite(latency)) {
			return t('optimalRpcUnavailable')
		}
		return `${Math.round(latency)} ms`
	}

	const apply = (label: string) => {
		closePrompt()
		setRpcEndpoints(network, {
			...getRpcEndpoints(),
			[chainId]: label,
		})
	}

	return (
		<>
			<Title title={t('optimalRpc')} />
			<div className="padded">
				<h4 className="subheading">
					{t('optimalRpcInfo', {
						network: capitalizeFirstLetter(network),
					})}
				</h4>
				{ordered.map(([key, url]) => {
					const isCurrent = currentKey === key
					const isFastest = fastestKey === key

					return (
						<PromptSelectItem
							key={`optimal_rpc_${key}`}
							className={isCurrent ? 'inactive' : undefined}
							disabled={isCurrent}
							onClick={() => apply(key)}
						>
							<h3>
								{key}
								{isFastest && `  (${t('optimalRpcFastest')})`}
								{isCurrent && `  (${t('selected')})`}
							</h3>
							<h4>
								{latencyLabel(key)} — {url}
							</h4>
						</PromptSelectItem>
					)
				})}
			</div>
		</>
	)
}
