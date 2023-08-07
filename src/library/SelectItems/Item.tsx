// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faCircle } from '@fortawesome/free-regular-svg-icons';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Wrapper } from './Wrapper';
import type { SelectItemProps } from './types';

export const SelectItem = ({
  title,
  subtitle,
  icon,
  selected,
  onClick,
  layout,
  hoverBorder = false,
  grow = true,
  disabled = false,
  includeToggle = true,
  bodyRef,
  containerRef,
}: SelectItemProps) => (
  <Wrapper
    className={layout}
    $grow={grow}
    $hoverBorder={hoverBorder}
    $selected={selected}
  >
    <div className="inner" ref={containerRef}>
      <button type="button" onClick={() => onClick()} disabled={disabled}>
        <div className="icon">
          <FontAwesomeIcon icon={icon} transform="grow-4" />
        </div>
        <div className="body" ref={bodyRef}>
          <h3>{title}</h3>
          <p>{subtitle}</p>
        </div>
        {includeToggle ? (
          <div className="toggle">
            <FontAwesomeIcon
              icon={selected ? faCircleCheck : faCircle}
              transform="grow-6"
            />
          </div>
        ) : null}
      </button>
    </div>
  </Wrapper>
);
