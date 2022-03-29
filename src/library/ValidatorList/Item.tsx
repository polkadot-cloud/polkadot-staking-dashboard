import { Item as ItemWrapper } from './Filters'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const Item = (props: any) => {

  const { icon, label, transform } = props;

  return (
    <ItemWrapper
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.99 }}
      transition={{
        duration: 0.5,
        type: "spring",
        bounce: 0.4,
      }}
    >
      <div>
        <div className='icon'>
          <FontAwesomeIcon icon={icon}
            color='#ccc'
            transform={transform}
          />
        </div>
      </div>
      <div>
        <p>{label}</p>
      </div>
    </ItemWrapper>
  )
}

export default Item;