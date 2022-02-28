import { PageProps } from '../types';
import { Wrapper, NominateWrapper } from './Wrappers';
import { PageRowWrapper } from '../../Wrappers';
import { GraphWrapper, MainWrapper, SecondaryWrapper } from '../Overview/Wrappers';
import BondedGraph from './BondedGraph';
import { motion } from 'framer-motion';
import { Nominations } from './Nominations';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight as faGo } from '@fortawesome/free-solid-svg-icons';
import { StatBoxList } from '../../library/StatBoxList';
import { ACTIVE_ENDPOINT } from '../../constants';

export const Stake = (props: PageProps) => {

  const { page } = props;
  const { title } = page;

  const items = [
    {
      label: "Bonded",
      value: 19,
      unit: ACTIVE_ENDPOINT.unit,
      format: "number",
    },
    {
      label: "Free",
      value: 12,
      unit: ACTIVE_ENDPOINT.unit,
      format: "number",
    },
    {
      label: "Status",
      value: "6 Nominations",
      unit: "",
      format: 'text',
    },
  ];

  return (
    <Wrapper>
      <h1>{title}</h1>
      <StatBoxList title="This Session" items={items} />

      <PageRowWrapper>
        <MainWrapper>
          <GraphWrapper>
            <h3>Bonded Funds</h3>
            <div className='graph_with_extra'>
              <div className='graph' style={{ flex: 0, paddingRight: '1rem' }}>
                <BondedGraph />
              </div>
              <div className='extra'>
                <div className='buttons'>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Bond Extra
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Unbond
                  </motion.button>
                </div>
              </div>
            </div>
          </GraphWrapper>
          <GraphWrapper style={{ marginTop: '1rem' }}>
            <h3>Choose Validators</h3>
            <NominateWrapper>
              <motion.button whileHover={{ scale: 1.01 }}>
                <h2>Manual Selection</h2>
                <p>Manually browse and nominate validators from the validator list.</p>
                <div className='foot'>
                  <p className='go'>
                    Browse Validators
                    <FontAwesomeIcon
                      icon={faGo}
                      transform="shrink-2"
                      style={{ marginLeft: '0.5rem' }}
                    />
                  </p>
                </div>
              </motion.button>
              <motion.button whileHover={{ scale: 1.01 }}>
                <h2>Smart Nominate</h2>
                <p>Nominate the most suited validators based on your requirements.</p>
                <div className='foot'>
                  <p className='go'>
                    Start <FontAwesomeIcon
                      icon={faGo}
                      transform="shrink-2"
                      style={{ marginLeft: '0.5rem' }}
                    />
                  </p>
                </div>
              </motion.button>
            </NominateWrapper>
          </GraphWrapper>
        </MainWrapper>

        <SecondaryWrapper>
          <GraphWrapper>
            <h3>Delegate to Pools</h3>
            <h4>We're working on it.</h4>
          </GraphWrapper>

        </SecondaryWrapper>
      </PageRowWrapper>
      <PageRowWrapper>
        <MainWrapper>
          <Nominations />
        </MainWrapper>
      </PageRowWrapper>
    </Wrapper>
  );
}

export default Stake;