// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useHelp } from 'contexts/Help';
import { ButtonHelp } from 'ui-buttons';
import { HeadingWrapper } from '../Wrappers';
import { Polkicon } from '@w3ux/react-polkicon';
import { CopyAddress } from 'library/ListItem/Labels/CopyAddress';
import { ellipsisFn } from '@w3ux/utils';
import type { AddressSectionProps } from '../types';

export const AddressSection = ({
  address,
  label,
  helpKey,
}: AddressSectionProps) => {
  const { openHelp } = useHelp();

  return (
    <section>
      <HeadingWrapper>
        <h4 className="heading">
          {label}
          {!!helpKey && (
            <ButtonHelp marginLeft onClick={() => openHelp(helpKey)} />
          )}
        </h4>
      </HeadingWrapper>

      <div>
        <Polkicon
          address={address}
          background="transparent"
          transform="grow-10"
        />
        <h4>
          {ellipsisFn(address, 6)}
          <CopyAddress address={address} />
        </h4>
      </div>
    </section>
  );
};
