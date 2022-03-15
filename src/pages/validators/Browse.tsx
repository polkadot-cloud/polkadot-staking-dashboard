// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { PageProps } from '../types';
import { StatBoxList } from '../../library/StatBoxList';
import { useApi } from '../../contexts/Api';
import { useNetworkMetrics } from '../../contexts/Network';
import { useStakingMetrics } from '../../contexts/Staking';
import { List } from '../../library/List';
import { Validator } from '../../library/Validator';
import { GraphWrapper } from '../../library/Graphs/Wrappers';

export const Browse = (props: PageProps) => {

  const { isReady }: any = useApi();
  const { page } = props;
  const { title } = page;

  const { metrics } = useNetworkMetrics();
  const { validators, fetchSessionValidators }: any = useStakingMetrics();

  useEffect(() => {
    fetchSessionValidators();
  }, [isReady()]);

  // counterForValidators

  const items = [
    {
      label: "Active Validators",
      value: 297,
      unit: "",
      format: "number",
    },
    {
      label: "Current Epoch",
      value: 1,
      unit: "",
      format: "number",
    },
    {
      label: "Current Era",
      value: metrics.activeEra.index,
      unit: "",
      format: "number",
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04
      }
    }
  };

  const listItem = {
    hidden: {
      opacity: 0
    },
    show: {
      opacity: 1
    }
  };

  return (
    <>
      <h1 className='title'>{title}</h1>
      <StatBoxList title="This Session" items={items} />

      <GraphWrapper>
        <h3>Browse Active Validators</h3>
        {isReady() &&
          <>
            {validators.length === 0 &&
              <List variants={container} initial="hidden" animate="show">
                <motion.div className='item' variants={listItem}>
                  <h4>Fetching validators...</h4>
                </motion.div>
              </List>
            }

            {validators.length > 0 &&
              <List variants={container} initial="hidden" animate="show">
                {validators.slice(0, 20).map((addr: string, index: number) =>
                  <motion.div className='item' key={`nomination_${index}`} variants={listItem}>
                    <Validator address={addr} />
                  </motion.div>
                )}
              </List>
            }
          </>
        }
      </GraphWrapper>
    </>
  );
}

export default Browse;