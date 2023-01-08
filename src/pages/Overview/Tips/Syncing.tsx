// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useApi } from 'contexts/Api';
import * as refreshChangeJson from 'img/json/refresh-change-outline.json';
import { useTranslation } from 'react-i18next';
import Lottie from 'react-lottie';
import { ItemInnerWrapper, ItemsWrapper, ItemWrapper } from './Wrappers';

export const Syncing = ({ showTitle }: { showTitle: boolean }) => {
  const {
    network: { name },
  } = useApi();
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
          <section style={{ paddingRight: '1.25rem' }}>
            <Lottie
              options={animateOptions}
              width="2.2rem"
              height="2.2rem"
              isStopped={false}
              isPaused={false}
            />
          </section>
          <section>
            {showTitle ? (
              <div className="title">
                <h3>{t('module.syncingWith', { network: name })}</h3>
              </div>
            ) : null}
            <div className="desc">
              <h4>{t('module.oneMoment')}...</h4>
            </div>
          </section>
        </ItemInnerWrapper>
      </ItemWrapper>
    </ItemsWrapper>
  );
};
