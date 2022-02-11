import { Wrapper, ListWrapper, Scrollable } from './Wrapper';
import Item from './Item';

export const StatBoxList = (props: any) => {

  const { title } = props;

  return (
    <Wrapper>
      <h2>{title}</h2>
      <ListWrapper>
        <Scrollable>
          <Item label="Statistic 1" />
          <Item label="Statistic 2" />
          <Item label="Statistic 3" />
        </Scrollable>
      </ListWrapper>
    </Wrapper>
  )
}

export default StatBoxList;