// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import Lottie from 'react-lottie';
import { useApi } from 'contexts/Api';
import * as refreshChangeJson from 'img/json/refresh-change-outline.json';
import { ItemsWrapper, ItemWrapper } from './Wrappers';

export const Syncing = () => {
  const {
    network: { name },
  } = useApi();

  const animateOptions = {
    loop: true,
    autoplay: true,
    animationData: refreshChangeJson,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <ItemsWrapper
      initial="show"
      animate={undefined}
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
        },
      }}
    >
      <ItemWrapper type="button">
        <div className="inner">
          <section>
            <Lottie
              options={animateOptions}
              width="2.2rem"
              height="2.2rem"
              isStopped={false}
              isPaused={false}
            />
          </section>
          <section>
            <h4>Syncing with {name}...</h4>
            <div className="desc">
              <p>One moment please.</p>
            </div>
          </section>
        </div>
      </ItemWrapper>
    </ItemsWrapper>
  );
};
