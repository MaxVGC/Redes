import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import examplesMails from './examplesObjects';
import MailBoxComponent from './MailBoxComponent';
import CreateMailComponent from './CreateMailComponent';
import RecipientComponent from './RecipientComponent';

function timeConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    var time = date + '/' + month + '/' + year + ' ' + hour;
    return time
}

export default function Mail() {
    const userStore = useSelector(store => store.user);
    const mailStore = useSelector(store => store.mail);
    const [plusWindow, setVisiblePlusWindow] = useState(false);
    const [mailBox, setMailBox] = useState({ current: 'inbox', name: 'Bandeja de entrada' });

    const dispatch = useDispatch();

    const setCurrentMailbox = (mailx) => {
        dispatch({
            type: "SET_BOX",
            payload: mailx
        })
    }
    const setCurrentBox = (mailx) => {
        dispatch({
            type: "SET_CURRENT_BOX",
            payload: mailx
        })
    }
    const setCreatingMail = (mailx) => {
        dispatch({
            type: "SET_CREATING_MAIL",
            payload: mailx
        })
    }

    const logOutStore = () => {
        dispatch({
            type: "LOGOUT_USER"
        })
        dispatch({
            type: "SET_CURRENT_NULL"
        })
    }

    useEffect(() => {
        fetch('http://localhost:3001/get/mailbox/inbox/' + userStore.email).then((response) => response.json()).then((data) => {
            setCurrentBox({ box: "inbox", currentMailBox: data.mails });
            setCurrentMailbox({ box: "inbox", mails: data.mails });
        })
    }, []);

    useEffect(() => {
        var aux = null;
        if (mailStore.currentBox == "inbox") {
            if (mailStore.inbox == null) {
                aux = "inbox"
            } else {
                setCurrentBox({ box: "inbox", currentMailBox: mailStore.inbox });
            }
        }
        if (mailStore.currentBox == "outbox") {
            if (mailStore.inbox == null) {
                aux = "outbox"
            } else {
                setCurrentBox({ box: "outbox", currentMailBox: mailStore.outbox });
            }
        }
        if (mailStore.currentBox == "sended") {
            if (mailStore.sended == null) {
                aux = "sended"
            } else {
                setCurrentBox({ box: "sended", currentMailBox: mailStore.sended });
            }
        }
        if (aux != null) {
            fetch('http://localhost:3001/get/mailbox/' + aux + '/' + userStore.email).then((response) => response.json()).then((data) => {
                setCurrentBox({ box: aux, currentMailBox: data.mails });
                setCurrentMailbox({ box: aux, mails: data.mails });
            })
        }
    }, [mailBox]);

    return (
        <>
            <div class="container-fluid mail_screen">
                <div className="row">
                    <div className="col-md-2 sideBar">
                        <div className="row logo">
                            <img src="./img/ShutUpV3.png" alt="logo" />
                            <span>Max Mail</span>
                        </div>
                        <div className="row createMail">
                            <div className="buttonCreateMail" onClick={() => (setCreatingMail(true))}>
                                <ion-icon name="add-outline"></ion-icon>
                                <span>Nuevo correo</span>
                            </div>
                        </div>
                        <div className="row listMailBox">
                            <ul>
                                <li className={mailBox.current == "inbox" ? ('active') : ('')} onClick={() => (mailBox.current == "inbox" ? (null) : (setMailBox({ current: 'inbox', name: 'Bandeja de entrada' }), setCurrentBox({ box: "inbox", currentMailBox: mailStore.currentMailBox })))}>
                                    {mailBox.current == "inbox" ? (
                                        <>
                                            <ion-icon name="mail"></ion-icon>
                                        </>
                                    ) : (
                                        <>
                                            <ion-icon name="mail-outline"></ion-icon>
                                        </>
                                    )}
                                    <span>Bandeja de entrada</span>
                                </li>
                                {/* <li className={mailBox.current == "outbox" ? ('active') : ('')} onClick={() => (mailBox.current == "outbox" ? (null) : (setMailBox({ current: 'outbox', name: 'Bandeja de salida' }), setCurrentBox({ box: "outbox", currentMailBox: mailStore.currentMailBox })))}>
                                    {mailBox.current == "outbox" ? (
                                        <>
                                            <ion-icon name="file-tray-full"></ion-icon>
                                        </>
                                    ) : (
                                        <>
                                            <ion-icon name="file-tray-full-outline"></ion-icon>
                                        </>
                                    )}
                                    <span>Bandeja de salida</span>
                                </li> */}
                                <li className={mailBox.current == "sended" ? ('active') : ('')} onClick={() => (mailBox.current == "sended" ? (null) : (setMailBox({ current: 'sended', name: 'Enviados' }), setCurrentBox({ box: "sended", currentMailBox: mailStore.currentMailBox })))}>
                                    {mailBox.current == "sended" ? (
                                        <>
                                            <ion-icon name="paper-plane"></ion-icon>
                                        </>
                                    ) : (
                                        <>
                                            <ion-icon name="paper-plane-outline"></ion-icon>
                                        </>
                                    )}
                                    <span>Enviados</span>
                                </li>
                            </ul>
                        </div>
                        <div className="row userComponent">
                            <div className="icon">
                                {userStore.name.substring(0, 1).toUpperCase()}
                            </div>
                            <div className="dataUser">
                                <div className="name">
                                    <span style={{ textTransform: "capitalize" }}>{userStore.name}</span>
                                </div>
                                <div className="email">
                                    <span style={{ opacity: "0.5" }}>{userStore.email}</span>
                                </div>
                            </div>
                            <div className="plus">
                                <ion-icon name="ellipsis-vertical" onClick={() => (setVisiblePlusWindow(!plusWindow))}></ion-icon>
                            </div>
                            {plusWindow ? (
                                <div className="plusWindow">
                                    <div className="logOut" onClick={logOutStore}>
                                        <ion-icon name="exit-outline"></ion-icon>
                                        <span>Cerrar sesion</span>
                                    </div>
                                </div>
                            ) : ('')}
                        </div>
                    </div>
                    <div className="col-md-3 mailBox">
                        <div className="row header">
                            <span>
                                {mailBox.name}<br />
                                <span>
                                    {mailStore?.currentBox == "sended" ? (
                                        '' + mailStore?.currentMailBox?.length + " Mensaje(s)"
                                    ) : (
                                        '' + mailStore?.currentMailBox?.length + " Mensajes, " + mailStore?.currentMailBox?.filter(mail => mail.opened === false).length + " No leidos" + ''
                                    )}
                                </span>
                            </span>
                        </div>
                        <div className="row searchInput">
                            <ion-icon name="search"></ion-icon>
                            <input className='input-custom' type="text" placeholder='Buscar en el correo' />
                        </div>
                        <div className="row separator"></div>
                        <div className="row mails">
                            {
                                mailStore?.currentMailBox?.map((element, key) => (
                                    <MailBoxComponent key={key} data={element} index={key} />
                                ))
                            }
                        </div>
                    </div>
                    <div className={mailStore?.current == null ? mailStore?.isCreating ? ('col-md-7 mailView') : ('col-md-7 mailView active') : ('col-md-7 mailView')}>
                        {mailStore?.current != null ?
                            (
                                <>
                                    <div className="row header">
                                        <div className="arrows">
                                            {/* <ion-icon name="chevron-up-outline"></ion-icon>
                                            <ion-icon name="chevron-down-outline"></ion-icon> */}
                                        </div>
                                        <div className="buttons">
                                            <ion-icon name="close-outline" onClick={() => (setCreatingMail(false))}></ion-icon>
                                        </div>
                                    </div>
                                    <div className="row mailContentContainer">
                                        <div className="subject">
                                            {mailStore.current.subject}
                                        </div>
                                        {mailStore.currentBox != "sended" ? (
                                            <div className="senderData">
                                                <div className="image">
                                                    <div className="letter">
                                                        <span>{mailStore.current.name.substring(0, 1).toUpperCase()}</span>
                                                    </div>
                                                </div>
                                                <div className="data">
                                                    <div className="name">
                                                        <span style={{ textTransform: "capitalize" }}>{mailStore.current.name}</span>
                                                        <span className='email'>{"<" + mailStore.current.email + ">"}</span>
                                                    </div>
                                                    <div className="date">
                                                        <span>{timeConverter(mailStore.current.date)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className='recipients' style={{ marginBottom: "24px", padding: "0" }}>
                                                {mailStore.current.recipients.map((element, key) => (
                                                    <RecipientComponent key={key} data={element} index={1} />
                                                ))}
                                            </div>
                                        )}
                                        <div className="content">
                                            <span>{mailStore.current.content}</span>
                                        </div>
                                    </div>
                                </>
                            ) : mailStore?.isCreating ?
                                (<CreateMailComponent />)
                                : ('')
                        }
                    </div>
                </div>
            </div>
        </>
    )
}
