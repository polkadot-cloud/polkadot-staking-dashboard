import { ItemWrapper as Wrapper } from './Wrapper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee } from '@fortawesome/free-solid-svg-icons'
import { Link } from "react-router-dom";

export const Item = (props: any) => {

  const { name, active, to } = props;

  return (
    <Link to={to}>
      <Wrapper active={active === true}>
        <span>
          <FontAwesomeIcon icon={faCoffee} transform='shrink-2' />
        </span>
        {name}
      </Wrapper>
    </Link>
  )

}

export default Item;