// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useApi } from 'contexts/Api';
import * as refreshChangeJson from 'img/json/refresh-change-outline.json';
import Lottie from 'react-lottie';
import { ItemInnerWrapper, ItemsWrapper, ItemWrapper } from './Wrappers';

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
      <ItemWrapper>
        <ItemInnerWrapper inactive>
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
            <div className="title">
              <h3>Syncing with {name}</h3>
            </div>
            <div className="desc">
              <h4>One moment please...</h4>
            </div>
          </section>
        </ItemInnerWrapper>
      </ItemWrapper>
    </ItemsWrapper>
  );
};
