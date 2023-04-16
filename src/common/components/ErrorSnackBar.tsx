import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, {AlertProps} from '@mui/material/Alert';
import {useAppDispatch, useAppSelector} from "app/store";
import {appActions} from "app/appReducer";
import {selectError} from "app/app.selectors";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const CustomizedSnackbars = () => {
    // const [open, setOpen] = React.useState(false);
    const error = useAppSelector(selectError)
    const dispatch = useAppDispatch()

    // const handleClick = () => {
    //     if (error) {
    //         // setOpen(true);
    //     }
    // };

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        dispatch(appActions.setError({error: null}))
        // setOpen(false);
    };

    return (
        <div>
            {/* <Stack spacing={2} sx={{width: '100%'}}>*/}
            {/*<Button variant="outlined" onClick={handleClick}>*/}
            <Snackbar open={!!error} autoHideDuration={4000} onClose={handleClose}
                      anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}>
                <Alert onClose={handleClose} severity="error" sx={{width: '100%'}}>
                    {error}
                </Alert>
            </Snackbar>
            {/*            <Alert severity="error">This is an error message!</Alert>
            <Alert severity="warning">This is a warning message!</Alert>
            <Alert severity="info">This is an information message!</Alert>
            <Alert severity="success">This is a success message!</Alert>*/}
            {/*</Stack>*/}
        </div>
    );
}