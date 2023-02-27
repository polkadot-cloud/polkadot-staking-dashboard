import {
  faBars,
  faClockFour,
  faDollar,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Asset } from 'contexts/Assets/types';
import { useMenu } from 'contexts/Menu';
import { useNetworkMetrics } from 'contexts/Network';
import { MenuPosition } from 'library/ListItem/Wrappers';
import React, { useRef } from 'react';
import { humanNumberBn } from 'Utils';
import {
  AssetItemWrapper,
  AssetName,
  InfoItem,
  Labels,
  Separator,
  StatusWrapper,
} from './styles';

export interface AssetMenuItem {
  icon?: React.ReactNode;
  title: string;
  cb: (collId: number, itemId: number) => void;
}

interface AssetProps {
  asset: Asset;
  menuItems: Array<AssetMenuItem>;
}
export const AssetItem = ({ asset, menuItems }: AssetProps) => {
  const { decimals } = useNetworkMetrics();
  const { setMenuPosition, setMenuItems, open }: any = useMenu();
  const posRef = useRef(null);

  const toggleMenu = () => {
    if (!open) {
      setMenuItems(menuItems);
      setMenuPosition(posRef);
    }
  };

  return (
    <AssetItemWrapper>
      <div className="inner">
        {menuItems.length > 0 && <MenuPosition ref={posRef} />}
        <div className="row">
          <AssetName>{asset.metadata}</AssetName>
          <StatusWrapper status={asset.status}>{asset.status}</StatusWrapper>
          {menuItems.length > 0 && (
            <div>
              <Labels>
                <button
                  type="button"
                  className="label"
                  onClick={() => toggleMenu()}
                >
                  <FontAwesomeIcon icon={faBars} />
                </button>
              </Labels>
            </div>
          )}
        </div>
        <Separator />
        <div className="row status">
          <InfoItem>
            <FontAwesomeIcon icon={faClockFour} />
            <b>{asset.created}</b>
          </InfoItem>
          <InfoItem>
            <FontAwesomeIcon icon={faDollar} />
            <b>{humanNumberBn(asset.price, decimals)}</b>
          </InfoItem>
          <InfoItem>
            <b>Representative:</b>
            <b className="no-rep">{asset.representative ?? 'None'}</b>
          </InfoItem>
        </div>
      </div>
    </AssetItemWrapper>
  );
};
