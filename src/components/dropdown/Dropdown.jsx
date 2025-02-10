import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import './dropdown.scss';

const Dropdown = ({ options, selected, onSelect = (item) => { }, optionIcon }) => {

  return (
    <div className='dropdown-holder' onMouseDown={(e) => e.preventDefault()} >
      {options.map((item, i) => (
        <div
          className={`option-holder ${selected && selected === item.value && 'selected'}`}
          onClick={() => onSelect(item)}
          key={item.value || i}
        >
          {optionIcon ? optionIcon : <FontAwesomeIcon icon={faCheck} className='check-icon' />}
          {item.option}
        </div>
      ))}
    </div>
  )
}

export default Dropdown