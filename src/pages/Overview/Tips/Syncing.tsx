// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import * as refreshChangeJson from 'img/json/refresh-change-outline.json';
import { useTranslation } from 'react-i18next';
import Lottie from 'react-lottie';
import { ItemInnerWrapper, ItemsWrapper, ItemWrapper } from './Wrappers';

export const Syncing = () => {
  const { t } = useTranslation('tips');

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
          <section style={{ paddingRight: '0.5rem' }}>
            <Lottie
              options={animateOptions}
              width="1.6rem"
              height="1.6rem"
              isStopped={false}
              isPaused={false}
            />
          </section>
          <section>
            <div className="desc">
              <h4>{t('module.oneMoment')}...</h4>
            </div>
          </section>
        </ItemInnerWrapper>
      </ItemWrapper>
    </ItemsWrapper>
  );
};
