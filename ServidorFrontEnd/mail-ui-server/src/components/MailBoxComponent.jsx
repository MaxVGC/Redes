import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

export default function MailBoxComponent({ data, index }) {
    const mail = useSelector(store => store.mail);

    const dispatch = useDispatch();
    const setMailCurrent = (mailx) => {
        dispatch({
            type: "SET_CURRENT",
            payload: mailx
        })
    }

    var a = new Date(data.date);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var time = a.getDate() + ' ' + months[a.getMonth()];

    return (
        <div className={mail.current?.id == data.id ? ('mailCard active') : ('mailCard')} onClick={() => (setMailCurrent({ ...data, index: index }))}>
            <div className="img">
                <span>{data.name.substring(0, 1).toUpperCase()}</span>
                {/* <img src="./img/avatar.jpg" alt="Profile photo" /> */}
            </div>
            <div className="content">
                <div className="name">
                    <span>{data.name}</span>
                </div>
                <div className="subject">
                    <span>{"> " + data.subject}</span>
                </div>
                <div className="previous">
                    <span>{data.content}</span>
                </div>
            </div>
            <div className="date">
                <span>{time}</span>
                {!mail.currentMailBox[index]?.opened ? (<div className="notification"></div>) : ('')}
            </div>
        </div>
    )
}
