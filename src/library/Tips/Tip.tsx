// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {
  ButtonInvertRounded,
  ButtonPrimary,
  ButtonSecondary,
} from '@rossbulat/polkadot-dashboard-ui';
import { useOverlay } from 'contexts/Overlay';
import { usePlugins } from 'contexts/Plugins';
import { Title } from 'library/Overlay/Title';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const Tip = ({ title, description }: any) => {
  const { t } = useTranslation();
  const { togglePlugin } = usePlugins();
  const { closeOverlay } = useOverlay();

  const [disabling, setDisabling] = useState<boolean>(false);

  return (
    <>
      {disabling ? (
        <>
          <Title title={t('module.dismissTips', { ns: 'tips' })} hideDone />
          <div className="body">
            <h4>{t('module.dismissResult', { ns: 'tips' })}</h4>
            <h4>{t('module.reEnable', { ns: 'tips' })}</h4>

            <div style={{ marginTop: '1.5rem' }}>
              <ButtonPrimary
                marginRight
                text={t('module.disableTips', { ns: 'tips' })}
                onClick={() => {
                  togglePlugin('tips');
                  closeOverlay();
                }}
              />
              <ButtonInvertRounded
                text="Cancel"
                onClick={() => setDisabling(false)}
                style={{ marginLeft: '0.5rem' }}
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <Title title={title} />
          <div className="body">
            {description.map((item: any, index: number) => (
              <h4 key={`inner_def_${index}`} className="definition">
                {item}
              </h4>
            ))}
            <div style={{ marginTop: '1.75rem' }}>
              <ButtonSecondary
                marginRight
                text={t('module.disableTips', { ns: 'tips' })}
                onClick={() => {
                  setDisabling(true);
                }}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};
