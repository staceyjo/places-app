import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom"

import PlaceList from '../components/PlaceList';
import ErrorModal from '../../shared/components/UIElements/Modals/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner/LoadingSpinner';

import { useHttpClient } from '../../shared/hooks/http-hook';

// const DUMMY_PLACES = [
//     {
//         id: 'p1',
//         title: 'Stone Mountain',
//         description: '16 miles east of Atlanta, a quartz monzonite dome monadnock surrounded by 3200 acres of natural beauty!',
//         imageUrl: 'https://img1.10bestmedia.com/Images/Photos/6617/p-StoneMountain_55_660x440_201404181445.jpg',
//         address: '1000 Robert E Lee Blvd, Stone Mountain, GA 30083',
//         location: {
//             lat: 33.8053189,
//             lng: -84.1455315
//         },
//         creator: 'u1'
//     },
//     {
//         id: 'p2',
//         title: 'Empire State Building',
//         description: 'One of the most famous sky scrapers in the world!',
//         imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg',
//         address: '20 W 34th St, New York, NY 10001',
//         location: {
//             lat: 40.7484405,
//             lng: -73.9878584
//         },
//         creator: 'u2'
//     }
// ];

const UserPlaces = () => {
    const [loadedPlaces, setLoadedPlaces] = useState()

    const { isLoading, error, sendRequest, clearError } = useHttpClient()

    // extract user ID from url
    const userId = useParams().userId;

    useEffect(() => {
        const fetchPlaces = async () => {
            try {
                const responseData = await sendRequest(
                    `http://localhost:5000/api/places/user/${userId}`
                )
                setLoadedPlaces(responseData.places)

            } catch (error) { }
        }
        fetchPlaces()
    }, [sendRequest, userId])

    // const loadedPlaces = DUMMY_PLACES.filter(place => place.creator === userId)

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && (
                <div className="center">
                    <LoadingSpinner />
                </div>
            )}
            {!isLoading && loadedPlaces && <PlaceList items={loadedPlaces} />}
        </React.Fragment>
    )
};

export default UserPlaces;