import React, { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { auth, db } from '../firebase/firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";


export default function Home() {

    const [mode, setMode] = useState("login");
    const [data, setData] = React.useState({
        name: null,
        email: null,
        password: null,
    });
    const [error, setError] = useState({
        email: null,
        name: null,
        password: null
    })
    const login = useRef(null);
    const bigPhoto = useRef(null);
    const register = useRef(null);
    const dispatch = useDispatch();
    const dispatchAction = (dataUser) => {
        dispatch({
            type: "LOGIN_USER",
            payload: dataUser
        })
    }

    async function addUserDb(id) {
        await setDoc(doc(db, "users", id), { ...data, email: data.email + "@maxmail.com" });
    }

    async function getUserDb(id) {
        const docRef = doc(db, "users", id);
        const docSnap = await getDoc(docRef);
        return docSnap.data();
    }

    function changeMode() {
        if (mode == "login") {
            login.current.style.left = "-24vw";
            bigPhoto.current.style.left = "-24vw";
            bigPhoto.current.style.borderRadius = "0px 48px 48px 0px";
            register.current.style.right = "0";
        }
        if (mode == "register") {
            login.current.style.left = "0";
            bigPhoto.current.style.left = "0";
            bigPhoto.current.style.borderRadius = "48px 0 0 48px ";
            register.current.style.right = "-24vw";
        }
        setTimeout(function () {
            if (mode == "login") {
                setMode("register");
            } else {
                setMode("login");
            }
        }, 500);

    }

    function eraseArroba(event) {
        const str = /[^a-zA-Z0-9.]/g;
        if (str.test(event.target.value)) {
            event.target.value = event.target.value.substring(0, event.target.value.length - 1);
        }
        setData({ ...data, email: event.target.value })
    }

    function checkData() {
        var aux = true;
        if (mode == "register") {
            if (data.name == null || data.name.length == 0) {
                aux = false;
                setError({ ...error, fullname: 'empty' })
            }
        }
        if (data.email == null || data.email.length == 0) {
            aux = false;
            setError({ ...error, email: 'empty' })
        }
        if (data.password == null || data.password.length == 0 || data.password.length < 8) {
            aux = false;
            setError({ ...error, password: 'invalid' })
        }
        if (aux && mode == "register") {
            console.log("entre a register")
            createUserWithEmailAndPassword(auth, data.email + '@maxmail.com', data.password)
                .then((userCredential) => {
                    console.log("me registro")
                    const user = userCredential.user;
                    addUserDb(user.uid);
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.log(error)
                });
        }
        if (aux && mode == "login") {
            signInWithEmailAndPassword(auth, data.email+ '@maxmail.com', data.password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    getUserDb(user.uid).then((userData) => {
                        dispatchAction({ ...user, ...userData });
                    })
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.log(error)
                });
        }
    }

    useEffect(() => {
        if (mode == "login") {
            setData({ ...data, email: document.getElementsByName("emailL")[0].value, password: document.getElementsByName("passwordL")[0].value })
        } else {
            setData({ name: document.getElementsByName("fullnameR1")[0].value, email: document.getElementsByName("emailR1")[0].value, password: document.getElementsByName("passwordR1")[0].value })
        }
    }, [mode]);

    return (
        <>
            <div class="container-fluid">
                <div className="row content_home">
                    {mode == "login" ? (
                        <>
                            <div className="sidebar" ref={login}>
                                <div className="row header">
                                    <img src="./img/ShutUpV3.png" alt="logo" />
                                    <span>Max mail</span>
                                </div>
                                <div className="row form">
                                    <div className="message">
                                        <span>Bienvenido de vuelta</span>
                                    </div>
                                    <div className="inputs">
                                        <span>Correo electronico</span>
                                        <div className="containerMail">
                                            <input className='input-custom' autoComplete="off" onChange={(e)=>{setData({ ...data, email: e.target.value }); eraseArroba(e);}} type="text" name="emailL" id="email" />
                                            <span class='labelMail' >@maxmail.com</span>
                                        </div>
                                        <span>Contraseña</span>
                                        <input className='input-custom' onChange={e => setData({ ...data, password: e.target.value })} type="password" name="passwordL" id="password" />
                                    </div>
                                    <div className="footer">
                                        <button className='btn-grad' onClick={checkData}>Inicia sesion</button>
                                        <span>¿No tienes una cuenta?<span onClick={changeMode}> Registrate</span></span>
                                    </div>
                                </div>
                            </div>
                            <div className="div_big_image" ref={bigPhoto}>
                            </div>
                            <div className="register" ref={register}>
                                <div className="row header active">
                                    <span>Max mail</span>
                                    <img src="./img/ShutUpV3.png" alt="logo" />
                                </div>
                                <div className="row form">
                                    <div className="message">
                                        <span>¡Registrate ahora!</span>
                                    </div>
                                    <div className="inputs">
                                        <span>Nombre completo</span>
                                        <input className='input-custom' onChange={e => setData({ ...data, password: e.target.value })} type="text" name="fullnameR" id="fullname" />
                                        <span>Correo electronico</span>
                                        <div className="containerMail">
                                            <input className='input-custom' autoComplete="off" onChange={(e)=>{setData({ ...data, email: e.target.value }); eraseArroba(e);}} type="text" name="emailR1" id="email" />
                                            <span class='labelMail' >@maxmail.com</span>
                                        </div>
                                        <span>Contraseña</span>
                                        <input className='input-custom' onChange={e => setData({ ...data, password: e.target.value })} type="password" name="passwordR" id="password" />
                                    </div>
                                    <div className="footer">
                                        <button className='btn-grad' >Registrate</button>
                                        <span >¿Ya tienes una cuenta?<span > Inicia sesion</span></span>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="sidebar active" ref={login}>
                                <div className="row header">
                                    <img src="./img/ShutUpV3.png" alt="logo" />
                                    <span>Max mail</span>
                                </div>
                                <div className="row form">
                                    <div className="message">
                                        <span>Bienvenido de vuelta</span>
                                    </div>
                                    <div className="inputs">
                                        <span>Correo electronico</span>
                                        <div className="containerMail">
                                            <input className='input-custom'  autoComplete="off" onChange={(e)=>{setData({ ...data, email: e.target.value }); eraseArroba(e);}} type="text" name="emailL" id="email" />
                                            <span class='labelMail' >@maxmail.com</span>
                                        </div>
                                        <span>Contraseña</span>
                                        <input className='input-custom' onChange={e => setData({ ...data, password: e.target.value })} type="password" name="passwordL1" id="password" />
                                    </div>
                                    <div className="footer">
                                        <button className='btn-grad' >Inicia sesion</button>
                                        <span>¿No tienes una cuenta?<span > Registrate</span></span>
                                    </div>
                                </div>
                            </div>
                            <div className="div_big_image active" ref={bigPhoto}>
                            </div>
                            <div className="register active" ref={register}>
                                <div className="row header active">
                                    <span>Max mail</span>
                                    <img src="./img/ShutUpV3.png" alt="logo" />
                                </div>
                                <div className="row form">
                                    <div className="message">
                                        <span>¡Registrate ahora!</span>
                                    </div>
                                    <div className="inputs">
                                        <span>Nombre completo</span>
                                        <input className='input-custom' onChange={e => setData({ ...data, name: e.target.value })} type="text" name="fullnameR1" id="fullname" />
                                        <span>Correo electronico</span>
                                        <div className="containerMail">
                                            <input className='input-custom' autoComplete="off" onChange={(e)=>{setData({ ...data, email: e.target.value }); eraseArroba(e);}} type="text" name="emailR1" id="email" />
                                            <span class='labelMail' >@maxmail.com</span>
                                        </div>
                                        <span>Contraseña</span>
                                        <input className='input-custom' onChange={e => setData({ ...data, password: e.target.value })} type="password" name="passwordR1" id="password" />
                                    </div>
                                    <div className="footer">
                                        <button className='btn-grad' onClick={checkData}>Registrate</button>
                                        <span >¿Ya tienes una cuenta?<span onClick={changeMode}> Inicia sesion</span></span>
                                    </div>
                                </div>
                            </div>

                        </>
                    )}

                </div>
            </div>
        </>
    )
}
