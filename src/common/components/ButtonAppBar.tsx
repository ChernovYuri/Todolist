import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import {useAppSelector} from "common/hooks/useAppSelector";
import {selectIsLoggedIn} from "features/Auth/auth.selectors";
import {useNavigate} from "react-router-dom";
import {authThunks} from "features/Auth/authReducer";
import {useActions} from "common/hooks/useActions";

export const ButtonAppBar = () => {
    const isLoggedIn = useAppSelector(selectIsLoggedIn)
    const navigate = useNavigate();
    const {logout} = useActions(authThunks)

    const logOutHandler = () => {
        logout({})
    }

    return (
        <Box sx={{flexGrow: 1}}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{mr: 2}}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                        <span style={{cursor: 'pointer'}} onClick={()=>{navigate('/')}}>TODOLIST</span>
                    </Typography>
                    {isLoggedIn && <Button color="inherit" onClick={logOutHandler}>Log out</Button>}
                </Toolbar>
            </AppBar>
        </Box>
    );
}