// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { camelize } from '@w3ux/utils'
import BookSVG from 'assets/icons/book.svg?react'
import ForumSVG from 'assets/icons/forum.svg?react'
import GlassesSVG from 'assets/icons/glasses.svg?react'
import { HelpConfig } from 'config/help'
import { HelpResourceItems } from 'config/helpResources'
import { NetworkList } from 'consts/networks'
import { useHelp } from 'contexts/Help'
import type {
	DefinitionWithKeys,
	ExternalItems,
	HelpItem,
} from 'contexts/Help/types'
import { useNetwork } from 'contexts/Network'
import { useUi } from 'contexts/UI'
import { useAnimation } from 'framer-motion'
import { useFillVariables } from 'hooks/useFillVariables'
import { SearchInput } from 'library/List/SearchInput'
import { DefaultLocale } from 'locales'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ButtonPrimaryInvert } from 'ui-buttons'
import { Container, Content, Scroll } from 'ui-core/canvas'
import { Content as ModalContent } from 'ui-core/modal'
import { ActiveDefinition } from './Items/ActiveDefinition'
import { Definition } from './Items/Definition'
import { External } from './Items/External'
import { HelpSubtitle, HelpTitle, TabBar, TabButton } from './Wrappers'

export const Help = () => {
	const { t, i18n } = useTranslation()
	const controls = useAnimation()
	const { advancedMode } = useUi()
	const { network } = useNetwork()
	const { fillVariables } = useFillVariables()
	const { setStatus, status, definition, closeHelp } = useHelp()

	const scrollRef = useRef<HTMLDivElement>(null)
	const capitalizedNetwork = NetworkList[network]?.name
		? NetworkList[network].name.charAt(0).toUpperCase() +
			NetworkList[network].name.slice(1)
		: ''
	const networkUnit = NetworkList[network]?.unit
	const [tab, setTab] = React.useState<
		'resources' | 'definitions' | 'articles' | 'support'
	>('resources')

	// Search functionality state
	const [searchTerm, setSearchTerm] = useState<string>('')

	const onFadeIn = useCallback(async () => {
		await controls.start('visible')
	}, [])

	const onFadeOut = useCallback(async () => {
		await controls.start('hidden')
		setStatus('closed')
	}, [])

	// control canvas fade.
	useEffect(() => {
		if (status === 'open') {
			onFadeIn()
		}
		if (status === 'closing') {
			onFadeOut()
		}
	}, [status])

	// Reset search when switching modes or tabs
	useEffect(() => {
		setSearchTerm('')
	}, [advancedMode, tab])

	// render early if help not open
	if (status === 'closed') {
		return null
	}

	let meta: HelpItem | undefined

	if (definition) {
		// get items for active category
		meta = Object.values(HelpConfig).find((c) =>
			c?.definitions?.find((d) => d === definition),
		)
	} else {
		// get all items
		let definitions: string[] = []
		let external: ExternalItems = []

		Object.values(HelpConfig).forEach((c) => {
			definitions = definitions.concat([...(c.definitions || [])])
			external = external.concat([...(c.external || [])])
		})
		meta = { definitions, external }
	}

	let definitions = meta?.definitions ?? []

	const activeDefinitions = definitions
		.filter((d) => d !== definition)
		.map((d) => {
			const localeKey = camelize(d)

			return fillVariables(
				{
					title: t(`definitions.${localeKey}.0`),
					description: i18n.getResource(
						i18n.resolvedLanguage ?? DefaultLocale,
						'help',
						`definitions.${localeKey}.1`,
					),
				},
				['title', 'description'],
			)
		})

	// Filter definitions based on search term
	const filteredDefinitions = activeDefinitions.filter((item) => {
		if (!searchTerm.trim()) {
			return true
		}
		const searchLower = searchTerm.toLowerCase()
		return (
			item.title.toLowerCase().includes(searchLower) ||
			(Array.isArray(item.description)
				? item.description.some((desc: string) =>
						desc.toLowerCase().includes(searchLower),
					)
				: item.description.toLowerCase().includes(searchLower))
		)
	})

	// get active definiton
	const activeRecord = definition
		? definitions.find((d) => d === definition)
		: null

	let activeDefinition: DefinitionWithKeys | null = null
	if (activeRecord) {
		const localeKey = camelize(activeRecord)

		const title = t(`definitions.${localeKey}.0`)
		const description = i18n.getResource(
			i18n.resolvedLanguage ?? DefaultLocale,
			'help',
			`definitions.${localeKey}.1`,
		)

		activeDefinition = fillVariables(
			{
				title,
				description,
			},
			['title', 'description'],
		)

		// filter active definition
		definitions = definitions.filter((d: string) => d !== definition)
	}

	// accumulate external resources
	const externals = meta?.external ?? []
	const activeExternals = externals.map((e) => {
		const localeKey = e[0]
		const url = e[1]
		const website = e[2]

		return {
			title: t(`externals.${localeKey}`),
			url,
			website,
		}
	})

	// Filter articles based on search term
	const filteredExternals = activeExternals.filter((item) => {
		if (!searchTerm.trim()) {
			return true
		}
		const searchLower = searchTerm.toLowerCase()
		return (
			item.title.toLowerCase().includes(searchLower) ||
			item.website.toLowerCase().includes(searchLower)
		)
	})

	// Tabbed UI: show tab bar and switch content
	if (!definition) {
		const path = advancedMode ? 'advanced' : 'essential'
		const pathResources = HelpResourceItems[path]
		const pathResourceCount = pathResources.length

		// Format resources with correct language content
		const resourcesContent = pathResources.map((key) => {
			const question = t(`${path}.resources.${key}.q`, { ns: 'helpResources' })
			const answer = t(`${path}.resources.${key}.a`, { ns: 'helpResources' })
			return {
				id: key,
				question,
				answer,
			}
		})

		// Filter resources based on search term
		const filteredResources = resourcesContent.filter(
			(item: { question: string; answer: string }) => {
				if (!searchTerm.trim()) {
					return true
				}
				const searchLower = searchTerm.toLowerCase()
				const questionProcessed = item.question
					.replace(/\{network\}/g, capitalizedNetwork)
					.replace(/\{token\}/g, networkUnit)
					.toLowerCase()
				const answerProcessed = item.answer
					.replace(/\{network\}/g, capitalizedNetwork)
					.replace(/\{token\}/g, networkUnit)
					.toLowerCase()

				return (
					questionProcessed.includes(searchLower) ||
					answerProcessed.includes(searchLower)
				)
			},
		)
		return (
			<Container
				initial={{ opacity: 0, scale: 1.05 }}
				animate={controls}
				transition={{ duration: 0.2 }}
				variants={{
					hidden: { opacity: 0, scale: 1.05 },
					visible: { opacity: 1, scale: 1 },
				}}
				style={{ zIndex: 20 }}
			>
				<Scroll ref={scrollRef}>
					<ModalContent>
						<Content
							size="lg"
							style={{ alignItems: 'flex-start', padding: '0 1rem' }}
						>
							<div
								style={{
									padding: '0 0.1rem',
									display: 'flex',
									width: '100%',
									justifyContent: 'flex-end',
								}}
							>
								<ButtonPrimaryInvert
									lg
									text={t('modal.close', { ns: 'help' })}
									onClick={() => closeHelp()}
								/>
							</div>
							{/* Tab Bar */}
							<TabBar>
								<TabButton
									selected={tab === 'resources'}
									onClick={() => setTab('resources')}
									type="button"
								>
									<BookSVG
										style={{
											width: '1.1em',
											height: '1.1em',
											marginRight: '0.5em',
											verticalAlign: 'middle',
										}}
									/>
									{t('modal.resources', { ns: 'help' })}
								</TabButton>
								<TabButton
									selected={tab === 'definitions'}
									onClick={() => setTab('definitions')}
									type="button"
								>
									<GlassesSVG
										style={{
											width: '1.1em',
											height: '1.1em',
											marginRight: '0.5em',
											verticalAlign: 'middle',
										}}
									/>
									{t('modal.definitions', { ns: 'help' })}
								</TabButton>
								<TabButton
									selected={tab === 'articles'}
									onClick={() => setTab('articles')}
									type="button"
								>
									<ForumSVG
										style={{
											width: '1.1em',
											height: '1.1em',
											marginRight: '0.5em',
											verticalAlign: 'middle',
										}}
									/>
									{t('modal.articles', { ns: 'help' })}
								</TabButton>
							</TabBar>
							{/* Tab Content */}
							{tab === 'resources' && (
								<>
									<HelpTitle>
										{t(`${path}.title`, { ns: 'helpResources' })}
									</HelpTitle>
									<h3 style={{ margin: '0 0 1.5rem 0' }}>
										{t(`${path}.description`, { ns: 'helpResources' })}
									</h3>

									{/* Search Input */}
									<div style={{ marginBottom: '1.5rem', width: '100%' }}>
										<SearchInput
											value={searchTerm}
											handleChange={(e) => setSearchTerm(e.currentTarget.value)}
											placeholder={`Search ${filteredResources.length} ${t('modal.resources', { ns: 'help' })}...`}
											secondary
										/>
										{searchTerm && (
											<p
												style={{
													margin: '0.5rem 0 0 0',
													fontSize: '0.9rem',
													color: 'var(--text-color-secondary)',
												}}
											>
												{filteredResources.length === 0
													? t('modal.noResultsFound', {
															ns: 'help',
														})
													: t('modal.showingFoundOfTotal', {
															ns: 'help',
															found: filteredResources.length,
															total: pathResourceCount,
														})}
											</p>
										)}
									</div>

									{filteredResources.map(
										(item: { question: string; answer: string }, i: number) => (
											<Definition
												key={`lp_def_${i}`}
												title={item.question
													.replace(/\{network\}/g, capitalizedNetwork)
													.replace(/\{token\}/g, networkUnit)}
												description={[
													item.answer
														.replace(/\{network\}/g, capitalizedNetwork)
														.replace(/\{token\}/g, networkUnit),
												]}
											/>
										),
									)}
								</>
							)}

							{tab === 'definitions' && (
								<>
									<HelpTitle>
										{t('modal.definitions', { ns: 'help' })}
									</HelpTitle>

									{activeDefinitions.length > 0 && (
										<>
											{/* Search Input for Definitions */}
											<div style={{ marginBottom: '1.5rem', width: '100%' }}>
												<SearchInput
													value={searchTerm}
													handleChange={(e) =>
														setSearchTerm(e.currentTarget.value)
													}
													placeholder={`${t('search', { ns: 'app' })} ${filteredDefinitions.length} ${t('modal.definitions', { ns: 'help' })}...`}
													secondary
												/>
												{searchTerm && (
													<p
														style={{
															margin: '0.5rem 0 0 0',
															fontSize: '0.9rem',
															color: 'var(--text-color-secondary)',
														}}
													>
														{filteredDefinitions.length === 0
															? t('modal.noResultsFound', {
																	ns: 'help',
																})
															: t('modal.showingFoundOfTotal', {
																	ns: 'help',
																	found: filteredDefinitions.length,
																	total: activeDefinitions.length,
																})}
													</p>
												)}
											</div>

											{filteredDefinitions.map((item, index: number) => (
												<Definition
													key={`def_${index}`}
													title={t(item.title, { ns: 'help' })}
													description={item.description}
												/>
											))}
										</>
									)}
								</>
							)}

							{tab === 'articles' && (
								<>
									<HelpTitle>
										{t('modal.articles', 'Articles', { ns: 'help' })}
									</HelpTitle>
									{activeExternals.length > 0 ? (
										<>
											{/* Search Input for Articles */}
											<div style={{ marginBottom: '1.5rem', width: '100%' }}>
												<SearchInput
													value={searchTerm}
													handleChange={(e) =>
														setSearchTerm(e.currentTarget.value)
													}
													placeholder={`Search ${filteredExternals.length} ${t('modal.articles', { ns: 'help' })}...`}
													secondary
												/>
												{searchTerm && (
													<p
														style={{
															margin: '0.5rem 0 0 0',
															fontSize: '0.9rem',
															color: 'var(--text-color-secondary)',
														}}
													>
														{filteredExternals.length === 0
															? t('modal.noResultsFound', {
																	ns: 'help',
																})
															: t('modal.showingFoundOfTotal', {
																	ns: 'help',
																	found: filteredExternals.length,
																	total: activeExternals.length,
																})}
													</p>
												)}
											</div>

											{filteredExternals.map((item, index: number) => (
												<External
													key={`ext_${index}`}
													width="100%"
													title={t(item.title, { ns: 'help' })}
													url={item.url}
													website={item.website}
												/>
											))}
										</>
									) : (
										<p>
											{t('modal.noArticles', 'No articles available.', {
												ns: 'help',
											})}
										</p>
									)}
								</>
							)}
						</Content>
					</ModalContent>
				</Scroll>
				<button type="button" className="close" onClick={() => closeHelp()}>
					&nbsp;
				</button>
			</Container>
		)
	}

	return (
		<Container
			initial={{
				opacity: 0,
				scale: 1.05,
			}}
			animate={controls}
			transition={{
				duration: 0.2,
			}}
			variants={{
				hidden: {
					opacity: 0,
					scale: 1.05,
				},
				visible: {
					opacity: 1,
					scale: 1,
				},
			}}
			style={{
				zIndex: 20,
			}}
		>
			<Scroll ref={scrollRef}>
				<ModalContent>
					<Content size="lg" style={{ alignItems: 'flex-start' }}>
						<div
							style={{
								padding: '0 0.1rem',
								display: 'flex',
								width: '100%',
								justifyContent: 'flex-end',
							}}
						>
							<ButtonPrimaryInvert
								lg
								text={t('modal.close', { ns: 'help' })}
								onClick={() => closeHelp()}
							/>
						</div>
						<HelpTitle>
							{activeDefinition
								? `${t(activeDefinition.title, { ns: 'help' })}`
								: `${t('modal.helpResources', { ns: 'help' })}`}
						</HelpTitle>

						{activeDefinition !== null && (
							<ActiveDefinition description={activeDefinition?.description} />
						)}

						{definitions.length > 0 && (
							<>
								<HelpSubtitle>
									{t('modal.definitions', { ns: 'help' })}
								</HelpSubtitle>
								{activeDefinitions.map((item, index: number) => (
									<Definition
										key={`def_${index}`}
										title={t(item.title, { ns: 'help' })}
										description={item.description}
									/>
								))}
							</>
						)}

						{activeExternals.length > 0 && (
							<>
								<HelpSubtitle>
									{t('modal.articles', { ns: 'help' })}
								</HelpSubtitle>
								{activeExternals.map((item, index: number) => (
									<External
										key={`ext_${index}`}
										width="100%"
										title={t(item.title, { ns: 'help' })}
										url={item.url}
										website={item.website}
									/>
								))}
							</>
						)}
					</Content>
				</ModalContent>
			</Scroll>
			<button type="button" className="close" onClick={() => closeHelp()}>
				&nbsp;
			</button>
		</Container>
	)
}
