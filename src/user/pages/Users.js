import React, { useEffect, useState } from 'react';

import UsersList from "../components/UsersList"

import ErrorModal from "../../shared/components/UIElements/Modals/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";


// Dummy user for initial testing

// const Users = () => {

// const USERS = [
//     {
//         id: "u1",
//         name: "Simone Jackson",
//         image: "https://images.pexels.com/photos/4171757/pexels-photo-4171757.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
//         places: 3
//     }
// ];

//     return (
//         <UsersList items={USERS} />
//     )
// }

const Users = () => {

    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    // const [isLoading, setIsLoading] = useState(false)
    // const [error, setError] = useState()


    const [loadedUsers, setLoadedUsers] = useState();

    // want to send a http request whenever this page loads
    // useEffect will allow us to run certain code
    // only when certain dependencies change
    // which is defined in the first argument, the function
    // the second argument is an array of dependencies
    // if the 2nd argument is empty that means it will never run
    // the function contains the http fetch request
    // with fetch, the default request type is a GET request

    useEffect(() => {
        // IIFE- is an immediately invoked function expression
        // it runs as soon as it is defined
        // fetch returns a promise, but usEffect doesn't 
        // want a function that returns a promise
        // so we have to use and IIFE and put the fetch inside
        // then add async

        const fetchUsers = async () => {
            // setIsLoading(true)

            // in case we have an error, we move everything into
            // a try catch block

            try {
                const responseData = await sendRequest(
                    "http://localhost:5000/api/users"
                )

                // const responseData = await response.json()


                // // won't get an error if a 400-500 error code is sent, so 
                // // using !response.ok to check if response is not 200 level
                // // if not a 200-level response, we throw our own error

                // if (!response.ok) {
                //     throw new Error(responseData.message)
                // }

                // // once we get the response data, call setLoadedUsers
                // // in the backend- the object has a users key  that will be an array of users
                // // so we call the users key on the responseData
                // setLoadedUsers(responseData.users)

                setLoadedUsers(responseData.users);

            } catch (error) {
                // setError(error.message)
            }

            // also set isLoading to false bc it is set to true before request is sent
            // setIsLoading(false)

        }
        fetchUsers()

    }, [sendRequest])

    // function 
    // const errorHandler = () => {
    //     setError(null)
    // }

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && (
                <div className="center">
                    <LoadingSpinner />
                </div>
            )}
            {!isLoading && loadedUsers && <UsersList items={loadedUsers} />}
        </React.Fragment>
    );
};


export default Users