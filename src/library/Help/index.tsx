// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faTimes } from '@fortawesome/free-solid-svg-icons';
import {
  ButtonPrimaryInvert,
  CanvasContainer,
  ModalContent,
  CanvasScroll,
} from '@polkadot-cloud/react';
import { camelize } from '@polkadot-cloud/utils';
import { useAnimation } from 'framer-motion';
import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { HelpConfig } from 'config/help';
import { DefaultLocale } from 'consts';
import { useHelp } from 'contexts/Help';
import type {
  DefinitionWithKeys,
  ExternalItems,
  HelpItem,
} from 'contexts/Help/types';
import { useFillVariables } from 'library/Hooks/useFillVariables';
import { Definition } from './Items/Definition';
import { External } from './Items/External';
import { ActiveDefinition } from './Items/ActiveDefinition';

export const Help = () => {
  const { t, i18n } = useTranslation('help');
  const controls = useAnimation();
  const { fillVariables } = useFillVariables();
  const { setStatus, status, definition, closeHelp } = useHelp();

  const onFadeIn = useCallback(async () => {
    await controls.start('visible');
  }, []);

  const onFadeOut = useCallback(async () => {
    await controls.start('hidden');
    setStatus('closed');
  }, []);

  // control canvas fade.
  useEffect(() => {
    if (status === 'open') {
      onFadeIn();
    }
    if (status === 'closing') {
      onFadeOut();
    }
  }, [status]);

  // render early if help not open
  if (status === 'closed') {
    return null;
  }

  let meta: HelpItem | undefined;

  if (definition) {
    // get items for active category
    meta = Object.values(HelpConfig).find((c) =>
      c?.definitions?.find((d) => d === definition)
    );
  } else {
    // get all items
    let definitions: string[] = [];
    let external: ExternalItems = [];

    Object.values(HelpConfig).forEach((c) => {
      definitions = definitions.concat([...(c.definitions || [])]);
      external = external.concat([...(c.external || [])]);
    });
    meta = { definitions, external };
  }

  let definitions = meta?.definitions ?? [];

  const activeDefinitions = definitions
    .filter((d) => d !== definition)
    .map((d) => {
      const localeKey = camelize(d);

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
      );
    });

  // get active definiton
  const activeRecord = definition
    ? definitions.find((d) => d === definition)
    : null;

  let activeDefinition: DefinitionWithKeys | null = null;
  if (activeRecord) {
    const localeKey = camelize(activeRecord);

    const title = t(`definitions.${localeKey}.0`);
    const description = i18n.getResource(
      i18n.resolvedLanguage ?? DefaultLocale,
      'help',
      `definitions.${localeKey}.1`
    );

    activeDefinition = fillVariables(
      {
        title,
        description,
      },
      ['title', 'description']
    );

    // filter active definition
    definitions = definitions.filter((d: string) => d !== definition);
  }

  // accumulate external resources
  const externals = meta?.external ?? [];
  const activeExternals = externals.map((e) => {
    const localeKey = e[0];
    const url = e[1];
    const website = e[2];

    return {
      title: t(`externals.${localeKey}`),
      url,
      website,
    };
  });

  return (
    <CanvasContainer
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
      <CanvasScroll>
        <ModalContent>
          <div className="buttons">
            <ButtonPrimaryInvert
              lg
              text={t('modal.close')}
              iconLeft={faTimes}
              onClick={() => closeHelp()}
            />
          </div>
          <h1>
            {activeDefinition
              ? `${activeDefinition.title}`
              : `${t('modal.helpResources')}`}
          </h1>

          {activeDefinition !== null && (
            <ActiveDefinition description={activeDefinition?.description} />
          )}

          {definitions.length > 0 && (
            <>
              <h3>
                {activeDefinition ? `${t('modal.related')} ` : ''}
                {t('modal.definitions')}
              </h3>
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
              <h3>{t('modal.articles')}</h3>
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
        </ModalContent>
      </CanvasScroll>
      <button type="button" className="close" onClick={() => closeHelp()}>
        &nbsp;
      </button>
    </CanvasContainer>
  );
};
