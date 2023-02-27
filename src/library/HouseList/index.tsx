import { Asset } from 'contexts/Assets/types';
import { motion } from 'framer-motion';
import { AssetItem, AssetMenuItem } from 'library/AssetItem';
import { Header, List, Wrapper as ListWrapper } from 'library/List';
import { MotionContainer } from 'library/List/MotionContainer';

interface HouseProps {
  assets: Array<Asset>;
  title: string;
  menu?: (collId: number, itemId: number) => Array<AssetMenuItem>;
}

export const HouseList = ({ assets, title, menu }: HouseProps) => {
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
              <AssetItem
                asset={house}
                menuItems={!menu ? [] : menu(house.collId, house.itemId)}
                key={index}
              />
            </motion.div>
          ))}
        </MotionContainer>
      </List>
    </ListWrapper>
  );
};
