// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTips } from 'contexts/Tips';
import { TipWrapper } from '../Wrappers';

export const Tip = (props: any) => {
  const { title, description } = props;

  const { closeTip } = useTips();

  return (
    <>
      <TipWrapper>
        <div className="close-button">
          <button type="button" onClick={() => closeTip()}>
            <FontAwesomeIcon icon={faTimes} />
            Close
          </button>
        </div>
        <div>
          <h1>{title}</h1>
        </div>
        <div>
          {description.map((item: any, index: number) => (
            <h4 key={`inner_def_${index}`} className="definition">
              {item}
            </h4>
          ))}
        </div>
      </TipWrapper>
    </>
  );
};
