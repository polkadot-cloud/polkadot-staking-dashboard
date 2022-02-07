import { Wrapper } from './Wrapper';
import Heading from './Heading';
import Item from './Item';

export const SideMenu = () => {

  return (
    <Wrapper>
      <Item name="Menu Item" active={true} />

      <Heading title="Heading" />
      <Item name="Menu Item" />
      <Item name="Menu Item" />

      <Heading title="Heading" />
      <Item name="Menu Item" />
      <Item name="Menu Item" />
      <Item name="Menu Item" />
      <Item name="Menu Item" />

      <Heading title="Heading" />
      <Item name="Menu Item" />
    </Wrapper>
  );
}

export default SideMenu;