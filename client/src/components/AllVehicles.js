import React, {useEffect, useState} from 'react';
import axios from 'axios';

import Vehicle from './Vehicle';

import '../css/AllVehicles.css'

const AllVehicles = () => {
    const [vehicles, setVehicles] = useState();
    const isVehiclesExist = vehicles 
        ? vehicles.map(item => 
            <Vehicle
                key={item.id} 
                id={item.id}
                make={item.make}
                model={item.model} 
                year={item.year}
                locationDescription={item.location_description}
            />) 
        :   <div>No Vehicle</div>;

    useEffect(() => {
        axios
            .get('/vehicles')
            .then( res => {
                const { data } = res;
                setVehicles(data);
            })
            .catch( err => {
                console.error(err);
            })
    })

    return (
            <div className="all-vehicles-container">
                <h1 className="all-vehicles-title">All Vehicles</h1>
                <div className="vehicle-card-container">
                    {isVehiclesExist}
                </div> 
            </div>
    )
}

export default AllVehicles;