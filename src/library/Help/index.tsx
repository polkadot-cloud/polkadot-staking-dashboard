// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useEffect, useRef } from 'react';
import { useAnimation } from 'framer-motion';
import { useHelp } from 'contexts/Help';
import { capitalizeFirstLetter, pageFromUri } from 'Utils';
import { useLocation } from 'react-router-dom';
import { ASSISTANT_CONFIG } from 'config/assistant';
import { HelpDefinition, HelpExternal } from 'contexts/Help/types';
import { Wrapper, ContentWrapper, HeightWrapper } from './Wrappers';
import Definition from './Items/Definition';
import External from './Items/External';

export const Help = () => {
  const {
    setHelpHeight,
    setStatus,
    status,
    resize,
    setPage,
    page,
    fillDefinitionVariables,
    definition,
    closeHelp,
  } = useHelp();
  const controls = useAnimation();

  const maxHeight = window.innerHeight * 0.8;

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

  const { pathname } = useLocation();

  const setPageOnPathname = useCallback(() => {
    setPage(pageFromUri(pathname));
  }, [pathname]);

  useEffect(() => setPageOnPathname(), [setPageOnPathname]);

  const modalRef = useRef<HTMLDivElement>(null);

  // resize on status or resize change
  useEffect(() => {
    handleResize();
  }, [resize]);

  const handleResize = () => {
    let _height = modalRef.current?.clientHeight ?? 0;
    _height = _height > maxHeight ? maxHeight : _height;
    setHelpHeight(_height);
  };

  if (status === 0) {
    return <></>;
  }

  let pageMeta: any;
  if (definition) {
    // get page meta from active page
    pageMeta = Object.values(ASSISTANT_CONFIG).find(
      (item: any) => item.key === page
    );
  } else {
    let _definitions: any = [];
    let _external: any = [];
    Object.values(ASSISTANT_CONFIG).forEach((category: any) => {
      _definitions = _definitions.concat([...(category.definitions || [])]);
      _external = _external.concat([...(category.external || [])]);
    });
    pageMeta = { definitions: _definitions, external: _external };
  }

  // get active section
  const activeSection = capitalizeFirstLetter(page);

  // resources to display
  let definitions = pageMeta?.definitions ?? [];

  // get active definiton
  const activeDefinition = definition
    ? fillDefinitionVariables(
        definitions.find((d: any) => d.title === definition)
      )
    : null;

  // filter active definition
  definitions = definitions.filter((d: any) => d.title !== definition);

  // get external resources
  const external = pageMeta?.external ?? [];

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
          <ContentWrapper ref={modalRef}>
            <h1>
              {activeDefinition
                ? `${activeDefinition.title}`
                : `Help Resources`}
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

            {/* Display definitions */}
            {definitions.length > 0 && (
              <>
                <h3>
                  {activeDefinition ? `Related ` : ''}
                  Definitions
                </h3>
                {definitions.map((item: HelpDefinition, index: number) => {
                  item = fillDefinitionVariables(item);
                  return (
                    <Definition
                      key={`def_${index}`}
                      onClick={() => {}}
                      title={item.title}
                      description={item.description}
                    />
                  );
                })}
              </>
            )}

            {/* Display external */}
            {external.length > 0 && (
              <>
                <h3>Articles</h3>
                {external.map((item: HelpExternal, index: number) => {
                  const thisRteturn = (
                    <External
                      key={`ext_${index}`}
                      width="100%"
                      label={item.label}
                      title={item.title}
                      subtitle={item.subtitle}
                      url={item.url}
                      website={item.website}
                    />
                  );

                  return thisRteturn;
                })}
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
