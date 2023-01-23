import { useNetworkMetrics } from 'contexts/Network';
import { clipAddress, humanNumberBn } from 'Utils';
import { ReactComponent as HouseIcon } from '../../img/fs_icon.svg';
import { HouseProps } from './types';
import { ItemsWrapper, ItemWrapper } from './Wrappers';

export const HouseList = ({ assets }: HouseProps) => {
  const { metrics } = useNetworkMetrics();

  const listItem = {
    hidden: {
      opacity: 0,
      y: 25,
      transition: {
        duration: 0.4,
      },
    },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        type: 'spring',
        bounce: 0.2,
      },
    },
  };
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.025,
      },
    },
  };

  return (
    <ItemsWrapper variants={container} initial="hidden" animate="show">
      {assets.map((house, index) => (
        <ItemWrapper
          whileHover={{ scale: 1.005 }}
          transition={{ duration: 0.15 }}
          variants={listItem}
          key={index}
        >
          <div className="inner">
            <section>
              <HouseIcon />
            </section>
            <section>
              <h3>
                {house.metadata}
                <button className="active" type="button">
                  <h4>{house.status}</h4>
                </button>
              </h3>
              <div className="details">
                <button className="active" type="button">
                  <h4>Onboarded in block:&nbsp;</h4>
                  <span>
                    <b>{house.created}</b>
                  </span>
                </button>
                <button type="button" className="active">
                  <h4>Price:&nbsp;</h4>
                  <h4>
                    <b>{`$ ${humanNumberBn(house.price, metrics.decimals)}`}</b>
                  </h4>
                </button>
                {house.tenants.length === 0 ? (
                  <h3>No tenants</h3>
                ) : (
                  <>
                    <h3>Tenants:&nbsp;</h3>
                    {house.tenants.map((tenant, tenantIndex) => (
                      <button
                        type="button"
                        className="active"
                        key={tenantIndex}
                      >
                        <h4>{clipAddress(tenant)}</h4>
                      </button>
                    ))}
                  </>
                )}
              </div>
            </section>
          </div>
        </ItemWrapper>
      ))}
    </ItemsWrapper>
  );
};
