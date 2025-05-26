// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { camelize } from '@w3ux/utils'
import { HelpConfig } from 'config/help'
import { getNetworkData } from 'consts/util'
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
import { DefaultLocale } from 'locales'
import React, { useCallback, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { ButtonPrimaryInvert } from 'ui-buttons'
import { Container, Content, Scroll } from 'ui-core/canvas'
import { Content as ModalContent } from 'ui-core/modal'
import { ActiveDefinition } from './Items/ActiveDefinition'
import { Definition } from './Items/Definition'
import { External } from './Items/External'
import { HelpSubtitle, HelpTitle } from './Wrappers'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import helpResourcesEn from './helpresources.json'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import helpResourcesEs from '../../../../locales/src/resources/es/helpresources.json'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styled from 'styled-components'
import helpResourcesZh from '../../../../locales/src/resources/zh/helpresources.json'

// Tab bar styles
const TabBar = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-primary);
`
const TabButton = styled.button<{ selected: boolean }>`
  background: none;
  border: none;
  outline: none;
  font-family: InterSemiBold, sans-serif;
  font-size: 1.1rem;
  color: ${(p) =>
    p.selected ? 'var(--accent-color-primary)' : 'var(--text-color-secondary)'};
  border-bottom: 2px solid
    ${(p) => (p.selected ? 'var(--accent-color-primary)' : 'transparent')};
  margin-right: 2rem;
  padding: 0.5rem 0;
  cursor: pointer;
  transition:
    color 0.2s,
    border-bottom 0.2s;
`

export const Help = () => {
  const { t, i18n } = useTranslation('help')
  const controls = useAnimation()
  const { fillVariables } = useFillVariables()
  const { setStatus, status, definition, closeHelp } = useHelp()
  const { advancedMode, setAdvancedMode } = useUi()
  const scrollRef = useRef<HTMLDivElement>(null)
  const { network } = useNetwork()
  const { unit, name } = getNetworkData(network)
  const capitalizedNetwork = name.charAt(0).toUpperCase() + name.slice(1)
  const [tab, setTab] = React.useState<
    'resources' | 'definitions' | 'articles'
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
                  {t('modal.resourcesTab', 'Resources')}
                </TabButton>
                <TabButton
                  selected={tab === 'definitions'}
                  onClick={() => setTab('definitions')}
                  type="button"
                >
                  {t('modal.definitionsTab', 'Definitions')}
                </TabButton>
                <TabButton
                  selected={tab === 'articles'}
                  onClick={() => setTab('articles')}
                  type="button"
                >
                  {t('modal.articlesTab', 'Articles')}
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
                          .replace(/\{token\}/g, unit)}
                        description={[
                          item.answer
                            .replace(/\{network\}/g, capitalizedNetwork)
                            .replace(/\{token\}/g, unit),
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
              ) : (
                // Articles tab
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
