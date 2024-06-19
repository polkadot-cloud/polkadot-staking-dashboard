// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faBars, faGripVertical } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';
//import { useTranslation } from 'react-i18next';
import { useTheme } from 'contexts/Themes';
import { Header, List, Wrapper as ListWrapper } from 'library/List';
import { MotionContainer } from 'library/List/MotionContainer';
import { Identity } from 'library/ListItem/Labels/Identity';
import { ItemWrapper } from '../Wrappers';
import type { NomninationGeoListProps } from '../types';
import { NominationGeoListProvider, useNominationGeoList } from './context';
import { useNetwork } from 'contexts/Network';
//import { useValidators } from 'contexts/Validators/ValidatorEntries';

export const NominationGeoList = (props: NomninationGeoListProps) => (
  <NominationGeoListProvider>
    <NominationGeoListInner {...props} />
  </NominationGeoListProvider>
);

export const NominationGeoListInner = ({
  allowMoreCols,
  title,
  data,
}: NomninationGeoListProps) => {
  //const { i18n, t } = useTranslation('pages');
  const { mode } = useTheme();
  const {
    networkData: { colors },
  } = useNetwork();
  const { listFormat, setListFormat } = useNominationGeoList();
  //const { validators } = useValidators();

  if (!data?.nodeDistributionDetail) {
    return null;
  }

  let totalRewards = data.nodeDistributionDetail.reduce((acc,n,i)=>acc+n.TokenRewards, 0);

  return (
    <ListWrapper>
      <Header>
        <div>
          <h4>{title}</h4>
        </div>
        <div>
          <button type="button" onClick={() => setListFormat('row')}>
            <FontAwesomeIcon
              icon={faBars}
              color={listFormat === 'row' ? colors.primary[mode] : 'inherit'}
            />
          </button>
          <button type="button" onClick={() => setListFormat('col')}>
            <FontAwesomeIcon
              icon={faGripVertical}
              color={listFormat === 'col' ? colors.primary[mode] : 'inherit'}
            />
          </button>
        </div>
      </Header>
      <List $flexBasisLarge={allowMoreCols ? '33.33%' : '50%'}>
        <MotionContainer>
          {data.nodeDistributionDetail
            .sort((a, b) => b.TokenRewards - a.TokenRewards)
            .map((n, index: number) => {
            const labelClass = 'reward';

            return (
              <motion.div
                className={`item ${listFormat === 'row' ? 'row' : 'col'}`}
                key={`nomination_${index}`}
                variants={{
                  hidden: {
                    y: 15,
                    opacity: 0,
                  },
                  show: {
                    y: 0,
                    opacity: 1,
                  },
                }}
              >
                <ItemWrapper>
                  <div className="inner">
                    <div className="row">
                      <div>
                        <div>
                          <h4 className={labelClass}>
                            <>
                              <p>{n.LastNetwork}, {n.LastCountry}, {n.LastRegion} {n.Countries+n.Regions > 2 ? '++.':'.'}</p>
                            </>
                          </h4>
                        </div>
                        <div/>
                      </div>
                    </div>
                    <div className="row">
                      <div>
                        <div>
                          <Identity address={n.Id} />
                        </div>
                        <div>
                          <h5>{Math.round((n.TokenRewards / totalRewards) * 1000)/10} %</h5>
                        </div>
                      </div>
                    </div>
                  </div>
                </ItemWrapper>
              </motion.div>
            );
          })}
        </MotionContainer>
      </List>
    </ListWrapper>
  );
};
