// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useHelp } from 'contexts/Help';
import { ButtonHelp } from 'kits/Buttons/ButtonHelp';
import { HeadingWrapper } from '../Wrappers';
import { Polkicon } from '@w3ux/react-polkicon';
import { CopyAddress } from 'library/ListItem/Labels/CopyAddress';
import { ellipsisFn, remToUnit } from '@w3ux/utils';

export const AddressSection = ({
  address,
  label,
  helpKey,
}: {
  address: string;
  label: string;
  helpKey?: string;
}) => {
  const { openHelp } = useHelp();

  return (
    <section>
      <HeadingWrapper>
        <h3>
          {label}
          {!!helpKey && (
            <ButtonHelp outline marginLeft onClick={() => openHelp(helpKey)} />
          )}
        </h3>
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
