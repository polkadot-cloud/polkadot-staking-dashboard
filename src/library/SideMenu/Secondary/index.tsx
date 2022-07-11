// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useApi } from 'contexts/Api';
import { CONNECTION_SYMBOL_COLORS } from 'consts';
import { ConnectionStatus } from 'contexts/Api/types';
import { defaultThemes } from 'theme/default';
import { useTheme } from 'contexts/Themes';
import { useModal } from 'contexts/Modal';
import { Wrapper, MinimisedWrapper, IconWrapper } from './Wrappers';

export const Secondary = (props: any) => {
  const { mode } = useTheme();
  const { status } = useApi();
  const { openModalWith } = useModal();

  const { action, name, icon, minimised } = props;
  const { Svg, size } = icon;

  const StyledWrapper = minimised ? MinimisedWrapper : Wrapper;

  const symbolColor =
    status === ConnectionStatus.Connecting
      ? CONNECTION_SYMBOL_COLORS.connecting
      : status === ConnectionStatus.Connected
      ? CONNECTION_SYMBOL_COLORS.connected
      : CONNECTION_SYMBOL_COLORS.disconnected;

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
    >
      <IconWrapper
        fill={minimised ? symbolColor : defaultThemes.text.secondary[mode]}
        minimised={minimised}
        className="icon"
        style={{ width: size, height: size }}
      >
        <Svg width={size} height={size} />
      </IconWrapper>

      {!minimised && <div className="name">{name}</div>}
      {!minimised && (
        <div className={`action${minimised ? ' minimised' : ''}`}>{action}</div>
      )}
    </StyledWrapper>
  );
};

export default Secondary;
