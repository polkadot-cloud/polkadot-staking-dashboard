// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useTips } from 'contexts/Tips';
import { useAnimation } from 'framer-motion';
import { useEffect } from 'react';
import useFillVariables from 'library/Hooks/useFillVariables';
import { FillVariableItem } from 'library/Hooks/useFillVariables/types';
import { Tip } from './Items/Tip';
import { Dismiss } from './Items/Dismiss';

import { ContentWrapper, HeightWrapper, Wrapper } from './Wrappers';

export const Tips = () => {
  const { setStatus, status, tip, closeTip, dismissOpen } = useTips();
  const { fillVariables } = useFillVariables();
  const controls = useAnimation();

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

  // if (definition) {
  // // get active definiton
  // const activeTip = definition
  //   ? definitions.find((d: HelpDefinition) => d.title === definition)
  //   : null;

  // should be `tip`;
  let activeTip: FillVariableItem | null = {
    title: 'Tip Title',
    description: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      'Maecenas molestie ex in neque mollis pretium. Aenean mattis ante nec vehicula varius.',
      'Praesent vel consequat lectus, a mattis dui.',
      'Quisque lacinia ipsum nulla, at convallis orci finibus id. Morbi maximus lectus vitae justo lobortis viverra. Ut in nisl sapien. Duis id consectetur quam. Aenean ligula libero, suscipit vitae sagittis nec, molestie sit amet ligula.',
      'Fusce congue magna nulla, vel fringilla orci sollicitudin a. Nunc sed purus risus.',
    ],
  };

  // fill placeholder variables
  activeTip = activeTip ? fillVariables(activeTip) : null;

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
                title={activeTip?.title}
                description={activeTip?.description}
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
