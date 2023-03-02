import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faBars, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Identicon from '@polkadot/react-identicon';
import { useMenu } from 'contexts/Menu';
import { RegisteredTenant } from 'contexts/Tenants/types';
import { TenantAddrWrapper } from 'library/AssetItem/styles';
import CopyAddress from 'library/ListItem/Labels/CopyAddress';
import { MenuPosition } from 'library/ListItem/Wrappers';
import React, { useRef } from 'react';
import { clipAddress } from 'Utils';
import { Labels, Separator, TenantCardWrapper } from './styles';

export interface TenantMenuItem {
  icon?: React.ReactNode;
  title: string;
  cb: (collId: number, itemId: number) => void;
}

export interface TenantCardProps {
  tenant: RegisteredTenant;
  menuItems: Array<TenantMenuItem>;
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
          <TenantAddrWrapper>
            <Identicon value={tenant.accountId} size={24} />
            {clipAddress(tenant.accountId)}
            <CopyAddress address={tenant.accountId} />
          </TenantAddrWrapper>
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
        <div className="row">
          <div className="identity-item">
            <span>Display: </span>
            <span>{tenant.identity.display}</span>
          </div>
          {tenant.identity.email && (
            <div className="identity-item">
              <FontAwesomeIcon icon={faEnvelope} />
              <span>{tenant.identity.email}</span>
            </div>
          )}
          {tenant.identity.twitter && (
            <div className="identity-item">
              <FontAwesomeIcon icon={faTwitter} />
              <span>{tenant.identity.twitter}</span>
            </div>
          )}
        </div>
      </div>
    </TenantCardWrapper>
  );
};
