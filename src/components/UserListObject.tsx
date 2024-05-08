import React, {useState} from "react";
import axios from "axios";
import { Delete, Edit } from "@mui/icons-material";
import { useUserStore } from "../store";
import {
    Button, Card, CardActions, CardContent, CardMedia, Dialog,
    DialogActions, DialogContent, DialogContentText,
    DialogTitle, IconButton, TextField, Typography
} from "@mui/material";
import CSS from 'csstype';

interface IUserProps {
    user: User
}

const UserListObject = (props: IUserProps) => {
    const [user] = useState<User>(props.user)
    const [username, setUsername] = useState("")
    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false)
    const [openEditDialog, setOpenEditDialog] = React.useState(false)
    const deleteUserFromStore = useUserStore(state => state.removeUser)
    const editUserFromStore = useUserStore(state => state.editUser)
    const handleDeleteDialogClose = () => {
        setOpenDeleteDialog(false);
    };
    const handleEditDialogClose = () => {
        setOpenEditDialog(false);
    };

    const deleteUser = () => {
        axios.delete('http://localhost:3000/api/users/' + user.user_id)
            .then(() => {
                deleteUserFromStore(user)

            })
    }

    const editUser = () => {
        axios.put('http://localhost:3000/api/users/'+user.user_id, {"username": username})
            .then(() => {
                editUserFromStore(user, username)
            })
    }
    const userCardStyles: CSS.Properties = {
        display: "inline-block",
        height: "328px",
        width: "300px",
        margin: "10px",
        padding: "0px"
    }

    return (
        <Card sx={userCardStyles}>
            <CardMedia
                component="img"
                height="200"
                width="200"
                sx={{ objectFit: "cover" }}
                image="https://png.pngitem.com/pimgs/s/150-1503945_transparent-user-png-default-user-image-png-png.png"
                alt="Auction hero"
            />
            <CardContent>
                <Typography variant="h4">
                    {user.user_id} {user.username}
                </Typography>
            </CardContent>
            <CardActions>
                <IconButton onClick={() => { setOpenEditDialog(true) }}>
                    <Edit />
                </IconButton>
                <IconButton onClick={() => { setOpenDeleteDialog(true) }}>
                    <Delete />
                </IconButton>
            </CardActions>
            <Dialog open={openDeleteDialog} onClose={handleDeleteDialogClose}>
                <DialogTitle>Delete User</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this user?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteDialogClose}>Cancel</Button>
                    <Button onClick={deleteUser}>Delete</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openEditDialog} onClose={handleEditDialogClose}>
                <DialogTitle>Edit User</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Username"
                        type="text"
                        fullWidth
                        onChange={(event) => setUsername(event.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditDialogClose}>Cancel</Button>
                    <Button onClick={editUser}>Edit</Button>
                </DialogActions>
            </Dialog>

        </Card>
    )
}

export default UserListObject
