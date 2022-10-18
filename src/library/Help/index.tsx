// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faReplyAll, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { HELP_CONFIG } from 'config/help';
import { useHelp } from 'contexts/Help';
import {
  ExternalRecord,
  HelpDefinition,
  HelpExternal,
  HelpExternals,
  HelpRecord,
  HelpRecords,
} from 'contexts/Help/types';
import { useTranslation } from 'react-i18next';
import { useAnimation } from 'framer-motion';
import { useEffect } from 'react';
import { Wrapper, ContentWrapper, HeightWrapper } from './Wrappers';
import Definition from './Items/Definition';
import External from './Items/External';

export const Help = () => {
  const {
    setStatus,
    status,
    fillDefinitionVariables,
    definition,
    closeHelp,
    setDefinition,
  } = useHelp();
  const controls = useAnimation();
  const { t } = useTranslation('common');
  const { t: tHelp, i18n } = useTranslation('help');

  const onFadeIn = async () => {
    await controls.start('visible');
  };

  const onFadeOut = async () => {
    await controls.start('hidden');
    setStatus(0);
  };

  const variants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
    },
  };

  useEffect(() => {
    // help has been opened - fade in
    if (status === 1) {
      onFadeIn();
    }
    // an external component triggered closure - fade out
    if (status === 2) {
      onFadeOut();
    }
  }, [status]);

  // render early if help not open
  if (status === 0) {
    return <></>;
  }

  let meta: any | undefined;

  // if a definition is provided, get it from help config, otherwise
  // return all definitions and external items from the category.
  if (definition) {
    // get items for active category
    meta = Object.values(HELP_CONFIG).find((c: any) =>
      c?.definitions?.find((d: HelpRecord) => d.key === definition)
    );
  } else {
    // get all items
    let _definitions: HelpRecords = [];
    let _external: HelpExternals = [];

    Object.values(HELP_CONFIG).forEach((c: any) => {
      _definitions = _definitions.concat([...(c?.definitions || [])]);
      _external = _external.concat([...(c?.external || [])]);
    });
    meta = { definitions: _definitions, external: _external };
  }

  // accumulate all definition translations for display
  let definitions = meta?.definitions ?? [];
  const activeDefinitions = definitions
    .filter((d: HelpRecord) => d.key !== definition)
    .map((d: HelpRecord) => {
      const { localeKey } = d;

      return fillDefinitionVariables({
        title: tHelp(`${localeKey}.title`),
        description: i18n.getResource(
          i18n.resolvedLanguage,
          'help',
          `${localeKey}.description`
        ),
      });
    });

  // get active definiton
  const activeRecord = definition
    ? definitions.find((d: HelpRecord) => d.key === definition)
    : null;

  let activeDefinition: HelpDefinition | null = null;
  if (activeRecord) {
    const { localeKey } = activeRecord;

    const title = tHelp(`${localeKey}.title`);
    const description = i18n.getResource(
      i18n.resolvedLanguage,
      'help',
      `${localeKey}.description`
    );
    activeDefinition = fillDefinitionVariables({
      title,
      description,
    });

    // filter active definition
    definitions = definitions.filter((d: HelpRecord) => d.key !== definition);
  }

  // accumulate external resources
  const externals = meta?.external ?? [];
  const activeExternals = externals.map((e: ExternalRecord) => {
    const { localeKey, url, website } = e;

    return {
      title: tHelp(localeKey),
      url,
      website,
    };
  });

  return (
    <Wrapper
      initial={{
        opacity: 0,
      }}
      animate={controls}
      transition={{
        duration: 0.25,
      }}
      variants={variants}
    >
      <div>
        <HeightWrapper>
          <ContentWrapper>
            <div className="buttons">
              {activeDefinition && (
                <button type="button" onClick={() => setDefinition(null)}>
                  <FontAwesomeIcon icon={faReplyAll} />
                  {t('library.all_resources')}
                </button>
              )}
              <button type="button" onClick={() => closeHelp()}>
                <FontAwesomeIcon icon={faTimes} />
                {t('library.close')}
              </button>
            </div>
            <h1>
              {activeDefinition
                ? `${activeDefinition.title}`
                : `${t('library.help_resources')}`}
            </h1>

            {activeDefinition !== null && (
              <>
                <Definition
                  open
                  onClick={() => {}}
                  title={activeDefinition.title}
                  description={activeDefinition.description}
                />
              </>
            )}

            {activeDefinitions.length > 0 && (
              <>
                <h3>
                  {activeDefinition ? `${t('library.related')} ` : ''}
                  {t('library.definitions')}
                </h3>
                {activeDefinitions.map(
                  (item: HelpDefinition, index: number) => (
                    <Definition
                      key={`def_${index}`}
                      onClick={() => {}}
                      title={item.title}
                      description={item.description}
                    />
                  )
                )}
              </>
            )}

            {activeExternals.length > 0 && (
              <>
                <h3>{t('library.articles')}</h3>
                {activeExternals.map((item: HelpExternal, index: number) => (
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
          </ContentWrapper>
        </HeightWrapper>
        <button
          type="button"
          className="close"
          onClick={() => {
            closeHelp();
          }}
        >
          &nbsp;
        </button>
      </div>
    </Wrapper>
  );
};
