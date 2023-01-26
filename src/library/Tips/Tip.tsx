// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Title } from 'library/Overlay/Title';

export const Tip = (props: any) => {
  const { title, description } = props;

  return (
    <>
      <Title title={title} />
      <div className="body">
        {description.map((item: any, index: number) => (
          <h4 key={`inner_def_${index}`} className="definition">
            {item}
          </h4>
        ))}
      </div>
    </>
  );
};
