import React, { useState } from 'react';

const Navbar = () => {
    const [loggedIn, setLoggedIn] = useState(false);

    const handleLogin = () => {
        setLoggedIn(true);
    };

    const handleLogout = () => {
        setLoggedIn(false);
    };

    return (
        <nav>
            <ul>
                <li><a href="#">Register</a></li>
                <li>{loggedIn ? <a href="#" onClick={handleLogout}>Logout</a> : <a href="#" onClick={handleLogin}>Login</a>}</li>
                <li><a href="#">Petitions</a></li>
                {loggedIn && (
                    <>
                        <li><a href="#">Manage User</a></li>
                        <li><a href="#">Profile</a></li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
