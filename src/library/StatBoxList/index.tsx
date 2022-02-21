import { Wrapper, ListWrapper, Scrollable } from './Wrapper';
import Item from './Item';

export const StatBoxList = (props: any) => {

  const { items } = props;

  return (
    <Wrapper>
      <ListWrapper>
        <Scrollable>
          {items.map((item: any, index: number) =>
            <Item {...item} key={index} />
          )}
        </Scrollable>
      </ListWrapper>
    </Wrapper>
  )
}

export default StatBoxList;