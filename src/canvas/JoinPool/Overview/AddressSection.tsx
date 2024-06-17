// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useHelp } from 'contexts/Help';
import { ButtonHelp } from 'kits/Buttons/ButtonHelp';
import { HeadingWrapper } from '../Wrappers';
import { Polkicon } from '@w3ux/react-polkicon';
import { CopyAddress } from 'library/ListItem/Labels/CopyAddress';
import { ellipsisFn, remToUnit } from '@w3ux/utils';
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
        <span>
          <Polkicon
            address={address}
            size={remToUnit('2.25rem')}
            outerColor="transparent"
          />
        </span>
        <h4>
          {ellipsisFn(address, 6)}
          <CopyAddress address={address} />
        </h4>
      </div>
    </section>
  );
};
