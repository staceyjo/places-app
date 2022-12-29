import React from "react";

import UsersList from "../components/UsersList"

const Users = () => {
    const USERS = [
        {
            id: "u1",
            name: "Simone Jackson",
            image: "https://images.pexels.com/photos/4171757/pexels-photo-4171757.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            places: 3
        }
    ];

    return (
        <UsersList items={USERS} />
    )
}

export default Users