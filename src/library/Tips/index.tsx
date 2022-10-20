// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTips } from 'contexts/Tips';
import { useAnimation } from 'framer-motion';
import { useEffect } from 'react';
import Tip from './Items/Tip';

import { ContentWrapper, HeightWrapper, Wrapper } from './Wrappers';

export const Tips = () => {
  const { setStatus, status, tip, closeTip } = useTips();
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
  //   // get items for active category
  //   meta = Object.values(HELP_CONFIG).find((item: HelpItemRaw) =>
  //     item?.definitions?.find((d: HelpDefinition) => d.title === definition)
  //   );
  // } else {
  //   // get all items
  //   let _definitions: HelpDefinitions = [];
  //   let _external: HelpExternals = [];

  //   Object.values(HELP_CONFIG).forEach((c: HelpItemRaw) => {
  //     _definitions = _definitions.concat([...(c.definitions || [])]);
  //     _external = _external.concat([...(c.external || [])]);
  //   });
  //   meta = { definitions: _definitions, external: _external };
  // }

  // // resources to display
  // let definitions = meta?.definitions ?? [];

  // // get active definiton
  // const activeTip = definition
  //   ? definitions.find((d: HelpDefinition) => d.title === definition)
  //   : null;

  // // filter active definition
  // definitions = definitions.filter(
  //   (d: HelpDefinition) => d.title !== definition
  // );

  // should be `tip`;
  const activeTip = {
    title: 'Tip Title',
    description: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      'Maecenas molestie ex in neque mollis pretium. Aenean mattis ante nec vehicula varius.',
      'Praesent vel consequat lectus, a mattis dui.',
      'Quisque lacinia ipsum nulla, at convallis orci finibus id. Morbi maximus lectus vitae justo lobortis viverra. Ut in nisl sapien. Duis id consectetur quam. Aenean ligula libero, suscipit vitae sagittis nec, molestie sit amet ligula.',
      'Fusce congue magna nulla, vel fringilla orci sollicitudin a. Nunc sed purus risus.',
    ],
  };

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
            <div className="buttons">
              <button type="button" onClick={() => closeTip()}>
                <FontAwesomeIcon icon={faTimes} />
                Close Tip
              </button>
            </div>
            <Tip
              title={activeTip?.title}
              description={activeTip?.description}
            />
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
