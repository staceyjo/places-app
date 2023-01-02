import React, { useState, useContext } from 'react';

import Card from '../../shared/components/UIElements/Card/Card';
import Input from '../../shared/components/FormElements/Input/Input';
import Button from '../../shared/components/FormElements/Button/Button';

import {
    VALIDATOR_EMAIL,
    VALIDATOR_MINLENGTH,
    VALIDATOR_REQUIRE
} from '../../shared/utilities/validators';

import { useForm } from '../../shared/hooks/form-hook';
import { AuthContext } from '../../shared/context/auth-context';

import './Auth.css';

const Auth = () => {
    const auth = useContext(AuthContext)


    const [isLoginMode, setIsLoginMode] = useState(true)

    const [formState, inputHandler, setFormData] = useForm(
        {
            email: {
                value: '',
                isValid: false
            },
            password: {
                value: '',
                isValid: false
            }
        },
        false
    );

    const switchModeHandler = () => {
        if (!isLoginMode) {
            setFormData(
                {
                    ...formState.inputs,
                    name: undefined
                },
                formState.inputs.email.isValid && formState.inputs.email.isValid
            )
        } else {
            setFormData({
                ...formState.inputs,
                name: "",
                isValid: false
            }, false)
        }

        setIsLoginMode(prevMode => !prevMode)
    }


    // ===================== fires when we authenticate
    // so whenever we login or sign-up we'll send an HTTP request in both cases

    // need to fix: do different things depending on whether we log in or submit
    // 1- if we log in- i don't want to create a new user
    // 2- if we sign-up- create new user

    //  original:
    // const authSubmitHandler = event => {
    //     event.preventDefault();
    //     console.log(formState.inputs);
    //     auth.login()

    // };

    // revised:
    // converted to async function in order to use aync await
    const authSubmitHandler = async event => {
        event.preventDefault();

        // console.log(formState.inputs);

        // since we don't always want to sign-up when we reach
        // this functiom, we need to check if login mode is true

        // // and if not true (else), we want to send the request
        if (isLoginMode) {

        } else {

            // just in case it fails- wrap everything in try catch
            try {

                // send Http request with fetch() api which is provided
                // by the brower, could also use axios
                // fetch needs the string that points to the backend
                // and pass in the post request to create a user
                // by configruing the method property to POST
                const response = await fetch("http://localhost:5000/api/users/signup", {
                    method: "POST",

                    // add the header key and
                    // set the headers key to add key value pairs that are 
                    // attached to the headers of the outgoing request
                    // set content type to application/json
                    // without that, the BE won't know which kind of data it receives
                    headers: {
                        "Content-Type": "application/json"
                    },

                    // now we can attach some data
                    // body always has to be in json format
                    // and we can call stringify method which takes regualr 
                    // JS data, like an array or an object and converts itto JSON
                    // we then pass through the form data as an object
                    // the name, email and password are all useds as checks in the 
                    // signup POST route and in the user-controllers when we 
                    // create a new user
                    // formState comes from the useForm hook which manages the different pieces of data
                    // the submit button we made is ONLY clickable if we have a valid form
                    body: JSON.stringify({
                        name: formState.inputs.name.value,
                        email: formState.inputs.email.value,
                        password: formState.inputs.password.value
                    })
                })
                // call .json to parse response body
                // since this also returns a new promise, we need to use await
                const responseData = await response.json()
                console.log(responseData)
            } catch (error) {
                // will need to fix error handling
                console.log(error)
            }
        }

        auth.login()

    };

    // experiencing a CORS error
    // CORS = Cross Origin Resource Sharing
    // the error happens when building apps that are
    // communicating to an from inside the front end
    // CORS is tied to security
    // resources on a server can only be requested
    // by requests coming from the same server
    // back end running on 5000
    // front end running on 3001
    // so basically like two separate domains
    // this is a front end broswer security error
    // to fix it/ work around it, we need to attach the right headers to our response
    // need to fix in server.js


    return (
        <Card className="authentication">

            <h2>Login Required</h2>

            <hr />

            <form onSubmit={authSubmitHandler}>
                {!isLoginMode && (
                    <Input
                        element="input"
                        id="name"
                        type="text"
                        label="Your Name"
                        validators={[VALIDATOR_REQUIRE]}
                        errorText="Please enter a name."
                        onInput={inputHandler}
                    />)}
                <Input
                    element="input"
                    id="email"
                    type="email"
                    label="E-Mail"
                    validators={[VALIDATOR_EMAIL()]}
                    errorText="Please enter a valid email address."
                    onInput={inputHandler}
                />

                <Input
                    element="input"
                    id="password"
                    type="password"
                    label="Password"
                    validators={[VALIDATOR_MINLENGTH(5)]}
                    errorText="Please enter a valid password, at least 5 characters."
                    onInput={inputHandler}
                />

                <Button type="submit" disabled={!formState.isValid}>
                    {isLoginMode ? "LOGIN" : "SIGNUP"}
                </Button>

            </form>

            <Button inverse onClick={switchModeHandler}>
                SWITCH TO {isLoginMode ? "SIGNUP" : "LOGIN"}
            </Button>

        </Card>
    );
};

export default Auth;