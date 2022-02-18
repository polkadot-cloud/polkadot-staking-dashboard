import { ItemWrapper as Wrapper } from './Wrapper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from "react-router-dom";

export const Item = (props: any) => {

  const { name, active, to, icon } = props;

  return (
    <Link to={to}>
      <Wrapper active={active === true}>
        <span>
          {icon}
        </span>
        {name}
      </Wrapper>
    </Link>
  )

}

export default Item;