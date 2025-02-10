import { useCallback, useEffect, useMemo, useState } from 'react';
import { faCaretDown, faUser } from '@fortawesome/free-solid-svg-icons';
import Dropdown from '../dropdown/Dropdown';
import Counter from '../counter/Counter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './passengersCountInput.scss'
import DropdownInput from '../dropdownInput/DropdownInput';

const PassengersCountInput = ({ handleCountChange }) => {
  const [totalCount, setTotalCount] = useState(1);
  const [adultCount, setAdultCount] = useState(1);
  const [childrenCount, setChildrenCount] = useState(0);
  const [infantsCount, setInfantsCount] = useState(0);

  useEffect(() => {
    const total = adultCount + childrenCount + infantsCount;
    setTotalCount(total);

    const countObject = {}
    if (adultCount) {
      countObject.adultCount = adultCount.toString();
    }
    if (childrenCount) {
      countObject.childrens = childrenCount.toString();
    }
    if (infantsCount) {
      countObject.infants = infantsCount.toString();
    }

    handleCountChange(countObject);
  }, [adultCount, childrenCount, infantsCount])

  const options = useMemo(() => [
    { option: <Counter title='Adults' count={adultCount} setCount={setAdultCount} /> },
    { option: <Counter title='Children' subtitle='Aged 2–11' count={childrenCount} setCount={setChildrenCount} /> },
    { option: <Counter title='Infants' subtitle='On lap' count={infantsCount} setCount={setInfantsCount} /> },
  ], [adultCount, childrenCount, infantsCount]);

  const header = useMemo(() => (
    <>
      <FontAwesomeIcon icon={faUser} className='user-icon' />
      {totalCount}
    </>
  ), [totalCount])

  return (
    <div className='count-input-container '>
      <DropdownInput header={header} options={options} />
    </div>
  )
}

export default PassengersCountInput;
