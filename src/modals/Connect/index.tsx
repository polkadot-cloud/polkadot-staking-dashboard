// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ButtonInvertRounded } from '@rossbulat/polkadot-dashboard-ui';
import { EXTENSIONS } from 'config/extensions';
import { useExtensions } from 'contexts/Extensions';
import { ExtensionConfig } from 'contexts/Extensions/types';
import { useModal } from 'contexts/Modal';
import { Action } from 'library/Modal/Action';
import { SelectItems } from 'library/SelectItems';
import { CustomHeaderWrapper, PaddingWrapper } from 'modals/Wrappers';
import { useEffect, useState } from 'react';
import { Extension } from './Extension';
import { ReadOnly } from './ReadOnly';
import { ExtensionsWrapper, Separator } from './Wrappers';

export const Connect = () => {
  const { extensions } = useExtensions();
  const { replaceModalWith, setResize, height } = useModal();

  const installed = EXTENSIONS.filter((a: ExtensionConfig) =>
    extensions.find((b: ExtensionConfig) => b.id === a.id)
  );

  const other = EXTENSIONS.filter(
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
        <h1>
          Connect
          <ButtonInvertRounded
            text="Go To Accounts"
            iconTransform="shrink-2"
            onClick={() => replaceModalWith('Accounts', {}, 'large')}
          />
        </h1>
      </CustomHeaderWrapper>
      <Action text="Extensions" />
      <ExtensionsWrapper>
        <SelectItems layout="two-col">
          {installed
            .concat(other)
            .map((extension: ExtensionConfig, i: number) => {
              return (
                <Extension key={`active_extension_${i}`} meta={extension} />
              );
            })}
        </SelectItems>
      </ExtensionsWrapper>
      <Separator />
      <Action text="Read Only Accounts" />
      <ReadOnly setReadOnlyOpen={setReadOnlyOpen} readOnlyOpen={readOnlyOpen} />
    </PaddingWrapper>
  );
};
