// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import Lottie from 'react-lottie';
import { useApi } from 'contexts/Api';
import * as refreshChangeJson from 'img/json/refresh-change-outline.json';
import { useTranslation } from 'react-i18next';
import { ItemsWrapper, ItemWrapper, ItemInnerWrapper } from './Wrappers';

export const Syncing = () => {
  const {
    network: { name },
  } = useApi();
  const { t } = useTranslation('common');
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
              <h3>
                {t('pages.overview.syncing_with')} {name}
              </h3>
            </div>
            <div className="desc">
              <h4>{t('pages.overview.one_moment_please')}</h4>
            </div>
          </section>
        </ItemInnerWrapper>
      </ItemWrapper>
    </ItemsWrapper>
  );
};
