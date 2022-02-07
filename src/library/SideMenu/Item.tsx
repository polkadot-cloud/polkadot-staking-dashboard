import { ItemWrapper as Wrapper } from './Wrapper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee } from '@fortawesome/free-solid-svg-icons'

export const Item = (props: any) => {

  const { name, active } = props;

  return (
    <Wrapper active={active === true}>
      <button onClick={() => { }}>
        <span>
          <FontAwesomeIcon icon={faCoffee} transform='shrink-2' />
        </span>
        {name}
      </button>
    </Wrapper>
  )

}

export default Item;