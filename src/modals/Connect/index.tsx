// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { ActionItem, ButtonPrimaryInvert } from '@polkadotcloud/core-ui';
import { Extensions } from 'config/extensions';
import { useApi } from 'contexts/Api';
import { useExtensions } from 'contexts/Extensions';
import type { ExtensionConfig } from 'contexts/Extensions/types';
import { useModal } from 'contexts/Modal';
import { SelectItems } from 'library/SelectItems';
import {
  CustomHeaderWrapper,
  FixedTitleWrapper,
  MultiSectionWrapper,
  PaddingWrapper,
  SectionWrapper,
  SectionsWrapper,
} from 'modals/Wrappers';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { AnyFunction } from 'types';
import { Extension } from './Extension';
import { Ledger } from './Ledger';
import { ReadOnly } from './ReadOnly';
import { ExtensionsWrapper, Separator } from './Wrappers';

export const Connect = () => {
  const { t } = useTranslation('modals');
  const { network } = useApi();
  const { extensions } = useExtensions();
  const { replaceModalWith, setModalHeight } = useModal();

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

  // Resize modal on state change.
  useEffect(() => {
    let height = headerRef.current?.clientHeight || 0;
    if (section === 0) {
      height += homeRef.current?.clientHeight || 0;
    } else {
      height += readOnlyRef.current?.clientHeight || 0;
    }
    setModalHeight(height);
  }, [section, readOnlyOpen, extensions]);

  return (
    <MultiSectionWrapper>
      <FixedTitleWrapper ref={headerRef} isStyled>
        <CustomHeaderWrapper>
          <h1>{t('connect')}</h1>
          <ButtonPrimaryInvert
            text={t('goToAccounts')}
            iconRight={faChevronRight}
            iconTransform="shrink-3"
            onClick={() => replaceModalWith('Accounts', {}, 'large')}
            marginLeft
          />
          {/* <div>
            <button type="button" onClick={() => setSection(0)}>
              Import
            </button>
            <button type="button" onClick={() => setSection(1)}>
              Manual
            </button>
          </div> */}
        </CustomHeaderWrapper>
      </FixedTitleWrapper>

      <SectionsWrapper
        animate={section === 0 ? 'home' : 'next'}
        transition={{
          duration: 0.5,
          type: 'spring',
          bounce: 0.1,
        }}
        variants={{
          home: {
            left: 0,
          },
          next: {
            left: '-100%',
          },
        }}
      >
        <SectionWrapper>
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

            <ActionItem text={t('extensions')} />
            <ExtensionsWrapper>
              <SelectItems layout="two-col">
                {installed.concat(other).map((extension, i) => (
                  <Extension key={`extension_item_${i}`} meta={extension} />
                ))}
              </SelectItems>
            </ExtensionsWrapper>
            <Separator />
            <ActionItem text={t('readOnlyAccounts')} />
            <ReadOnly
              setReadOnlyOpen={setReadOnlyOpen}
              readOnlyOpen={readOnlyOpen}
            />
          </PaddingWrapper>
        </SectionWrapper>
        <SectionWrapper>
          <PaddingWrapper ref={readOnlyRef}>
            <div>to do</div>
          </PaddingWrapper>
        </SectionWrapper>
      </SectionsWrapper>
    </MultiSectionWrapper>
  );
};
