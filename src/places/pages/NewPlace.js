import React, { useContext } from "react"
import { useHistory } from "react-router-dom"


import Input from "../../shared/components/FormElements/Input/Input"
import Button from "../../shared/components/FormElements/Button/Button"
import ErrorModal from "../../shared/components/UIElements/Modals/ErrorModal"
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner/LoadingSpinner"
import ImageUpload from "../../shared/components/FormElements/ImageUpload/ImageUpload"


import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "../../shared/utilities/validators"

import { useForm } from "../../shared/hooks/form-hook"

import { useHttpClient } from "../../shared/hooks/http-hook"

import { AuthContext } from "../../shared/context/auth-context"

import "./PlaceForm.css"


const NewPlace = () => {
    const auth = useContext(AuthContext)
    const { isLoading, error, sendRequest, clearError } = useHttpClient()
    const [formState, inputHandler] = useForm(
        {
            title: {
                value: '',
                isValid: false
            },

            description: {
                value: '',
                isValid: false
            },

            address: {
                value: '',
                isValid: false
            },

            image: {
                value: null,
                isValid: false
            }

        },
        false
    );

    const history = useHistory()

    const placeSubmitHandler = async event => {
        event.preventDefault()
        console.log(formState.inputs) // send this to the backend

        try {
            const formData = new FormData()

            // append the different data pieces that we have
            formData.append('title', formState.inputs.title.value);
            formData.append('description', formState.inputs.description.value);
            formData.append('address', formState.inputs.address.value);
            formData.append('creator', auth.userId);
            formData.append('image', formState.inputs.image.value);


            // // Help from Josh
            // // use a for and loop to loop over an object
            // const copy = formData
            // for (const key in copy) {
            //     copy[key] = copy[key].value
            // }

            // console.log(copy)

            await sendRequest(
                "http://localhost:5000/api/places/",
                "POST",
                formData

                // original request for initial testing
                // all this was replaced with the formdata
                // JSON.stringify({
                //     title: formState.inputs.title.value,
                //     description: formState.inputs.description.value,
                //     address: formState.inputs.address.value,
                //     creator: auth.userId
                // }),
                // { "Content-Type": "application/json" }

            )

            history.push("/")


        } catch (error) { }

    }

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            <form className="place-form" onSubmit={placeSubmitHandler}>
                {isLoading && <LoadingSpinner asOverlay />}
                <Input
                    id="title"
                    element="input"
                    type="text"
                    label="Title"
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Please enter a valid title."
                    onInput={inputHandler}
                />

                <Input
                    id="description"
                    element="textarea"
                    label="Description"
                    validators={[VALIDATOR_MINLENGTH(5)]}
                    errorText="Please enter a valid description (at least 5 characters)."
                    onInput={inputHandler}
                />

                <Input
                    id="address"
                    element="input"
                    label="Address"
                    validators={[VALIDATOR_REQUIRE]}
                    errorText="Please enter a valid address."
                    onInput={inputHandler}
                />

                <ImageUpload
                    id="image"
                    onInput={inputHandler}
                    errorText="Please provide an image."
                />


                <Button type="submit" disabled={!formState.isValid}>
                    ADD PLACE
                </Button>

            </form>
        </React.Fragment>

    )
}

export default NewPlace