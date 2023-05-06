// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { ButtonPrimaryInvert } from '@polkadotcloud/core-ui';
import { Extensions } from 'config/extensions';
import { useApi } from 'contexts/Api';
import { useExtensions } from 'contexts/Extensions';
import type { ExtensionConfig } from 'contexts/Extensions/types';
import { useModal } from 'contexts/Modal';
import { Action } from 'library/Modal/Action';
import { SelectItems } from 'library/SelectItems';
import { CustomHeaderWrapper, PaddingWrapper } from 'modals/Wrappers';
import { useEffect, useState } from 'react';
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
  const { replaceModalWith, setResize, height } = useModal();

  const installed = Extensions.filter((a: ExtensionConfig) =>
    extensions.find((b: ExtensionConfig) => b.id === a.id)
  );

  const other = Extensions.filter(
    (a: ExtensionConfig) =>
      !installed.find((b: ExtensionConfig) => b.id === a.id)
  );

  // toggle read only management
  const [readOnlyOpen, setReadOnlyOpen] = useState(false);

  useEffect(() => {
    setResize();
  }, [extensions, height, readOnlyOpen]);

  return (
    <PaddingWrapper>
      <CustomHeaderWrapper>
        <h1>{t('connect')}</h1>
        <ButtonPrimaryInvert
          text={t('goToAccounts')}
          iconRight={faChevronRight}
          iconTransform="shrink-3"
          onClick={() => replaceModalWith('Accounts', {}, 'large')}
          marginLeft
        />
      </CustomHeaderWrapper>

      {['polkadot', 'kusama'].includes(network.name) ? (
        <>
          <Action text={t('hardware')} />
          <ExtensionsWrapper>
            <SelectItems layout="two-col">
              {[Ledger].map((Item: AnyFunction, i: number) => (
                <Item key={`hardware_item_${i}`} />
              ))}
            </SelectItems>
          </ExtensionsWrapper>
        </>
      ) : null}

      <Action text={t('extensions')} />
      <ExtensionsWrapper>
        <SelectItems layout="two-col">
          {installed.concat(other).map((extension, i) => (
            <Extension key={`extension_item_${i}`} meta={extension} />
          ))}
        </SelectItems>
      </ExtensionsWrapper>
      <Separator />
      <Action text={t('readOnlyAccounts')} />
      <ReadOnly setReadOnlyOpen={setReadOnlyOpen} readOnlyOpen={readOnlyOpen} />
    </PaddingWrapper>
  );
};
