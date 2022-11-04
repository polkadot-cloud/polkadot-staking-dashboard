// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTips } from 'contexts/Tips';
import { useTranslation } from 'react-i18next';
import { TipWrapper } from '../Wrappers';

export const Tip = (props: any) => {
  const { title, description } = props;
  const { t } = useTranslation('common');
  const { closeTip } = useTips();

  return (
    <>
      <TipWrapper>
        <div className="close-button">
          <button type="button" onClick={() => closeTip()}>
            <FontAwesomeIcon icon={faTimes} />
            {t('library.close')}
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
