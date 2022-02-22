import { useState } from 'react';
import { motion } from "framer-motion";
import { Wrapper, ConnectionSymbol } from './Wrapper';
import { useApi } from '../../contexts/Api';
import { ReactComponent as PolkadotLogoSVG } from '../../img/polkadot_logo.svg';
import { CONNECTION_SYMBOL_COLORS, CONNECTION_STATUS } from '../../constants';
import BlockNumber from './BlockNumber';
import { useStakingMetrics } from '../../contexts/Staking';

export const NetworkBar = () => {

  const { status, consts }: any = useApi();
  const { staking }: any = useStakingMetrics();

  const [open, setOpen] = useState(false);

  // handle connection symbol
  const symbolColor =
    status === CONNECTION_STATUS[1]
      ? CONNECTION_SYMBOL_COLORS['connecting']
      : status === CONNECTION_STATUS[2] ?
        CONNECTION_SYMBOL_COLORS['connected']
        : CONNECTION_SYMBOL_COLORS['disconnected'];

  // handle expand transitions
  const variants = {
    minimised: {
      opacity: 1,
      height: 'auto',
      background: 'white'
    },
    maximised: {
      opacity: 1,
      height: '150px',
      background: '#d33079'
    },
  };

  const animate = open ? `maximised` : `minimised`;

  return (
    <Wrapper
      open={open}
      initial={false}
      animate={animate}
      transition={{
        duration: 0.4,
        type: "spring",
        bounce: 0.15
      }}
      variants={variants}
    >
      <div className='row'>
        <section>
          <PolkadotLogoSVG className='network_icon' />
          <p>Polkadot</p>

          <div className='separator'></div>

          {status === CONNECTION_STATUS[0] &&
            <motion.p
              animate={{ opacity: [0, 1] }}
              transition={{ duration: 0.3 }}
            >
              Disconnected
            </motion.p>
          }

          {status === CONNECTION_STATUS[1] &&
            <motion.p
              animate={{ opacity: [0, 1] }}
              transition={{ duration: 0.3 }}
            >
              Connecting...
            </motion.p>
          }

          {status === CONNECTION_STATUS[2] &&
            <motion.p
              animate={{ opacity: [0, 1] }}
              transition={{ duration: 0.3 }}
            >
              Connected to Network
            </motion.p>
          }

        </section>
        <section>
          <button onClick={() => { setOpen(!open) }}>
            {open ? `Collapse Info` : `Network Info`}
          </button>
          <ConnectionSymbol color={symbolColor} />
          {status === CONNECTION_STATUS[2] && <BlockNumber />}
        </section>
      </div>
      {open &&
        <div className='row details'>
          <div>
            <p>Maximum Nominations: {consts.maxNominations}</p>
          </div>
          <div>
            <p>Bond Duration: {consts.bondDuration} Days</p>
          </div>

          <div>
            <p>Sessions Per Era: {consts.sessionsPerEra}</p>
          </div>
          <div>
            <p>Max Nominators Rewarded per Validator: {consts.maxNominatorRewardedPerValidator}</p>
          </div>
          <div>
            <p>Nominator Cap: {staking.maxNominatorsCount}</p>
          </div>
          <div>
            <p>Validator Cap: {staking.maxValidatorsCount}</p>
          </div>
        </div>
      }
    </Wrapper>
  )
}

export default NetworkBar;