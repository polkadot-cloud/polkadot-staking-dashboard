// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { camelize } from '@w3ux/utils'
import DiscordSVG from 'assets/brands/discord.svg?react'
import BookSVG from 'assets/icons/book.svg?react'
import EnvelopeSVG from 'assets/icons/envelope.svg?react'
import ForumSVG from 'assets/icons/forum.svg?react'
import GlassesSVG from 'assets/icons/glasses.svg?react'
import { HelpConfig } from 'config/help'
import { HelpResourceItems } from 'config/helpResources'
import { DiscordSupportUrl, MailSupportAddress } from 'consts'
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
import { CardWrapper as Card } from 'library/Card/Wrappers'
import { DefaultLocale } from 'locales'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ButtonPrimaryInvert } from 'ui-buttons'
import { Container, Content, Scroll } from 'ui-core/canvas'
import { Content as ModalContent } from 'ui-core/modal'
import { ActiveDefinition } from './Items/ActiveDefinition'
import { Definition } from './Items/Definition'
import { External } from './Items/External'
import {
  HelpSubtitle,
  HelpTitle,
  StyledSupportButton,
  TabBar,
  TabButton,
} from './Wrappers'

export const Help = () => {
  const { t, i18n } = useTranslation()
  const controls = useAnimation()
  const { fillVariables } = useFillVariables()
  const { setStatus, status, definition, closeHelp } = useHelp()
  const { advancedMode, setAdvancedMode } = useUi()
  const scrollRef = useRef<HTMLDivElement>(null)
  const { network } = useNetwork()
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

  useEffect(() => {
    // When switching between easy/advanced, scroll to top and trigger reflow
    if (status === 'open' && scrollRef.current) {
      scrollRef.current.scrollTop = 0
      // Trigger a window resize event to force modal recalculation
      window.dispatchEvent(new Event('resize'))
    }
  }, [advancedMode, status])

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
      c?.definitions?.find((d) => d === definition)
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
            `definitions.${localeKey}.1`
          ),
        },
        ['title', 'description']
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
            desc.toLowerCase().includes(searchLower)
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
      `definitions.${localeKey}.1`
    )

    activeDefinition = fillVariables(
      {
        title,
        description,
      },
      ['title', 'description']
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
      }
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
                  {t('modal.resourcesTab', 'Resources', { ns: 'help' })}
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
                  {t('modal.definitionsTab', 'Definitions', { ns: 'help' })}
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
                  {t('modal.articlesTab', 'Articles', { ns: 'help' })}
                </TabButton>
                <TabButton
                  selected={tab === 'support'}
                  onClick={() => setTab('support')}
                  type="button"
                >
                  <EnvelopeSVG
                    style={{
                      width: '1.1em',
                      height: '1.1em',
                      marginRight: '0.5em',
                      verticalAlign: 'middle',
                    }}
                  />
                  {t('modal.supportTab', 'Support', { ns: 'help' })}
                </TabButton>
              </TabBar>
              {/* Tab Content */}
              {tab === 'resources' ? (
                <>
                  <HelpTitle>
                    {t(`${path}.title`, { ns: 'helpResources' })}
                  </HelpTitle>
                  <h3 style={{ margin: '0 0 1.5rem 0' }}>
                    {t(`${path}.description`, { ns: 'helpResources' })}
                  </h3>

                  {/* Search Input */}
                  <div style={{ marginBottom: '1.5rem', width: '100%' }}>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        placeholder={`Search ${filteredResources.length} resources...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.75rem 1rem',
                          borderRadius: '0.75rem',
                          border: '1px solid var(--border-primary)',
                          background: 'var(--background-default)',
                          color: 'var(--text-color-primary)',
                          fontSize: '1rem',
                          fontFamily: 'Inter, sans-serif',
                          outline: 'none',
                          transition: 'border-color 0.2s ease',
                          boxSizing: 'border-box',
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor =
                            'var(--accent-color-primary)'
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = 'var(--border-primary)'
                        }}
                      />
                      {searchTerm && (
                        <button
                          onClick={() => setSearchTerm('')}
                          style={{
                            position: 'absolute',
                            right: '0.75rem',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-color-secondary)',
                            cursor: 'pointer',
                            padding: '0.25rem',
                            fontSize: '1.1rem',
                          }}
                          title="Clear search"
                        >
                          ×
                        </button>
                      )}
                    </div>
                    {searchTerm && (
                      <p
                        style={{
                          margin: '0.5rem 0 0 0',
                          fontSize: '0.9rem',
                          color: 'var(--text-color-secondary)',
                        }}
                      >
                        {filteredResources.length === 0
                          ? 'No resources found matching your search.'
                          : `Showing ${filteredResources.length} of ${pathResourceCount} resources`}
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
                    )
                  )}
                  <div style={{ marginTop: '2rem', width: '100%' }}>
                    <ButtonPrimaryInvert
                      text={
                        advancedMode
                          ? t('navigation.advancedToBasic', {
                              ns: 'helpResources',
                            })
                          : t('navigation.basicToAdvanced', {
                              ns: 'helpResources',
                            })
                      }
                      onClick={() => setAdvancedMode(!advancedMode)}
                    />
                  </div>
                </>
              ) : tab === 'definitions' ? (
                <>
                  <HelpTitle>
                    {t('modal.definitions', 'Definitions', { ns: 'help' })}
                  </HelpTitle>

                  {activeDefinitions.length > 0 && (
                    <>
                      {/* Search Input for Definitions */}
                      <div style={{ marginBottom: '1.5rem', width: '100%' }}>
                        <div style={{ position: 'relative' }}>
                          <input
                            type="text"
                            placeholder={`Search ${filteredDefinitions.length} definitions...`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                              width: '100%',
                              padding: '0.75rem 1rem',
                              borderRadius: '0.75rem',
                              border: '1px solid var(--border-primary)',
                              background: 'var(--background-default)',
                              color: 'var(--text-color-primary)',
                              fontSize: '1rem',
                              fontFamily: 'Inter, sans-serif',
                              outline: 'none',
                              transition: 'border-color 0.2s ease',
                              boxSizing: 'border-box',
                            }}
                            onFocus={(e) => {
                              e.target.style.borderColor =
                                'var(--accent-color-primary)'
                            }}
                            onBlur={(e) => {
                              e.target.style.borderColor =
                                'var(--border-primary)'
                            }}
                          />
                          {searchTerm && (
                            <button
                              onClick={() => setSearchTerm('')}
                              style={{
                                position: 'absolute',
                                right: '0.75rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'none',
                                border: 'none',
                                color: 'var(--text-color-secondary)',
                                cursor: 'pointer',
                                padding: '0.25rem',
                                fontSize: '1.1rem',
                              }}
                              title="Clear search"
                            >
                              ×
                            </button>
                          )}
                        </div>
                        {searchTerm && (
                          <p
                            style={{
                              margin: '0.5rem 0 0 0',
                              fontSize: '0.9rem',
                              color: 'var(--text-color-secondary)',
                            }}
                          >
                            {filteredDefinitions.length === 0
                              ? 'No definitions found matching your search.'
                              : `Showing ${filteredDefinitions.length} of ${activeDefinitions.length} definitions`}
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
              ) : tab === 'articles' ? (
                <>
                  <HelpTitle>
                    {t('modal.articles', 'Articles', { ns: 'help' })}
                  </HelpTitle>
                  {activeExternals.length > 0 ? (
                    <>
                      {/* Search Input for Articles */}
                      <div style={{ marginBottom: '1.5rem', width: '100%' }}>
                        <div style={{ position: 'relative' }}>
                          <input
                            type="text"
                            placeholder={`Search ${filteredExternals.length} articles...`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                              width: '100%',
                              padding: '0.75rem 1rem',
                              borderRadius: '0.75rem',
                              border: '1px solid var(--border-primary)',
                              background: 'var(--background-default)',
                              color: 'var(--text-color-primary)',
                              fontSize: '1rem',
                              fontFamily: 'Inter, sans-serif',
                              outline: 'none',
                              transition: 'border-color 0.2s ease',
                              boxSizing: 'border-box',
                            }}
                            onFocus={(e) => {
                              e.target.style.borderColor =
                                'var(--accent-color-primary)'
                            }}
                            onBlur={(e) => {
                              e.target.style.borderColor =
                                'var(--border-primary)'
                            }}
                          />
                          {searchTerm && (
                            <button
                              onClick={() => setSearchTerm('')}
                              style={{
                                position: 'absolute',
                                right: '0.75rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'none',
                                border: 'none',
                                color: 'var(--text-color-secondary)',
                                cursor: 'pointer',
                                padding: '0.25rem',
                                fontSize: '1.1rem',
                              }}
                              title="Clear search"
                            >
                              ×
                            </button>
                          )}
                        </div>
                        {searchTerm && (
                          <p
                            style={{
                              margin: '0.5rem 0 0 0',
                              fontSize: '0.9rem',
                              color: 'var(--text-color-secondary)',
                            }}
                          >
                            {filteredExternals.length === 0
                              ? 'No articles found matching your search.'
                              : `Showing ${filteredExternals.length} of ${activeExternals.length} articles`}
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
              ) : (
                // Support tab
                <div
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '2rem',
                  }}
                >
                  <Card
                    style={{
                      maxWidth: 420,
                      width: '100%',
                      padding: '2rem 2rem 1.5rem 2rem',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                    }}
                  >
                    <HelpTitle
                      style={{ margin: '0 0 1.25rem 0', textAlign: 'center' }}
                    >
                      {t('modal.support', 'Support', { ns: 'help' })}
                    </HelpTitle>
                    <p
                      style={{
                        margin: '0 0 1.5rem 0',
                        color: 'var(--text-color-primary)',
                        textAlign: 'center',
                      }}
                    >
                      {t('modal.supportIntro', { ns: 'help' })}
                    </p>
                    <StyledSupportButton
                      href={DiscordSupportUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <DiscordSVG
                        style={{
                          width: '1.2em',
                          height: '1.2em',
                          verticalAlign: 'middle',
                        }}
                      />
                      {t('modals:goToDiscord', { ns: 'help' })}
                    </StyledSupportButton>
                    <StyledSupportButton href={`mailto:${MailSupportAddress}`}>
                      <EnvelopeSVG
                        style={{
                          width: '1.2em',
                          height: '1.2em',
                          verticalAlign: 'middle',
                        }}
                      />
                      {t('pages:email', { ns: 'help' })}
                    </StyledSupportButton>
                    <p
                      style={{
                        color: 'var(--text-color-secondary)',
                        textAlign: 'center',
                        margin: 0,
                      }}
                    >
                      {t('modal.supportOutro', { ns: 'help' })}
                    </p>
                  </Card>
                </div>
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
                ? `${activeDefinition.title}`
                : `${t('modal.helpResources', { ns: 'help' })}`}
            </HelpTitle>

            {activeDefinition !== null && (
              <ActiveDefinition description={activeDefinition?.description} />
            )}

            {definitions.length > 0 && (
              <>
                <HelpSubtitle>
                  {activeDefinition
                    ? `${t('modal.related', { ns: 'help' })} `
                    : ''}
                  {t('modal.definitions', { ns: 'help' })}
                </HelpSubtitle>
                {activeDefinitions.map((item, index: number) => (
                  <Definition
                    key={`def_${index}`}
                    title={item.title}
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
                    title={t(item.title)}
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
