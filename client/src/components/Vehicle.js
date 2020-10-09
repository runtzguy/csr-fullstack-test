import React from 'react';
import '../css/Vehicle.css';

const Vehicle = ({id, make, model, year, locationDescription}) => {
    return (
        <div className='vehicle'>
            <p>Vehicle ID: {id}</p>
            <h2>{`${make} ${model}`}</h2>
            <p>{locationDescription}</p>
        </div>
    )
}

export default Vehicle;