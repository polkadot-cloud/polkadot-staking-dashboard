// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { appendOrEmpty } from '@w3ux/utils';
import { CallToActionWrapper } from 'library/CallToAction';
import type { ButtonSubmitLargeProps } from './types';

export const ButtonSubmitLarge = ({
  disabled,
  onSubmit,
  submitText,
  icon,
  iconTransform,
  pulse,
}: ButtonSubmitLargeProps) => (
  <CallToActionWrapper>
    <div className="inner">
      <section className="standalone">
        <div className="buttons">
          <div
            className={`button primary standalone${appendOrEmpty(disabled, 'disabled')}${appendOrEmpty(pulse, 'pulse')}`}
          >
            <button onClick={() => onSubmit()} disabled={disabled}>
              {icon && (
                <FontAwesomeIcon
                  icon={icon}
                  transform={iconTransform || undefined}
                />
              )}
              {submitText}
            </button>
          </div>
        </div>
      </section>
    </div>
  </CallToActionWrapper>
);
