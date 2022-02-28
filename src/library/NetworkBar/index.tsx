import { useState } from 'react';
import { motion } from "framer-motion";
import { Wrapper, ConnectionSymbol } from './Wrapper';
import { useApi } from '../../contexts/Api';
import { CONNECTION_SYMBOL_COLORS, CONNECTION_STATUS, ACTIVE_ENDPOINT, ENDPOINT_PRICE } from '../../constants';
import BlockNumber from './BlockNumber';

export const NetworkBar = () => {

  const { status, prices }: any = useApi();

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
      height: '2.6rem',
      background: 'white'
    },
    maximised: {
      height: '260px',
      background: '#d33079'
    },
  };

  const animate = open ? `maximised` : `minimised`;

  return (
    <Wrapper
      initial={false}
      animate={animate}
      transition={{
        duration: 0.4,
        type: "spring",
        bounce: 0.25
      }}
      variants={variants}
    >
      <div className='row'>
        <section>
          <ACTIVE_ENDPOINT.icon className='network_icon' />
          <p>{ACTIVE_ENDPOINT.name}</p>

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
          <div className='stat_separator' style={{ marginRight: 0 }}>
            {status === CONNECTION_STATUS[2] &&
              <BlockNumber />
            }
            <ConnectionSymbol color={symbolColor} />
          </div>

          <div className='separator'></div>

          <div className='stat_separator'>
            <span className={`change${prices.change < 0 ? ` neg` : prices.change > 0 ? ` pos` : ``}`}>
              {prices.change < 0 ? `` : prices.change > 0 ? `+` : ``}{prices.change}%
            </span>
          </div>

          <div className='stat_separator'>
            1 {ACTIVE_ENDPOINT.api.unit} / {prices.lastPrice} USD
          </div>
        </section>
      </div>
      <div className='details'>
        <div>
          <p>Polkadot Node Endpoint:</p>
          <p className='val'>{ACTIVE_ENDPOINT.endpoint}</p>
        </div>
        <div>
          <p>Price Tracker:</p>
          <p className='val'>{ENDPOINT_PRICE}</p>
        </div>
      </div>
    </Wrapper>
  )
}

export default NetworkBar;