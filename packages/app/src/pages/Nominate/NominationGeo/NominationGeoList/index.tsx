// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { Header, List, Wrapper as ListWrapper } from 'library/List';
import { MotionContainer } from 'library/List/MotionContainer';
import type { NomninationGeoListProps } from '../types';
import { useNetwork } from 'contexts/Network';
import { Separator } from 'kits/Structure/Separator';
import { ButtonPrimaryInvert } from 'kits/Buttons/ButtonPrimaryInvert';
import { useStaking } from 'contexts/Staking';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { ButtonHelp } from 'kits/Buttons/ButtonHelp';
import { useHelp } from 'contexts/Help';
import { Node } from './Node';
import { CardHeaderWrapper } from 'library/Card/Wrappers';

export const NominationGeoList = ({ title, data }: NomninationGeoListProps) => {
  const { network } = useNetwork();
  const { openHelp } = useHelp();
  const { isNominating } = useStaking();
  const { activeAccount } = useActiveAccounts();

  if (!data?.nodeDistributionDetail) {
    return null;
  }

  const rewardTotal = data.nodeDistributionDetail.reduce(
    (acc, n) => acc + n.TokenRewards,
    0
  );
  return (
    <>
      <ListWrapper>
        <Header className="noBorder">
          <div>
            <CardHeaderWrapper $withAction $withMargin>
              <h3>
                {title}
                <ButtonHelp
                  marginLeft
                  onClick={() => openHelp('Geolocation of Each Nomination')}
                />
              </h3>
            </CardHeaderWrapper>
          </div>
        </Header>
        <List $flexBasisLarge={'33.33%'}>
          <MotionContainer>
            {data.nodeDistributionDetail
              .sort((a, b) => b.TokenRewards - a.TokenRewards)
              .map((node, i: number) => (
                <Node
                  key={`nomination_geo_list_${i}`}
                  node={node}
                  rewardTotal={rewardTotal}
                />
              ))}
          </MotionContainer>
        </List>
      </ListWrapper>
      <Separator style={{ border: 'none' }} />
      <section>
        <ButtonPrimaryInvert
          lg
          onClick={() =>
            window.open(
              `https://${network}.polkawatch.app/nomination/${activeAccount}`,
              '_blank'
            )
          }
          iconRight={faExternalLinkAlt}
          iconTransform="shrink-2"
          text="Polkawatch"
          disabled={
            !(
              activeAccount &&
              ['polkadot', 'kusama'].includes(network) &&
              isNominating()
            )
          }
        />
      </section>
    </>
  );
};
