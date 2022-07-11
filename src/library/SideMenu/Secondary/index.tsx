// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Link } from 'react-router-dom';
import { useUi } from 'contexts/UI';
import { Wrapper, MinimisedWrapper } from './Wrappers';

export const Secondary = (props: any) => {
  const { setSideMenu } = useUi();

  const { name, to, icon, minimised } = props;
  const { Svg, width, height } = icon;

  const StyledWrapper = minimised ? MinimisedWrapper : Wrapper;

  return (
    <Link to={to} onClick={() => setSideMenu(0)}>
      <StyledWrapper
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{
          duration: 0.1,
        }}
      >
        <div className="icon" style={{ width, height }}>
          <Svg width={width} height={height} />
        </div>
        {!minimised && <div className="name">{name}</div>}
      </StyledWrapper>
    </Link>
  );
};

export default Secondary;
