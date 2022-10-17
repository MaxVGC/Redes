import React, { useState } from "react";
import Mail from "./components/Mail";
import Home from "./components/Home";
import {  useSelector } from 'react-redux'  


export default function App(props) {
    const user = useSelector(store => store.user);

    return (
        <>
            {
                user!=null ? (
                    <Mail />
                ) : (
                    <Home />
                )
            }

        </>
    )
}
