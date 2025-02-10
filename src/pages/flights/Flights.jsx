import { useEffect, useMemo, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleDot, faLocationDot, faMagnifyingGlass, faPlaneUp } from '@fortawesome/free-solid-svg-icons';
import Dropdown from '../../components/dropdown/Dropdown';
import './flights.scss';
import PassengersCountInput from '../../components/passengersCountInput/PassengersCountInput';
import DropdownInput from '../../components/dropdownInput/DropdownInput';
import http from '../../utils/http';
import { toastError } from '../../utils/toast';
import AvailableFlights from '../../components/availableFlights/AvailableFlights';

const cabinClasses = [
  { option: 'Economy', value: 'economy' },
  { option: 'Premium Economy', value: 'premium_economy' },
  { option: 'Business', value: 'business' },
  { option: 'First', value: 'first' }
];

const Flights = () => {
  const [toAirportsOptions, setToAirportsOptions] = useState([]);
  const [fromAirportsOptions, setFromAirportsOptions] = useState([]);
  const [fromDate, setFromDate] = useState(new Date().toJSON().split('T')[0]);
  const [toDate, setToDate] = useState('');
  const [fromAirport, setFromAirport] = useState({});
  const [toAirport, setToAirport] = useState({});
  const [passengerCount, setPassengerCount] = useState({ adults: 1 });
  const [cabinClass, setCabinClass] = useState({ option: 'Economy', value: 'economy' });
  const [availableFlights, setAvailableFlights] = useState([]);

  const [fromAirportQuery, setFromAirportQuery] = useState('');
  const [toAirportQuery, setToAirportQuery] = useState('');
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [loadingFlights, setLoadingFlights] = useState(false);

  const timeout = useRef(null);

  useEffect(() => {
    getNearAirports();
  }, []);

  const mappingDataToOption = (data) => {
    return data.map((item) => {
      item.option = item?.presentation?.title || item?.navigation?.localizedName;
      return item;
    });
  }

  const getNearAirports = async () => {
    const location = window.navigator && window.navigator.geolocation;
    if (location) {
      location.getCurrentPosition(async (position) => {
        try {
          const airports = await http.get('v1/flights/getNearByAirports', {
            params: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              locale: 'en-US'
            },
          });
          const mappedData = mappingDataToOption(airports.data.data.nearby);
          setToAirportsOptions(mappedData);
          setFromAirportsOptions(mappedData);
        } catch (error) {
          toastError('Oops, Something went wrong');
        }
      }, (error) => {
        toastError('Oops, Something went wrong');
      })
    }
  }

  const searchAirports = async (event, setQuery, setAirports) => {
    const query = event.target.value;
    setQuery(query);
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
    timeout.current = setTimeout(async () => {
      try {
        const airports = await http.get('v1/flights/searchAirport', {
          params: {
            query
          }
        });

        const mappedData = mappingDataToOption(airports?.data?.data || []);
        setAirports(mappedData);
        timeout.current = null
      } catch (error) {
        toastError('Oops, Something went wrong');
      }
    }, 300)
  }

  const openCalenderOnClick = (e) => {
    e.target.showPicker();
  }

  const handleCountChange = (countObject) => {
    setPassengerCount(countObject);
  }

  const optionsIcon = useMemo(() => <FontAwesomeIcon icon={faPlaneUp} className='plane-icon' />);

  const selectFromAirport = (item) => {
    setFromAirport(item);
    setFromAirportQuery(item.option);
    setShowFromDropdown(false);
  }

  const selectToAirport = (item) => {
    setToAirport(item);
    setToAirportQuery(item.option)
    setShowToDropdown(false);
  }

  const searchFlights = async (event, sortBy = 'best') => {
    event.preventDefault();
    setLoadingFlights(true);
    try {
      const flights = await http.get('v2/flights/searchFlights', {
        params: {
          originSkyId: fromAirport.navigation.relevantFlightParams.skyId,
          destinationSkyId: toAirport.navigation.relevantFlightParams.skyId,
          originEntityId: fromAirport.navigation.entityId,
          destinationEntityId: toAirport.navigation.entityId,
          cabinClass: cabinClass.value,
          ...passengerCount,
          date: fromDate,
          returnDate: toDate,
          sortBy: sortBy,
          currency: 'USD',
        }
      });
      setAvailableFlights(flights.data.data.itineraries)
      setLoadingFlights(false);
    } catch (error) {
      toastError('Oops, Something went wrong');
      setLoadingFlights(false);
    }
  }

  return (
    <div className='flights-page'>
      <div className='header-holder'>
        <h1 className='text-header'>Flights</h1>
      </div>
      <div className='flights-body'>
        <form className='flights-form'>
          <div className='top-section'>
            <PassengersCountInput handleCountChange={handleCountChange} />
            <DropdownInput options={cabinClasses} onSelect={setCabinClass} selected={cabinClass.value} header={cabinClass.option} />
          </div>

          <div className='date-location-container'>
            <div className='search-inputs-container'>
              <fieldset className='field-holder' onBlur={() => setShowFromDropdown(false)} tabIndex={10}>
                <FontAwesomeIcon icon={faCircleDot} color='#808185' className='icon' />
                <input
                  className='text-md search-input'
                  type='text'
                  placeholder='Where from?'
                  value={fromAirportQuery}
                  onChange={(event) => searchAirports(event, setFromAirportQuery, setFromAirportsOptions)}
                  onFocus={() => setShowFromDropdown(true)}
                />
                {showFromDropdown &&
                  <Dropdown
                    options={fromAirportsOptions}
                    onSelect={selectFromAirport}
                    optionIcon={optionsIcon}
                  />
                }
              </fieldset>

              <fieldset className='field-holder' onBlur={() => setShowToDropdown(false)} tabIndex={1}>
                <FontAwesomeIcon icon={faLocationDot} color='#808185' className='icon' />
                <input
                  className='text-md search-input'
                  type='text'
                  placeholder='Where to?'
                  value={toAirportQuery}
                  onChange={(event) => searchAirports(event, setToAirportQuery, setToAirportsOptions)}
                  onFocus={() => setShowToDropdown(true)}
                />
                {showToDropdown &&
                  <Dropdown
                    options={toAirportsOptions}
                    onSelect={selectToAirport}
                    optionIcon={optionsIcon}
                  />
                }
              </fieldset>
            </div>
            <div className='date-holder'>
              <input
                className='text-md date-input'
                type='date'
                placeholder='Where from?'
                value={fromDate}
                onChange={e => setFromDate(e.target.value)}
                onClick={openCalenderOnClick}
              />
              <div className='border'></div>
              <input
                className='text-md date-input'
                type='date'
                placeholder='Where to?'
                min={fromDate}
                value={toDate}
                onChange={e => setToDate(e.target.value)}
                onClick={openCalenderOnClick}
              />
            </div>
          </div>

          <button className='submit-button text-bold text-sm' onClick={searchFlights}>
            <FontAwesomeIcon icon={faMagnifyingGlass} />
            Explore
          </button>
        </form>

        <AvailableFlights flightsList={availableFlights} isLoading={loadingFlights} />
      </div>
    </div>
  )
}

export default Flights;
