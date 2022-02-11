import { Wrapper, ListWrapper, Scrollable } from './Wrapper';
import Item from './Item';

export const StatBoxList = (props: any) => {

  const { title, items } = props;

  return (
    <Wrapper>
      <h2>{title}</h2>
      <ListWrapper>
        <Scrollable>
          {items.map((item: any, index: number) =>
            <Item {...item} />
          )}
        </Scrollable>
      </ListWrapper>
    </Wrapper>
  )
}

export default StatBoxList;