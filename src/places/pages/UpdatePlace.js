import React, { useEffect, useState, useContext } from "react"

import { useParams, useHistory } from "react-router-dom"

import Input from "../../shared/components/FormElements/Input/Input";
import Button from "../../shared/components/FormElements/Button/Button";
import Card from "../../shared/components/UIElements/Card/Card";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner/LoadingSpinner"
import ErrorModal from "../../shared/components/UIElements/Modals/ErrorModal"

import {
    VALIDATOR_REQUIRE,
    VALIDATOR_MINLENGTH
} from "../../shared/utilities/validators"

import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook"
import { AuthContext } from "../../shared/context/auth-context"

import "./PlaceForm.css"



// const DUMMY_PLACES = [
//     {
//         id: 'p1',
//         title: 'Stone Mountain',
//         description: '16 miles east of Atlanta, a quartz monzonite dome monadnock surrounded by 3200 acres of natural beauty!',
//         imageUrl:
//             'https://img1.10bestmedia.com/Images/Photos/6617/p-StoneMountain_55_660x440_201404181445.jpg',
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


const UpdatePlace = () => {
    const auth = useContext(AuthContext)
    const { isLoading, error, sendRequest, clearError } = useHttpClient()

    const [loadedPlace, setLoadedPlace] = useState()

    // const [isLoading, setIsLoading] = useState(true)
    const placeId = useParams().placeId;

    const history = useHistory()


    const [formState, inputHandler, setFormData] = useForm({
        title: {
            value: "",
            isValid: false
        },
        description: {
            value: "",
            isValid: false
        }
    }, false)

    // const identifiedPlace = DUMMY_PLACES.find(p => p.id === placeId);

    useEffect(() => {
        const fetchPlace = async () => {
            try {
                const responseData = await sendRequest(
                    `http://localhost:5000/api/places/${placeId}`
                )
                setLoadedPlace(responseData.place)

                setFormData(
                    {
                        title: {
                            value: responseData.place.title,
                            isValid: true
                        },
                        description: {
                            value: responseData.place.description,
                            isValid: true

                        }
                    },
                    true
                )



            } catch (error) { }
        }

        fetchPlace()

    }, [sendRequest, placeId, setFormData])

    // useEffect(() => {
    //     if (identifiedPlace) {
    //         setFormData(
    //             {
    //                 title: {
    //                     value: identifiedPlace.title,
    //                     isValid: true
    //                 },
    //                 description: {
    //                     value: identifiedPlace.description,
    //                     isValid: true

    //                 }
    //             },
    //             true
    //         )
    //     }
    //     setIsLoading(false)
    // }, [setFormData, identifiedPlace])



    const placeUpdateSubmitHandler = async event => {
        event.preventDefault()
        // console.log(formState.inputs)

        try {
            await sendRequest(
                `http://localhost:5000/api/places/${placeId}`,
                "PATCH",
                JSON.stringify({
                    title: formState.inputs.title.value,
                    description: formState.inputs.description.value
                }),
                {
                    "Content-Type": "application/json"
                }
            )
            history.push("/" + auth.userId + "/places")

        } catch (error) { }

    }


    if (isLoading) {
        return (
            <div className="center">
                {/* <h2>Loading...</h2> */}
                <LoadingSpinner />
            </div>
        );

    }

    if (!loadedPlace && !error) {
        return (
            <div className="center">
                <Card>
                    <h2>Could not find place!</h2>
                </Card>
            </div>
        );
    }


    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            {!isLoading && loadedPlace &&
                <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
                    <Input
                        id="title"
                        element="input"
                        type="text"
                        label="Title"
                        validators={[VALIDATOR_REQUIRE()]}
                        errorText="Please enter a valid title."
                        onInput={inputHandler}
                        // initialValue={formState.inputs.title.value}
                        initialValue={loadedPlace.title}
                        // initialValid={formState.inputs.title.isValid}
                        initialValid={true}
                    />
                    <Input
                        id="description"
                        element="textarea"
                        label="Description"
                        validators={[VALIDATOR_MINLENGTH(5)]}
                        errorText="Please enter a valid description (min. 5 characters)."
                        onInput={inputHandler}
                        // initialValue={formState.inputs.description.value}
                        initialValue={loadedPlace.description}
                        // initialValid={formState.inputs.description.isValid}
                        initialValid={true}

                    />
                    <Button type="submit" disabled={!formState.isValid}>
                        UPDATE PLACE
                    </Button>
                </form>
            }
        </React.Fragment>

    );
};

export default UpdatePlace;
