import React from 'react';

import UserItem from './UserItem';
import Card from '../../shared/components/UIElements/Card/Card';
import './UsersList.css';

// Original attempt: with stack Overflow solutions

const UsersList = props => {
    if (props.items.length === 0) {
        return (
            <div className="center">
                <Card>
                    <h2>No users found.</h2>
                </Card>
            </div>
        );
    }

    return (
        <ul className="users-list">
            {props.items.map(user => (

                <UserItem
                    key={user.id}
                    id={user.id}
                    image={user.image}
                    name={user.name}
                    // placeCount={ user.places ? user.places.length : 0 }
                    placeCount={ user.places?.length ?? 0 }
                />
            ))}
        </ul>
    );
}


// Attempt 2 - not working either
// const UsersList = ({ items = [] }) => {
//     if (items.length === 0) {
//         return (
//             <div className="center">
//                 <Card>
//                     <h2>No users found.</h2>
//                 </Card>
//             </div>
//         );
//     }
//     return (
//         <ul className="users-list">
//             {items.map((user) => (

//                 <UserItem
//                     key={user.id}
//                     id={user.id}
//                     image={user.image}
//                     name={user.name}
//                     placeCount={user.places.length}
//                 // placeCount={user.places}
//                 />
//             ))}
//         </ul>
//     )
// }


// Attempt 3: works so far!
// const UsersList = props => {
//     const { items = [] } = props

//     // checking whether its an array or not and have some items in it
//     if (!Array.isArray(items) || items.length === 0) {
//         return (
//             <div className="center">
//                 <Card>
//                     <h2>No users found.</h2>
//                 </Card>
//             </div>
//         );
//     }


//     return (
//         <ul className="users-list">
//             {items.map(user => {
//                 const { id = "", image = "", name = "", places = "" } = user
//                 return <UserItem
//                     key={id}
//                     id={id}
//                     image={image}
//                     name={name}
//                     // placeCount={user.places.length}
//                     placeCount={places.length}
//                 />
//             })}
//         </ul>
//     );
// };




export default UsersList;