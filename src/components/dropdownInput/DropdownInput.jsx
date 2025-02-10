import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import Dropdown from '../dropdown/Dropdown';
import './dropdownInput.scss'

const DropdownInput = ({ header, options, onSelect, selected }) => {
  const [openDropdown, setOpenDropdown] = useState(false);

  return (
    <div className={`dropdown-input-container ${openDropdown && 'open'}`} onBlur={() => setOpenDropdown(false)} tabIndex={1}>
      <div className='input-header' onClick={() => setOpenDropdown(!openDropdown)}>
        {header}
        <FontAwesomeIcon icon={faCaretDown} className='caret-icon' />
      </div>
      {openDropdown &&
        <Dropdown options={options} onSelect={onSelect} selected={selected} />
      }
      <div className='border'></div>
    </div>
  )
}

export default DropdownInput