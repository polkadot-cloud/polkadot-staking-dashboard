import type { MenuItem } from 'contexts/Menu/types';
import { ItemWrapper } from './Wrappers';
import { useMenu } from 'contexts/Menu';

export const MenuList = ({ items }: { items: MenuItem[] }) => {
  const { closeMenu } = useMenu();

  return (
    <>
      {items.map((item, i: number) => {
        const { icon, title, cb } = item;

        return (
          <ItemWrapper
            key={`menu_item_${i}`}
            onClick={() => {
              cb();
              closeMenu();
            }}
          >
            {icon}
            <div className="title">{title}</div>
          </ItemWrapper>
        );
      })}
    </>
  );
};
