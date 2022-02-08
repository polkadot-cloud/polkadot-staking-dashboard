import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { useApi } from '../../contexts/Api';

export const BlockNumber = () => {

  const { api, isReady }: any = useApi();

  useEffect(() => {
    subscribeToBlockHeads(api);
  }, [api]);

  const [blockNumber, setBlockNumber] = useState('');

  // dynamic block number subscription: basic, no unsubscribe
  const subscribeToBlockHeads = async (api: any) => {

    if (isReady() === true && api !== null) {
      await api.rpc.chain.subscribeNewHeads((header: any) => {
        setBlockNumber('#' + header.number.toHuman());
      });
    }
  }

  return (
    <motion.div
      animate={{ opacity: [0.5, 1] }}
      transition={{ duration: 0.5 }}
    >
      {blockNumber}
    </motion.div>
  );
}

export default BlockNumber;