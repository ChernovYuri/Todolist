import React from 'react'
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {FormikHelpers, useFormik} from "formik";
import {Navigate} from "react-router-dom";
import {selectCaptchaUrl, selectIsLoggedIn} from "features/Auth/auth.selectors";
import {authThunks} from "features/Auth/authReducer";
import {LoginParamsType} from "features/Auth/auth.api";
import {ResponseType} from "common/types/common.types";
import * as yup from 'yup'
import {useAppSelector} from "common/hooks/useAppSelector";
import {selectStatus} from "app/app.selectors";
import {useActions} from "common/hooks/useActions";
import s from "./auth.module.css"
import {todolistsThunks} from "features/TodolistsList/Todolist/todolistsReducer";


const validationSchema = yup.object().shape({
    email: yup.string().trim().required('Required').email('Invalid email address'),
    password: yup.string().trim().required('Required').min(4, 'Password must has more then 4 symbols'),
})

export const Auth = () => {
    const isLoggedIn = useAppSelector(selectIsLoggedIn)
    const captchaUrl = useAppSelector(selectCaptchaUrl)
    const appStatus = useAppSelector(selectStatus)
    const {login, getCaptcha} = useActions(authThunks)

    const formik = useFormik({
        validationSchema: validationSchema,
        initialValues: {
            email: '',
            password: '',
            rememberMe: false,
            captcha: ''
        },
        onSubmit: (values, formikHelpers: FormikHelpers<LoginParamsType>) => {
            login(values)
                .unwrap()
                .catch((reason: ResponseType) => {
                    const {fieldsErrors} = reason
                    if (fieldsErrors) {
                        reason.fieldsErrors.forEach((fieldError) => {
                            formikHelpers.setFieldError(fieldError.field, fieldError.error)
                        })
                    }
                })
        },
    });

    if (isLoggedIn) {
        return <Navigate to='/'/>
    }

    const handleFillForm = () => {
        formik.setFieldValue('email', 'free@samuraijs.com')
        formik.setFieldValue('password', 'free')
    }

    return <Grid container justifyContent={'center'}>
        <Grid item justifyContent={'center'}>
            <form onSubmit={formik.handleSubmit}>
                <FormControl>
                    {captchaUrl &&
                        <div className={s.captchaBlock}>
                            <img src={captchaUrl} alt={'Captcha'}/>
                            <TextField type='text'
                                       label="Captcha symbols"
                                       margin="normal"
                                       {...formik.getFieldProps('captcha')}
                            />
                            {formik.touched.captcha && formik.errors.captcha &&
                                <div style={{color: 'red'}}>{formik.errors.captcha}</div>}
                            <Button onClick={()=>getCaptcha({})} >Refresh captcha</Button>
                        </div>
                    }
                    <FormLabel>
                        <p>Для авторизации введите следующие данные</p>
                        <p>демонастрационного аккаунта:</p>
                            <p>Email: <span onClick={() => { handleFillForm()}}
                                        title="Нажмите, чтобы заполнить поля автоматически"
                                        className={s.freeLogin}
                                        >
                            free@samuraijs.com
                            </span></p>
                            <p>Password: <span onClick={() => { handleFillForm()}}
                                           title="Нажмите, чтобы заполнить поля автоматически"
                                           className={s.freeLogin}
                            >
                            free
                            </span></p>
                        <p>Также можно создать свой аккаунт, зарегистрировавшись здесь:</p>
                        <a href={'https://social-network.samuraijs.com/'}
                           target={'_blank'}> social-network.samuraijs.com
                        </a>
                    </FormLabel>
                    <FormGroup>
                        <TextField type='text'
                                   label="Email"
                                   margin="normal"
                                   {...formik.getFieldProps('email')}
                        />
                        {formik.touched.email && formik.errors.email &&
                            <div style={{color: 'red'}}>{formik.errors.email}</div>}

                        <TextField type="password"
                                   label="Password"
                                   margin="normal"
                                   {...formik.getFieldProps('password')}
                        />
                        {formik.touched.password && formik.errors.password &&
                            <div style={{color: 'red'}}>{formik.errors.password}</div>}
                        <FormControlLabel label={'Remember me'}
                                          control={
                                              <Checkbox checked={formik.values.rememberMe}
                                                        disabled={appStatus === 'loading'}
                                                        {...formik.getFieldProps('rememberMe')}
                                              />}/>
                        <Button type={'submit'} variant={'contained'} color={'primary'}
                                disabled={appStatus === 'loading'}>
                            Login
                        </Button>
                    </FormGroup>
                </FormControl>
            </form>
        </Grid>
    </Grid>
}