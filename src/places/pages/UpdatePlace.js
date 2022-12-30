import React from "react"

import { useParams } from "react-router-dom"

import Input from "../../shared/components/FormElements/Input/Input";
import Button from "../../shared/components/FormElements/Button/Button";
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from "../../shared/utilities/validators"

const DUMMY_PLACES = [
    {
        id: 'p1',
        title: 'Stone Mountain',
        description: '16 miles east of Atlanta, a quartz monzonite dome monadnock surrounded by 3200 acres of natural beauty!',
        imageUrl: 'https://img1.10bestmedia.com/Images/Photos/6617/p-StoneMountain_55_660x440_201404181445.jpg',
        address: '1000 Robert E Lee Blvd, Stone Mountain, GA 30083',
        location: {
            lat: 33.8053189,
            lng: -84.1455315
        },
        creator: 'u1'
    },
    {
        id: 'p2',
        title: 'Empire State Building',
        description: 'One of the most famous sky scrapers in the world!',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg',
        address: '20 W 34th St, New York, NY 10001',
        location: {
            lat: 40.7484405,
            lng: -73.9878584
        },
        creator: 'u2'
    }
];


const UpdatePlace = () => {
    const placeId = useParams().placeId;

    const identifiedPlace = DUMMY_PLACES.find(p => p.id === placeId)

    if (!identifiedPlace) {
        return (
            <div className="center">
                <h2>Could not find place!</h2>
            </div>
        )

    }

    return (
        <form>
            <Input
                id="title"
                element="input"
                type="text"
                label="Title"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Please enter a valid title."
                onInput={() => { }}
                value={identifiedPlace.title}
                valid={true}
            />

            <Input
                id="description"
                element="textarea"
                label="Description"
                validators={[VALIDATOR_MINLENGTH(5)]}
                errorText="Please enter a valid description (at least 5 characters)."
                onInput={() => { }}
                value={identifiedPlace.description}
                valid={true}
            />

            <Button type="submit" disabled={true}>
                UPDATE PLACE
            </Button>

        </form>
    )
}

export default UpdatePlace