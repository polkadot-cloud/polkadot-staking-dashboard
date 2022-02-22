import { ItemWrapper as Wrapper } from './Wrapper';
import { Link } from "react-router-dom";

export const Item = (props: any) => {

  const { name, active, to, icon } = props;


  return (
    <Link to={to}>
      <Wrapper
        className={active ? `active` : `inactive`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{
          duration: 0.1,
        }}
      >
        <span>
          {icon}
        </span>
        {name}
      </Wrapper>
    </Link>
  )

}

export default Item;