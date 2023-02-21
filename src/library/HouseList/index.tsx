import { Asset } from 'contexts/Assets/types';
import { motion } from 'framer-motion';
import { AssetItem } from 'library/AssetItem';
import { Header, List, Wrapper as ListWrapper } from 'library/List';
import { MotionContainer } from 'library/List/MotionContainer';

interface HouseProps {
  assets: Array<Asset>;
  title: string;
}

export const HouseList = ({ assets, title }: HouseProps) => {
  return (
    <ListWrapper>
      {title && (
        <Header>
          <div>
            <h3>{title}</h3>
          </div>
          <div />
        </Header>
      )}

      <List flexBasisLarge="33%">
        <MotionContainer>
          {assets.map((house, index) => (
            <motion.div
              className="item col"
              key={index}
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
              <AssetItem asset={house} menuItems={[]} key={index} />
            </motion.div>
          ))}
        </MotionContainer>
      </List>
    </ListWrapper>
  );
};
