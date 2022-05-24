// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Wrapper } from './Wrapper';
import { Button } from '../Button';
import { OpenAssistantIcon } from '../OpenAssistantIcon';

export const Stat = (props: any) => {
  const { label, stat, buttons, assistant, icon } = props;

  return (
    <Wrapper>
      <h4>
        {label}
        {assistant.length && (
          <OpenAssistantIcon page={assistant[0]} title={assistant[1]} />
        )}
      </h4>
      <h2>
        {icon && (
          <>
            <FontAwesomeIcon icon={icon} transform="shrink-4" />
            &nbsp;
          </>
        )}
        {stat}
        {buttons && (
          <span>
            &nbsp;&nbsp;
            {buttons.map((btn: any, index: number) => (
              <Button
                key={`btn_${index}_${Math.random()}`}
                primary
                inline
                title={btn.title}
                small={btn.small ?? undefined}
                icon={btn.icon ?? undefined}
                transform={btn.transform ?? undefined}
                disabled={btn.disabled ?? false}
                onClick={() => btn.onClick()}
              />
            ))}
          </span>
        )}
      </h2>
    </Wrapper>
  );
};

export default Stat;
