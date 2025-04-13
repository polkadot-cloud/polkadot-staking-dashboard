// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useHelp } from 'contexts/Help'
import { useNetwork } from 'contexts/Network'
import { useStaking } from 'contexts/Staking'
import { Header, List, Wrapper as ListWrapper } from 'library/List'
import { MotionContainer } from 'library/List/MotionContainer'
import { ButtonHelp, ButtonPrimaryInvert } from 'ui-buttons'
import { CardHeader, Separator } from 'ui-core/base'
import type { NomninationGeoListProps } from '../types'
import { Node } from './Node'

export const NominationGeoList = ({ title, data }: NomninationGeoListProps) => {
  const { network } = useNetwork()
  const { openHelp } = useHelp()
  const { isNominating } = useStaking()
  const { activeAddress } = useActiveAccounts()

  if (!data?.nodeDistributionDetail) {
    return null
  }

  const rewardTotal = data.nodeDistributionDetail.reduce(
    (acc, n) => acc + n.TokenRewards,
    0
  )
  return (
    <>
      <ListWrapper>
        <Header className="noBorder">
          <div>
            <CardHeader action margin>
              <h3>
                {title}
                <ButtonHelp
                  marginLeft
                  onClick={() => openHelp('Geolocation of Each Nomination')}
                />
              </h3>
            </CardHeader>
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
              `https://${network}.polkawatch.app/nomination/${activeAddress}`,
              '_blank'
            )
          }
          iconRight={faExternalLinkAlt}
          iconTransform="shrink-2"
          text="Polkawatch"
          disabled={
            !(
              activeAddress &&
              ['polkadot', 'kusama'].includes(network) &&
              isNominating()
            )
          }
        />
      </section>
    </>
  )
}
