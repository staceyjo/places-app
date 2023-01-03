import React, { useState, useContext } from 'react';

import Card from '../../shared/components/UIElements/Card/Card';
import Input from '../../shared/components/FormElements/Input/Input';
import Button from '../../shared/components/FormElements/Button/Button';
import ErrorModal from '../../shared/components/UIElements/Modals/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner/LoadingSpinner';
import ImageUpload from "../../shared/components/FormElements/ImageUpload/ImageUpload"


import {
    VALIDATOR_EMAIL,
    VALIDATOR_MINLENGTH,
    VALIDATOR_REQUIRE
} from '../../shared/utilities/validators';

import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';

import './Auth.css';

const Auth = () => {
    const auth = useContext(AuthContext)


    const [isLoginMode, setIsLoginMode] = useState(true)


    // loading will take longer when we connect to a server, 
    // would be nice to set some indicator since we're not
    // giving the user any feedback on front end
    // const [isLoading, setIsLoading] = useState(false)


    // what if another error occurs?
    // right now there is a way to hack your own account
    // by inspecting the page and manually disabling attributes
    // not really a security issue- since you would be hacking yourself
    // const [error, setError] = useState()

    const { isLoading, error, sendRequest, clearError } = useHttpClient()



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
                    name: undefined,
                    // undefined bc when we switch from login to sign up we need to add an image key and set the value
                    image: undefined
                },
                formState.inputs.email.isValid && formState.inputs.password.isValid
            )
        } else {
            setFormData(
                {
                    ...formState.inputs,
                    name: {
                        value: "",
                        isValid: false
                    },

                    // switch from login to sign up, we need to set the image as an object
                    // value is null bc we aren't working with strings
                    // so an empty string wouldnt make sense

                    image: {
                        value: null,
                        isValid:false
                    }
                },
                false
            )
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

        console.log(formState.inputs);

        // setIsLoading(true);


        // since we don't always want to sign-up when we reach
        // this function, we need to check if login mode is true
        // // and if not true (else), we want to send the request
        if (isLoginMode) {
            // just in case it fails- wrap everything in try catch
            try {

                // send Http request with fetch() api which is provided
                // by the brower, could also use axios
                // fetch needs the string that points to the backend
                // and pass in the post request to create a user
                // by configruing the method property to POST
                const responseData = await sendRequest(
                    "http://localhost:5000/api/users/login",
                    "POST",
                    JSON.stringify({
                        email: formState.inputs.email.value,
                        password: formState.inputs.password.value
                    }),


                    // add the header key and
                    // set the headers key to add key value pairs that are 
                    // attached to the headers of the outgoing request
                    // set content type to application/json
                    // without that, the BE won't know which kind of data it receives
                    {
                        "Content-Type": "application/json"
                    }

                    // now we can attach some data
                    // body always has to be in json format
                    // and we can call stringify method which takes regualr 
                    // JS data, like an array or an object and converts itto JSON
                    // we then pass through the form data as an object
                    // the email and password are all useds as checks in the 
                    // login POST route and in the user-controllers when we 
                    // login
                    // formState comes from the useForm hook which manages the different pieces of data
                    // the submit button we made is ONLY clickable if we have a valid form
                );

                // // call .json to parse response body
                // // since this also returns a new promise, we need to use await
                // const responseData = await response.json()

                // // allowed to login/ be redirected with 500 or 400 status code
                // // this is a fetch() API issue
                // // the front end treats it like a response, which it technically is
                // // you sent a request and you got back a response
                // // the ok property is a property that exists on the response object
                // // it will be okay with a 200 level response
                // // if not okay- we have a higher level reponse error
                // // and can throw an error 
                // // and use the default JS error object
                // // to basically pass the response data message
                // // which should exist bc we send a message back on 
                // // every error on the backend ( i think)
                // // when we throw an error, then the catch block should trigger --works
                // if (!response.ok) {
                //     throw new Error(responseData.message)
                // }


                // console.log(responseData)

                // after we get the response (or an error) we can set isLoading to false again
                // setIsLoading(false);

                // finally log in if there are no errors
                auth.login(responseData.user.id)

            } catch (error) { }
            //     // will need to fix error handling
            //     console.log(error)


            // after we get the response (or an error) we can set isLoading to false again
            // setIsLoading(false);

            // if we have an error send a message or a fallback in case the message doesn't exist
            //     setError(error.message || "Something went wrong, please try again.")
            // }



        } else {

            // just in case it fails- wrap everything in try catch
            try {

                // send Http request with fetch() api which is provided
                // by the brower, could also use axios
                // fetch needs the string that points to the backend
                // and pass in the post request to create a user
                // by configruing the method property to POST
                const responseData = await sendRequest(
                    "http://localhost:5000/api/users/signup",
                    "POST",
                    JSON.stringify({
                        name: formState.inputs.name.value,
                        email: formState.inputs.email.value,
                        password: formState.inputs.password.value
                    }),

                    // add the header key and
                    // set the headers key to add key value pairs that are 
                    // attached to the headers of the outgoing request
                    // set content type to application/json
                    // without that, the BE won't know which kind of data it receives
                    {
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
                )
                auth.login(responseData.user.id);
            } catch (error) {

                // after we get the response (or an error) we can set isLoading to false again
                // setIsLoading(false);

                // if we have an error send a message or a fallback in case the message doesn't exist
                // setError(error.message || "Something went wrong, please try again.")

            }
        }
    }

    // // missing
    // // call .json to parse response body
    // // since this also returns a new promise, we need to use await
    // const responseData = await response.json()

    // allowed to login/ be redirected with 500 or 400 status code
    // this is a fetch() API issue
    // the front end treats it like a response, which it technically is
    // you sent a request and you got back a response
    // the ok property is a property that exists on the response object
    // it will be okay with a 200 level response
    // if not okay- we have a higher level reponse error
    // and can throw an error 
    // and use the default JS error object
    // to basically pass the response data message
    // which should exist bc we send a message back on 
    // every error on the backend ( i think)
    // when we throw an error, then the catch block should trigger --works
    // if (!response.ok) {
    //     throw new Error(responseData.message)
    // }


    // console.log(responseData)

    // after we get the response (or an error) we can set isLoading to false again
    // setIsLoading(false);


    // finally log in if there are no errors
    // auth.login()

    // } catch (error) {
    //     // will need to fix error handling
    //     console.log(error)




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

    // const errorHandler = () => {
    //     // setError(null)
    //     clearError()
    // }


    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />

            <Card className="authentication">
                {isLoading && <LoadingSpinner asOverlay />}

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

                    {/* adds onInput={} here for error- the arguments we pass in on the pickedHandler where we use onInput are: id, pickedfile and fileisvalid */}
                    {/* also use onInput in the input.js and we fwd the id, value and isValid */}
                    {/* this is the same as id= id, pickedfile= value and isValid = fileisvalid)  */}
                    {/* so we can bind auth to input handler */}

                    {/* the input handler function comes from the custom form hook */}
                    {/* so we can manage our file with the form hook, bc the form hook bc it doesn't cae about the actual data we are managing with it */}
                    {/* doesn't have to be text data, can be a file as well */}
                    {/* just have to be sure that when we switch modes-sign up to login */}
                    {/* we add an image key and set to undefined, see the switchModeHandler */}

                    {!isLoginMode && <ImageUpload center id="image" onInput={inputHandler} />}

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
                        validators={[VALIDATOR_MINLENGTH(6)]}
                        errorText="Please enter a valid password, at least 6 characters."
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

        </React.Fragment>
    );
};

export default Auth;