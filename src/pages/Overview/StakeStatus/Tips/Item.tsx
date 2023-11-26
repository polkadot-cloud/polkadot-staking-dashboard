import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { usePrompt } from 'contexts/Prompt';
import { Tip } from 'library/Tips/Tip';
import { ItemInnerWrapper, ItemWrapper, ItemsWrapper } from './Wrappers';

export const Item = ({
    title,
    subtitle,
    description,
    index,
    controls,
    initial,
    page,
  }: any) => {
    const { openPromptWith } = usePrompt();
    const [isStopped, setIsStopped] = useState(true);
  
    useEffect(() => {
      const delay = index * 75;
  
      if (initial) {
        setTimeout(() => {
          if (isStopped) {
            setIsStopped(false);
          }
        }, delay);
      }
    }, []);
  
    return (
      <ItemWrapper
        animate={controls}
        custom={index}
        transition={{
          delay: index * 0.2,
          duration: 0.7,
          type: 'spring',
          bounce: 0.35,
        }}
        variants={{
          hidden: {
            y: 15,
          },
          show: {
            y: 0,
          },
        }}
      >
        <ItemInnerWrapper>
          <section />
          <section>
            <div className="desc active">
              <button
                onClick={() =>
                  openPromptWith(
                    <Tip title={title} description={description} page={page} />,
                    'large'
                  )
                }
                type="button"
              >
                <h4>
                  {subtitle}
                  <FontAwesomeIcon
                    icon={faExternalLinkAlt}
                    transform="shrink-2"
                  />
                </h4>
              </button>
            </div>
          </section>
        </ItemInnerWrapper>
      </ItemWrapper>
    );
  };