// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { TIPS_CONFIG } from 'config/tips';
import { useTips } from 'contexts/Tips';
import { useAnimation } from 'framer-motion';
import useFillVariables from 'library/Hooks/useFillVariables';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AnyJson } from 'types';
import { Dismiss } from './Items/Dismiss';
import { Tip } from './Items/Tip';

import { ContentWrapper, HeightWrapper, Wrapper } from './Wrappers';

export const Tips = () => {
  const { setStatus, status, tip, closeTip, dismissOpen } = useTips();
  const { fillVariables } = useFillVariables();
  const controls = useAnimation();
  const { t: tTips, i18n } = useTranslation('tips');

  const onFadeIn = async () => {
    await controls.start('visible');
  };

  const onFadeOut = async () => {
    await controls.start('hidden');
    setStatus(0);
  };

  const variants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
    },
  };

  useEffect(() => {
    // help has been opened - fade in
    if (status === 1) {
      onFadeIn();
    }
    // an external component triggered closure - fade out
    if (status === 2) {
      onFadeOut();
    }
  }, [status]);

  // render early if help not open
  if (status === 0) {
    return <></>;
  }

  // get active tip
  let activeTip: AnyJson = tip
    ? TIPS_CONFIG.find((d: any) => d.id === tip)
    : null;

  // fill placeholder variables
  if (activeTip) {
    const { localeKey } = activeTip;

    activeTip = fillVariables(
      {
        title: tTips(`${localeKey}.title`),
        subtitle: tTips(`${localeKey}.subtitle`),
        description: i18n.getResource(
          i18n.resolvedLanguage,
          'tips',
          `${localeKey}.description`
        ),
      },
      ['title', 'subtitle', 'description']
    );
  } else {
    activeTip = null;
  }

  return (
    <Wrapper
      initial={{
        opacity: 0,
      }}
      animate={controls}
      transition={{
        duration: 0.25,
      }}
      variants={variants}
    >
      <div>
        <HeightWrapper>
          <ContentWrapper>
            {dismissOpen ? (
              <Dismiss />
            ) : (
              <Tip
                title={activeTip?.title ?? ''}
                description={activeTip?.description ?? []}
              />
            )}
          </ContentWrapper>
        </HeightWrapper>
        <button
          type="button"
          className="close"
          onClick={() => {
            closeTip();
          }}
        >
          &nbsp;
        </button>
      </div>
    </Wrapper>
  );
};
