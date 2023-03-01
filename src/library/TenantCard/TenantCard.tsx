import Identicon from '@polkadot/react-identicon';
import { useMenu } from 'contexts/Menu';
import { RegisteredTenant } from 'contexts/Tenants/types';
import { MenuPosition } from 'library/ListItem/Wrappers';
import React, { useRef } from 'react';
import { TenantCardWrapper } from './styles';

export interface AssetMenuItem {
  icon?: React.ReactNode;
  title: string;
  cb: (collId: number, itemId: number) => void;
}

export interface TenantCardProps {
  tenant: RegisteredTenant;
  menuItems: Array<AssetMenuItem>;
}

export const TenantCard = ({ tenant, menuItems }: TenantCardProps) => {
  const { setMenuPosition, setMenuItems, open }: any = useMenu();

  const posRef = useRef(null);

  const toggleMenu = () => {
    if (!open) {
      setMenuItems(menuItems);
      setMenuPosition(posRef);
    }
  };

  return (
    <TenantCardWrapper>
      <div className="inner">
        {menuItems.length > 0 && <MenuPosition ref={posRef} />}
        <div className="row">
          <Identicon value={tenant.accountId} size={24} />
          {tenant.accountId}
        </div>
      </div>
    </TenantCardWrapper>
  );
};
