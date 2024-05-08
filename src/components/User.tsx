
import {Link, useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
const User = () => {

    const {id} = useParams();
    const navigate = useNavigate()
    const [user, setUser] = useState<User>({user_id:0, username:""});
    const [errorFlag, setErrorFlag] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const deleteUser = (user: User) => {
        axios.delete("http://localhost:3000/api/users/" + user.user_id)
            .then((response) => {
                navigate("/users");
            }, (error) => {
                setErrorFlag(true);
                setErrorMessage(error.toString());
            })

    }
    useEffect(() => {
        const getUser = () => {
            axios.get("http://localhost:3000/api/users/" + id)
                .then((response) => {
                    setErrorFlag(false);
                    setErrorMessage("");
                    setUser(response.data);
                }, (error) => {
                    setErrorFlag(true);
                    setErrorMessage(error.toString());
                })
        }
        getUser();
    }, [id]);


    if (errorFlag) {
        return ( <div>
            <h1>User</h1>
            <div style={{color: "red"}}>
                {errorMessage}
            </div>
            <Link to={"/users/"}>Back to users</Link>
        </div>
        )
    } else {
        return (
            <div>
                <h1>User</h1>
                {user.user_id} : {user.username}
                <Link to={"/users"}>Back to users</Link>
                <button type={"button"}>
                    Edit
                </button>
                <button type={"button"} className="btn btn-primary" data-toggle="modal" data-target="#deleteUserModal">Delete</button>
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
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-primary" data-dismiss="modal"
                                        onClick={() => deleteUser(user)}>Delete User
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}

export default User;