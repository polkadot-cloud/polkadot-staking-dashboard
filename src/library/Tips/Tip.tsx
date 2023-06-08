// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import {
  ButtonPrimary,
  ButtonPrimaryInvert,
  ButtonSecondary,
} from '@polkadotcloud/core-ui';
import { useOverlay } from 'contexts/Overlay';
import { usePlugins } from 'contexts/Plugins';
import { Title } from 'library/Overlay/Title';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export const Tip = ({ title, description, page }: any) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
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

            <div style={{ display: 'flex', marginTop: '1.5rem' }}>
              <ButtonPrimary
                marginRight
                text={t('module.disableTips', { ns: 'tips' })}
                onClick={() => {
                  togglePlugin('tips');
                  closeOverlay();
                }}
              />
              <ButtonPrimaryInvert
                text={t('module.cancel', { ns: 'tips' })}
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
            <div style={{ marginTop: '1.75rem', display: 'flex' }}>
              {!!page && (
                <ButtonPrimary
                  marginRight
                  text={`${t('goTo', { ns: 'base' })} ${t(page, {
                    ns: 'base',
                  })}`}
                  onClick={() => {
                    closeOverlay();
                    navigate(`/${page}`);
                  }}
                  iconRight={faAngleRight}
                  iconTransform="shrink-1"
                />
              )}
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
