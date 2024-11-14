// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import DiscordSVG from 'img/discord.svg?react';
import DiscordOutlineSvg from 'img/discord_outline.svg?react';
import { Title } from 'library/Modal/Title';
import { ModalPadding } from 'kits/Overlay/structure/ModalPadding';
import { SupportWrapper } from './Wrapper';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DiscordSupportUrl } from 'consts';

export const DiscordSupport = () => (
  <>
    <Title title="Discord" Svg={DiscordSVG} />
    <ModalPadding verticalOnly>
      <SupportWrapper>
        <DiscordOutlineSvg />
        <h4>
          Join the Staking Dashboard Discord channel to receive dedicated
          support from our team and connect with the Polkadot community.
        </h4>
        <h1>
          <a href={DiscordSupportUrl} target="_blank" rel="noreferrer">
            Go to Discord&nbsp;
            <FontAwesomeIcon icon={faExternalLinkAlt} transform="shrink-4" />
          </a>
        </h1>
      </SupportWrapper>
    </ModalPadding>
  </>
);
