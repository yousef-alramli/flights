import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './counter.scss';

const Counter = ({ title, subtitle, count, setCount }) => {
  return (
    <div className='counter-container text-md'>
      <div className='title-holder'>
        <p>{title}</p>
        {subtitle && <p className='text-xs'>{subtitle}</p>}
      </div>
      <div className='counter'>
        <FontAwesomeIcon
          icon={faMinus}
          className={`plus-minus ${count === 0 && 'disable'}`}
          onClick={() => setCount(count - 1)}
        />
        <p>{count}</p>
        <FontAwesomeIcon
          icon={faPlus}
          className='plus-minus'
          onClick={() => setCount(count + 1)}
        />
      </div>
    </div>
  )
}

export default Counter