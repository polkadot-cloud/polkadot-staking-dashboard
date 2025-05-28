// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { camelize } from '@w3ux/utils'
import { HelpConfig } from 'config/help'
import { useHelp } from 'contexts/Help'
import type {
  DefinitionWithKeys,
  ExternalItems,
  HelpItem,
} from 'contexts/Help/types'
import { useUi } from 'contexts/UI'
import { useAnimation } from 'framer-motion'
import { useFillVariables } from 'hooks/useFillVariables'
import { DefaultLocale } from 'locales'
import React, { useCallback, useEffect, useRef } from 'react'
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
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import helpResourcesEn from './helpresources.json'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import helpResourcesEs from '../../../../locales/src/resources/es/helpresources.json'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import DiscordSVG from 'assets/brands/discord.svg?react'
import BookSVG from 'assets/icons/book.svg?react'
import EnvelopeSVG from 'assets/icons/envelope.svg?react'
import ForumSVG from 'assets/icons/forum.svg?react'
import GlassesSVG from 'assets/icons/glasses.svg?react'
import { DiscordSupportUrl, MailSupportAddress } from 'consts'
import { NetworkList } from 'consts/networks'
import { useNetwork } from 'contexts/Network'
import { CardWrapper as Card } from 'library/Card/Wrappers'
import helpResourcesZh from '../../../../locales/src/resources/zh/helpresources.json'

export const Help = () => {
  const { t, i18n } = useTranslation('help')
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

  // Select helpresources file based on language
  let helpResources: typeof helpResourcesEn = helpResourcesEn
  if (i18n.resolvedLanguage === 'es') {
    helpResources = helpResourcesEs
  } else if (i18n.resolvedLanguage === 'zh') {
    helpResources = helpResourcesZh
  }

  // Tabbed UI: show tab bar and switch content
  if (!definition) {
    const path = advancedMode ? 'advanced' : 'essential'
    const learningPath = helpResources.learningPaths[path]
    const navigation = helpResources.navigation
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
                  text={t('modal.close')}
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
                  {t('modal.resourcesTab', 'Resources')}
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
                  {t('modal.definitionsTab', 'Definitions')}
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
                  {t('modal.articlesTab', 'Articles')}
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
                  {t('modal.supportTab', 'Support')}
                </TabButton>
              </TabBar>
              {/* Tab Content */}
              {tab === 'resources' ? (
                <>
                  <HelpTitle>{learningPath.title}</HelpTitle>
                  <h3 style={{ margin: '0 0 1.5rem 0' }}>
                    {learningPath.description}
                  </h3>
                  {learningPath.resources.map(
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
                          ? navigation.advancedToBasic
                          : navigation.basicToAdvanced
                      }
                      onClick={() => setAdvancedMode(!advancedMode)}
                    />
                  </div>
                </>
              ) : tab === 'definitions' ? (
                <>
                  <HelpTitle>{t('modal.definitions', 'Definitions')}</HelpTitle>
                  {activeDefinitions.length > 0 && (
                    <>
                      {activeDefinitions.map((item, index: number) => (
                        <Definition
                          key={`def_${index}`}
                          title={item.title}
                          description={item.description}
                        />
                      ))}
                    </>
                  )}
                </>
              ) : tab === 'articles' ? (
                <>
                  <HelpTitle>{t('modal.articles', 'Articles')}</HelpTitle>
                  {activeExternals.length > 0 ? (
                    <>
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
                  ) : (
                    <p>{t('modal.noArticles', 'No articles available.')}</p>
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
                      {t('modal.support', 'Support')}
                    </HelpTitle>
                    <p
                      style={{
                        margin: '0 0 1.5rem 0',
                        color: 'var(--text-color-primary)',
                        textAlign: 'center',
                      }}
                    >
                      {t('modal.supportIntro')}
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
                      {t('modals:goToDiscord')}
                    </StyledSupportButton>
                    <StyledSupportButton href={`mailto:${MailSupportAddress}`}>
                      <EnvelopeSVG
                        style={{
                          width: '1.2em',
                          height: '1.2em',
                          verticalAlign: 'middle',
                        }}
                      />
                      {t('pages:email')}
                    </StyledSupportButton>
                    <p
                      style={{
                        color: 'var(--text-color-secondary)',
                        textAlign: 'center',
                        margin: 0,
                      }}
                    >
                      {t('modal.supportOutro')}
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
                text={t('modal.close')}
                onClick={() => closeHelp()}
              />
            </div>
            <HelpTitle>
              {activeDefinition
                ? `${activeDefinition.title}`
                : `${t('modal.helpResources')}`}
            </HelpTitle>

            {activeDefinition !== null && (
              <ActiveDefinition description={activeDefinition?.description} />
            )}

            {definitions.length > 0 && (
              <>
                <HelpSubtitle>
                  {activeDefinition ? `${t('modal.related')} ` : ''}
                  {t('modal.definitions')}
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
                <HelpSubtitle>{t('modal.articles')}</HelpSubtitle>
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
