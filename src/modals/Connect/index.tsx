// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import {
  ActionItem,
  ButtonPrimaryInvert,
  ButtonTab,
  ModalCustomHeader,
  ModalFixedTitle,
  ModalMotionThreeSection,
  ModalPadding,
  ModalSection,
} from '@polkadot-cloud/react';
import { ExtensionsArray } from '@polkadot-cloud/community/extensions';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useExtensions } from 'contexts/Extensions';
import { Close } from 'library/Modal/Close';
import { SelectItems } from 'library/SelectItems';
import type { AnyFunction } from 'types';
import { useEffectIgnoreInitial } from 'library/Hooks/useEffectIgnoreInitial';
import { useOverlay } from 'contexts/Overlay';
import { Extension } from './Extension';
import { Ledger } from './Ledger';
import { Proxies } from './Proxies';
import { ReadOnly } from './ReadOnly';
import { Vault } from './Vault';
import { ExtensionsWrapper } from './Wrappers';

export const Connect = () => {
  const { t } = useTranslation('modals');
  const { extensions } = useExtensions();
  const { replaceModal, setModalHeight, modalMaxHeight } = useOverlay().modal;

  const installed = ExtensionsArray.filter((a) =>
    extensions.find((b) => b.id === a.id)
  );

  const other = ExtensionsArray.filter(
    (a) => !installed.find((b) => b.id === a.id)
  );

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
  useEffectIgnoreInitial(() => {
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
        <ModalFixedTitle ref={headerRef} withStyle>
          <ModalCustomHeader>
            <div className="first">
              <h1>{t('connect')}</h1>
              <ButtonPrimaryInvert
                text={t('goToAccounts')}
                iconRight={faChevronRight}
                iconTransform="shrink-3"
                onClick={() => replaceModal({ key: 'Accounts' })}
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
        </ModalFixedTitle>

        <ModalMotionThreeSection
          style={{
            maxHeight: modalMaxHeight - (headerRef.current?.clientHeight || 0),
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
            <ModalPadding horizontalOnly ref={homeRef}>
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
            </ModalPadding>
          </div>
          <div className="section">
            <ModalPadding horizontalOnly ref={readOnlyRef}>
              <ReadOnly
                setInputOpen={setReadOnlyOpen}
                inputOpen={readOnlyOpen}
              />
            </ModalPadding>
          </div>
          <div className="section">
            <ModalPadding horizontalOnly ref={proxiesRef}>
              <Proxies
                setInputOpen={setNewProxyOpen}
                inputOpen={newProxyOpen}
              />
            </ModalPadding>
          </div>
        </ModalMotionThreeSection>
      </ModalSection>
    </>
  );
};
