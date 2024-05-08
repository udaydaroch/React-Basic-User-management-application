import { useEffect, useState} from "react";
import axios from "axios";
import {Link} from "react-router-dom";
import {
    Alert, AlertTitle,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Paper, Snackbar, Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CSS from 'csstype';


const Users = () => {
    const [users, setUsers] = useState([]);
    const [errorFlag, setErrorFlags] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [dialogUser, setDialogUser] = useState<User>({username: "", user_id: -1});
    const [usernameEdit, setUsernameEdit] = useState("");
    const [snackOpen, setSnackOpen] = useState(false)
    const [snackMessage, setSnackMessage] = useState("")
    const handleSnackClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
             return;
        }
         setSnackOpen(false);
        };

    useEffect(() => {
        getUsers();
    }, []);

    const [addUserUsername, setAddUserUsername] = useState("");

    const addUser = ()=> {
        if(addUserUsername === "") {
            alert("please enter a username")
        } else {
            axios.post("http://localhost:3000/api/users", {
                username: addUserUsername
            }).then(()=> {
                getUsers();
                setAddUserUsername("");
                setSnackMessage("Username added successfully");
                setSnackOpen(true);
            });

        }
    }
    const getUsers = () => {
        axios.get('http://localhost:3000/api/users')
            .then((response) => {
                setErrorFlags(false);
                setErrorMessage("");
                setUsers(response.data);
            })
            .catch((error) => {
                setErrorFlags(true);
                setErrorMessage(error.toString());
            })
    };

    const deleteUser = (user: { user_id: any; username?: string; }) => {
        axios.delete('http://localhost:3000/api/users/' + user.user_id)
            .then((response) => {
                // @ts-ignore
                setUsers(users.filter(u => u.user_id !== user.user_id));
                setOpenDeleteDialog(false);
                setSnackMessage("User deleted successfully");
                setSnackOpen(true);
            })
    };

    const handleDeleteDialogOpen = (user: User) => {
        setDialogUser(user);
        setOpenDeleteDialog(true);
    };

    const handleDeleteDialogClose = () => {
        setDialogUser({ username: "", user_id: -1 });
        setOpenDeleteDialog(false);
    };

    const handleEditDialogOpen = (user: User) => {
        setDialogUser(user);
        setUsernameEdit(user.username);
        setOpenEditDialog(true);
    };

    const handleEditDialogClose = () => {
        setOpenEditDialog(false);
        setUsernameEdit("");
    };

    const updateUser = () => {
        const updatedUser = { ...dialogUser, username: usernameEdit };
        axios.put(`http://localhost:3000/api/users/${updatedUser.user_id}`, updatedUser)
            .then((response) => {
                // @ts-ignore
                setUsers(users.map(u => u.user_id === updatedUser.user_id ? updatedUser : u));
                handleEditDialogClose();
                setSnackMessage("Username changed successfully");
                setSnackOpen(true);
            })
            .catch((error) => {
                console.error("Error updating user:", error);
            });
    };

    const user_rows = () => {
        return users.map((row: User) => (
            <TableRow hover tabIndex={-1} key={row.user_id}>
                <TableCell align="right">{row.user_id}</TableCell>
                <TableCell align="right">{row.username}</TableCell>
                <TableCell align="right">
                    <Link to={"/user/" + row.user_id}>Go to user</Link>
                </TableCell>
                <TableCell align="right">
                    <Button variant="outlined" endIcon={<EditIcon />} onClick={() => { handleEditDialogOpen(row) }}>
                        Edit
                    </Button>
                    <Button variant="outlined" endIcon={<DeleteIcon />} onClick={() => { handleDeleteDialogOpen(row) }}>
                        Delete
                    </Button>
                </TableCell>
            </TableRow>
        ));
    };


    interface HeadCell {
         id: string;
         label: string;
         numeric: boolean;
         }
     const headCells: readonly HeadCell[] = [
         { id: 'ID', label: 'id', numeric: true },
         { id: 'username', label: 'Username', numeric: false },
         { id: 'link', label: 'Link', numeric: false },
         { id: 'actions', label: 'Actions', numeric: false }
     ];

    const card: CSS.Properties = {
        padding: "10px",
        margin: "20px",
    };

    if (errorFlag) {
        return (
            <div>
                {errorFlag &&
                     <Alert severity="error">
                     <AlertTitle>Error</AlertTitle>
                     {errorMessage}
                    </Alert>}
            </div>

        );
    } else {

        return (
            <div>
                <Paper elevation={3} style={card}>
                    <h1>Users</h1>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {headCells.map((headCell) => (
                                        <TableCell
                                            key={headCell.id}
                                            align={headCell.numeric ? 'right' : 'left'}
                                            padding={'normal'}
                                        >
                                            {headCell.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {user_rows()}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>

                <Paper elevation={3} style={card}>
                    <h1>Add a new user</h1>
                    <Stack direction="row" spacing={2} justifyContent="center">
                        <TextField id="outlined-basic" label="Username" variant="outlined" value={addUserUsername}
                                   onChange={(event) => setAddUserUsername(event.target.value)}/>
                        <Button variant="outlined" onClick={() => { // @ts-ignore
                            addUser()
                        }}>
                            Submit
                        </Button>
                    </Stack>
                </Paper>


                <Dialog
                    open={openDeleteDialog}
                    onClose={handleDeleteDialogClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Delete User?"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Are you sure you want to delete this user?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDeleteDialogClose}>Cancel</Button>
                        <Button variant="outlined" color="error" onClick={() => {
                            deleteUser(dialogUser)
                        }} autoFocus>
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog
                    open={openEditDialog}
                    onClose={handleEditDialogClose}
                    aria-labelledby="edit-dialog-title"
                    aria-describedby="edit-dialog-description"
                >
                    <DialogTitle id="edit-dialog-title">{"Edit User"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="edit-dialog-description">
                            Update the username:
                        </DialogContentText>
                        <TextField
                            id="outlined-basic"
                            label="Username"
                            variant="outlined"
                            value={usernameEdit}
                            onChange={(e) => setUsernameEdit(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleEditDialogClose}>Cancel</Button>
                        <Button variant="outlined" color="primary" onClick={updateUser}>
                            Update
                        </Button>
                    </DialogActions>
                </Dialog>

                <Snackbar
                    autoHideDuration={6000}
                    open={snackOpen}
                    onClose={handleSnackClose}
                    key={snackMessage}
                >
                    <Alert onClose={handleSnackClose} severity="success" sx={{
                        width: '100%'
                    }}>
                        {snackMessage}
                    </Alert>
                </Snackbar>

            </div>
        );

    }
};

export default Users;
