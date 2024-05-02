import {useEffect, useState} from "react";
import axios from "axios";
import {Link} from "react-router-dom";
const Users = () => {
    const[users, setUsers] = useState([]);
    const[errorFlag, setErrorFlags] = useState(false);
    const[errorMessage, setErrorMessage] = useState('');
    useEffect(() => {
        getUsers()
    },[]);

    const getUsers =  () => {
        axios.get('http://localhost:3000/api/users')
            .then((response) => {
                setErrorFlags(false)
                setErrorMessage("");
                setUsers(response.data);
            })
            .catch((error) => {
                setErrorFlags(true);
                setErrorMessage(error.toString());
            })
    }

    const deleteUser = (user: { user_id: any; username?: string; }) => {
        axios.delete('http://localhost:3000/api/users/' + user.user_id)
            .then((response) => {
                // @ts-ignore
                setUsers(users.filter(u => u.user_id !== user.user_id))
            })
    }

    const list_of_users = () => {
        return users.map((item:User) =>
            <tr key={item.user_id}>
                <th scope="row">{item.user_id}</th>
                <td>{item.username}</td>
                <td><Link to={`/user/${item.user_id}`}>Go to user</Link></td>
                <td>
                    <button className="btn btn-primary" data-toggle="modal" data-target="#deleteUserModal">Delete
                    </button>
                    <div className="modal fade" id="deleteUserModal" tabIndex={-1} role="dialog"
                         aria-labelledby="deleteUserModalLabel" aria-hidden="true">
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="deleteUserModalLabel">Delete User</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    Are you sure that you want to delete this user?
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Close
                                    </button>
                                    <button type="button" className="btn btn-primary" data-dismiss="modal"
                                            onClick={() => deleteUser(item)}>Delete User
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button type="button">Edit</button>
                </td>
            </tr>
        )
    }


    if (errorFlag) {
        return <div>
            <h1>Users</h1>
            <div style={{color: "red"}}>
                {errorMessage}
            </div>
        </div>
    } else {
        return (
            <div>
                <h1>Users</h1>
                <table className="table">
                    <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">username</th>
                        <th scope="col">link</th>
                        <th scope="col">actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {list_of_users()}
                    </tbody>
                </table>
            </div>
        )
    }

}

export default Users;