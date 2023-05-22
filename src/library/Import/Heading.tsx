// Copyright 2023 @paritytech/polkadot-live authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {
  faChevronRight,
  faCircleMinus,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ButtonText } from '@polkadotcloud/core-ui';
import { useTranslation } from 'react-i18next';
import { HeadingWrapper } from './Wrappers';
import type { HeadingProps } from './types';

export const Heading = ({
  connectTo,
  title,
  Icon,
  disabled,
  handleReset,
}: HeadingProps) => {
  const { t } = useTranslation('library');

  return (
    <HeadingWrapper>
      <section>
        <h4>
          {Icon && <Icon />}
          <span>
            {connectTo && (
              <>
                {connectTo}{' '}
                <FontAwesomeIcon icon={faChevronRight} transform="shrink-5" />
              </>
            )}
            {title}
          </span>
        </h4>
      </section>
      <section>
        <ButtonText
          text={t('reset')}
          iconLeft={faCircleMinus}
          onClick={() => handleReset()}
          disabled={disabled}
          marginLeft
        />
      </section>
    </HeadingWrapper>
  );
};
