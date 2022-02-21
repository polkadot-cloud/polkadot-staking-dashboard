import { motion } from 'framer-motion';
import { ItemWrapper as Wrapper } from './Wrappers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt as faExt } from '@fortawesome/free-solid-svg-icons';

export const Item = (props: any) => {

  let { content, label, title, onClick } = props;

  if (onClick === undefined) {
    onClick = () => { };
  }

  return (
    <Wrapper
      width={props.width}
      height={props.height}
      actionRequired={props.actionRequired}
    >
      <motion.button
        className='item'
        whileHover={{ scale: 1.015 }}
        whileTap={{ scale: 0.99 }}
        transition={{
          duration: 0.5,
          type: "spring",
          bounce: 0.4,
        }}
        onClick={props.onClick}
      >
        <h4>{label}</h4>
        <h3>{title}</h3>
        <p>{content}</p>
        {props.ext && <FontAwesomeIcon icon={faExt} className='ext' />}
      </motion.button>
    </Wrapper>
  );
}

export default Item;