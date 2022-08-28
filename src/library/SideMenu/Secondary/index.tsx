// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useApi } from 'contexts/Api';
import { ConnectionStatus } from 'contexts/Api/types';
import { useModal } from 'contexts/Modal';
import { defaultThemes } from 'theme/default';
import { useTheme } from 'contexts/Themes';
import { Wrapper, MinimisedWrapper, IconWrapper } from './Wrappers';
import { SecondaryProps } from '../types';

export const Secondary = (props: SecondaryProps) => {
  const { status } = useApi();
  const { mode } = useTheme();
  const { openModalWith } = useModal();

  const { action, name, icon, minimised } = props;
  const { Svg, size } = icon;

  const StyledWrapper = minimised ? MinimisedWrapper : Wrapper;

  const symbolColor =
    status === ConnectionStatus.Connecting
      ? defaultThemes.status.warning.transparent[mode]
      : status === ConnectionStatus.Connected
      ? defaultThemes.status.success.transparent[mode]
      : defaultThemes.status.danger.transparent[mode];

  return (
    <StyledWrapper
      onClick={() => {
        openModalWith('Networks');
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{
        duration: 0.1,
      }}
      style={{
        borderColor: minimised ? symbolColor : undefined,
      }}
    >
      <IconWrapper
        minimised={minimised}
        className="icon"
        style={{ width: size, height: size }}
      >
        <Svg width={size} height={size} />
      </IconWrapper>

      {!minimised && (
        <>
          <div className="name">{name}</div>
          <div className="action">{action}</div>
        </>
      )}
    </StyledWrapper>
  );
};

export default Secondary;
