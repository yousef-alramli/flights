import { PuffLoader } from 'react-spinners';
import './availableFlights.scss';

const AvailableFlights = ({ flightsList, isLoading }) => {
  return (
    <div className='available-flights'>
      {isLoading &&
        <div className='loader'>
          <PuffLoader color='#1a73e8' size={60} />
        </div>
      }

      <ul className='flights-table'>
        {flightsList.map(flight => {
          const carrier = flight?.legs[0]?.carriers?.marketing[0];
          const arrival = flight?.legs[0]?.arrival?.split('T')[1]?.substring(0, 5)
          const departure = flight?.legs[0]?.departure?.split('T')[1]?.substring(0, 5)
          const durationHours = Math.floor(flight?.legs[0]?.durationInMinutes / 60);
          const durationMin = flight?.legs[0]?.durationInMinutes % 60;
          const stops = flight?.legs[0]?.stopCount;
          return (
            <li className='table-row' key={flight.id}>
              <div className='section'>
                <div className='col col-1'>
                  <img src={carrier.logoUrl} className='logo' alt='Flight logo' />
                  <p>{carrier.name}</p>
                </div>
                <div className='col col-2'>
                  <p>{durationHours} hrs {durationMin} min</p>
                </div>
              </div>
              <div className='section'>
                <div className='col col-3'>{departure} - {arrival}</div>
                <div className='col col-4'>{stops ? `${stops} stop` : 'Non-stop'}</div>
                <div className='col col-4'>{flight.price.formatted}</div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default AvailableFlights