// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { TipWrapper } from '../Wrappers';

export const Tip = (props: any) => {
  const { title, description } = props;

  return (
    <TipWrapper>
      <div>
        <h1>{title}</h1>
      </div>
      <div>
        {description.map((item: any, index: number) => (
          <h4 key={`inner_def_${index}`} className="definition">
            {item}
          </h4>
        ))}
      </div>
    </TipWrapper>
  );
};

export default Tip;
