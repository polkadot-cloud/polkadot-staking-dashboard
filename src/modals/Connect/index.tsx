// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import {
  ActionItem,
  ButtonPrimaryInvert,
  ButtonTab,
} from '@polkadotcloud/core-ui';
import { Extensions } from 'config/extensions';
import { useApi } from 'contexts/Api';
import { useExtensions } from 'contexts/Extensions';
import type { ExtensionConfig } from 'contexts/Extensions/types';
import { useModal } from 'contexts/Modal';
import { Close } from 'library/Modal/Close';
import { SelectItems } from 'library/SelectItems';
import {
  CustomHeaderWrapper,
  FixedTitleWrapper,
  MultiSectionWrapper,
  PaddingWrapper,
  TabsWrapper,
  ThreeSectionWrapper,
  ThreeSectionsWrapper,
} from 'modals/Wrappers';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { AnyFunction } from 'types';
import { Extension } from './Extension';
import { Ledger } from './Ledger';
import { ReadOnly } from './ReadOnly';
import { ExtensionsWrapper } from './Wrappers';

export const Connect = () => {
  const { t } = useTranslation('modals');
  const { network } = useApi();
  const { extensions } = useExtensions();
  const { replaceModalWith, setModalHeight, modalMaxHeight } = useModal();

  const installed = Extensions.filter((a: ExtensionConfig) =>
    extensions.find((b) => b.id === a.id)
  );

  const other = Extensions.filter(
    (a: ExtensionConfig) => !installed.find((b) => b.id === a.id)
  );

  // toggle read only management
  const [readOnlyOpen, setReadOnlyOpen] = useState(false);

  // active modal section
  const [section, setSection] = useState<number>(0);

  // refs for wrappers
  const headerRef = useRef<HTMLDivElement>(null);
  const homeRef = useRef<HTMLDivElement>(null);
  const readOnlyRef = useRef<HTMLDivElement>(null);
  const proxiesRef = useRef<HTMLDivElement>(null);

  const refreshModalHeight = () => {
    // Preserve height by taking largest height from modals.
    let height = headerRef.current?.clientHeight || 0;
    height += Math.max(
      homeRef.current?.clientHeight || 0,
      readOnlyRef.current?.clientHeight || 0,
      proxiesRef.current?.clientHeight || 0
    );
    setModalHeight(height);
  };

  // Resize modal on state change.
  useEffect(() => {
    refreshModalHeight();
  }, [section, readOnlyOpen, extensions]);

  useEffect(() => {
    window.addEventListener('resize', refreshModalHeight);
    return () => {
      window.removeEventListener('resize', refreshModalHeight);
    };
  }, []);

  return (
    <>
      <MultiSectionWrapper>
        <Close />
        <FixedTitleWrapper ref={headerRef} isStyled>
          <CustomHeaderWrapper>
            <div className="first">
              <h1>{t('connect')}</h1>
              <ButtonPrimaryInvert
                text={t('goToAccounts')}
                iconRight={faChevronRight}
                iconTransform="shrink-3"
                onClick={() => replaceModalWith('Accounts', {}, 'large')}
                marginLeft
              />
            </div>
            <TabsWrapper>
              <ButtonTab
                title={t('extensions')}
                onClick={() => setSection(0)}
                active={section === 0}
              />
              <ButtonTab
                title="Read Only"
                onClick={() => setSection(1)}
                active={section === 1}
              />
              <ButtonTab
                title="Proxies"
                onClick={() => setSection(2)}
                active={section === 2}
              />
            </TabsWrapper>
          </CustomHeaderWrapper>
        </FixedTitleWrapper>

        <ThreeSectionsWrapper
          style={{
            maxHeight:
              modalMaxHeight() - (headerRef.current?.clientHeight || 0),
          }}
          animate={
            section === 0 ? 'home' : section === 1 ? 'readOnly' : 'proxies'
          }
          transition={{
            duration: 0.5,
            type: 'spring',
            bounce: 0.1,
          }}
          variants={{
            home: {
              left: 0,
            },
            readOnly: {
              left: '-100%',
            },
            proxies: {
              left: '-200%',
            },
          }}
        >
          <ThreeSectionWrapper>
            <PaddingWrapper ref={homeRef}>
              {['polkadot', 'kusama'].includes(network.name) ? (
                <>
                  <ActionItem text={t('hardware')} />
                  <ExtensionsWrapper>
                    <SelectItems layout="two-col">
                      {[Ledger].map((Item: AnyFunction, i: number) => (
                        <Item key={`hardware_item_${i}`} />
                      ))}
                    </SelectItems>
                  </ExtensionsWrapper>
                </>
              ) : null}

              <ActionItem text="Web" />
              <ExtensionsWrapper>
                <SelectItems layout="two-col">
                  {installed.concat(other).map((extension, i) => (
                    <Extension key={`extension_item_${i}`} meta={extension} />
                  ))}
                </SelectItems>
              </ExtensionsWrapper>
            </PaddingWrapper>
          </ThreeSectionWrapper>
          <ThreeSectionWrapper>
            <PaddingWrapper ref={readOnlyRef}>
              <ReadOnly
                setReadOnlyOpen={setReadOnlyOpen}
                readOnlyOpen={readOnlyOpen}
              />
            </PaddingWrapper>
          </ThreeSectionWrapper>
          <ThreeSectionWrapper>
            <PaddingWrapper ref={proxiesRef}>
              <ReadOnly
                setReadOnlyOpen={setReadOnlyOpen}
                readOnlyOpen={readOnlyOpen}
              />
            </PaddingWrapper>
          </ThreeSectionWrapper>
        </ThreeSectionsWrapper>
      </MultiSectionWrapper>
    </>
  );
};
