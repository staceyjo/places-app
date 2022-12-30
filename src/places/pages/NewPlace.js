import React from "react"

import Input from "../../shared/components/FormElements/Input/Input"
import { VALIDATOR_REQUIRE } from "../../shared/utilities/validators"

import "./NewPlace.css"

const NewPlace = () => {
    return (
        <form className="place-form">
            <Input
                element="input"
                type="text"
                label="Title"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Please enter a valid title."
            />
        </form>

    )
}

export default NewPlace