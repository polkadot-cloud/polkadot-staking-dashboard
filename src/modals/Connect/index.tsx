// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import {
  ActionItem,
  ButtonPrimaryInvert,
  ButtonTab,
  ModalCustomHeader,
  ModalMotionThreeSection,
  ModalSection,
} from '@polkadotcloud/core-ui';
import { Extensions } from 'config/extensions';
import { useExtensions } from 'contexts/Extensions';
import { useModal } from 'contexts/Modal';
import { Close } from 'library/Modal/Close';
import { SelectItems } from 'library/SelectItems';
import { FixedTitleWrapper, PaddingWrapper } from 'modals/Wrappers';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { AnyFunction } from 'types';
import { Extension } from './Extension';
import { Ledger } from './Ledger';
import { Proxies } from './Proxies';
import { ReadOnly } from './ReadOnly';
import { Vault } from './Vault';
import { ExtensionsWrapper } from './Wrappers';

export const Connect = () => {
  const { t } = useTranslation('modals');
  const { extensions } = useExtensions();
  const { replaceModalWith, setModalHeight, modalMaxHeight } = useModal();

  const installed = Extensions.filter((a) =>
    extensions.find((b) => b.id === a.id)
  );

  const other = Extensions.filter((a) => !installed.find((b) => b.id === a.id));

  // toggle read only management
  const [readOnlyOpen, setReadOnlyOpen] = useState(false);

  // toggle proxy delegate management
  const [newProxyOpen, setNewProxyOpen] = useState(false);

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
  }, [section, readOnlyOpen, newProxyOpen, extensions]);

  useEffect(() => {
    window.addEventListener('resize', refreshModalHeight);
    return () => {
      window.removeEventListener('resize', refreshModalHeight);
    };
  }, []);

  return (
    <>
      <ModalSection type="carousel">
        <Close />
        <FixedTitleWrapper ref={headerRef} isStyled>
          <ModalCustomHeader>
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
            <ModalSection type="tab">
              <ButtonTab
                title={t('extensions')}
                onClick={() => setSection(0)}
                active={section === 0}
              />
              <ButtonTab
                title={t('readOnly')}
                onClick={() => setSection(1)}
                active={section === 1}
              />
              <ButtonTab
                title={t('proxies')}
                onClick={() => setSection(2)}
                active={section === 2}
              />
            </ModalSection>
          </ModalCustomHeader>
        </FixedTitleWrapper>

        <ModalMotionThreeSection
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
          <div className="section">
            <PaddingWrapper horizontalOnly ref={homeRef}>
              <ActionItem text={t('hardware')} />
              <ExtensionsWrapper>
                <SelectItems layout="two-col">
                  {[Vault, Ledger].map((Item: AnyFunction, i: number) => (
                    <Item key={`hardware_item_${i}`} />
                  ))}
                </SelectItems>
              </ExtensionsWrapper>

              <ActionItem text={t('web')} />
              <ExtensionsWrapper>
                <SelectItems layout="two-col">
                  {installed.concat(other).map((extension, i) => (
                    <Extension key={`extension_item_${i}`} meta={extension} />
                  ))}
                </SelectItems>
              </ExtensionsWrapper>
            </PaddingWrapper>
          </div>
          <div className="section">
            <PaddingWrapper horizontalOnly ref={readOnlyRef}>
              <ReadOnly
                setInputOpen={setReadOnlyOpen}
                inputOpen={readOnlyOpen}
              />
            </PaddingWrapper>
          </div>
          <div className="section">
            <PaddingWrapper horizontalOnly ref={proxiesRef}>
              <Proxies
                setInputOpen={setNewProxyOpen}
                inputOpen={newProxyOpen}
              />
            </PaddingWrapper>
          </div>
        </ModalMotionThreeSection>
      </ModalSection>
    </>
  );
};
