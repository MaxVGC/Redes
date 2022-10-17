import React, { useEffect, useRef, useState } from 'react'
import RecipientComponent from './RecipientComponent';
import { useDispatch, useSelector } from 'react-redux'

export default function CreateMailComponent() {
    const [data, setData] = useState({
        subject: null,
        recipients: [],
        content: '',
        recipientsAccepted: []
    });

    const refRecipients = useRef();
    const userStore = useSelector(store => store.user);

    const dispatch = useDispatch();

    const setCreatingMail = (mailx) => {
        dispatch({
            type: "SET_CREATING_MAIL",
            payload: mailx
        })
    }

    function addRecipient(event) {
        if (event.key === 'Enter' && userStore.email!=(event.target.value+'@maxmail.com')) {
            var aux = data.recipients;
            aux.push(event.target.value + "@maxmail.com");
            setData({ ...data, recipients: aux })
            event.target.value = '';
        }

    }

    function checkText(event) {
        const str = /[^a-zA-Z0-9.]/g;
        if (str.test(event.target.value)) {
            event.target.value = event.target.value.substring(0, event.target.value.length - 1);
        }
    }

    function checkData() {
        var subject = null;
        var flag = true;
        if (data.subject == null) {
            subject = "(Sin asunto)"
        }
        if (data.recipientsAccepted.length == 0 || data.content.length == 0) {
            flag = false;
        }
        if (flag) {
            sendMail().then(() => {
                console.log("sus")
            });
        }
    }

    async function sendMail() {
        const response = await fetch("http://localhost:3001/create/mail", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                subject: data.subject,
                recipientsAccepted: data.recipientsAccepted,
                content: data.content,
                senderData:{
                    id:userStore.uid,
                    email:userStore.email,
                    name:userStore.name
                }
            })
        });
        return response
    }

    useEffect(() => {
        if (data.recipients.length != 0) {
            refRecipients.current.style.marginTop = "12px";
            refRecipients.current.style.paddingBottom = "12px";
        } else {
            refRecipients.current.style.marginTop = "0px";
            refRecipients.current.style.paddingBottom = "0px";
        }
    });


    return (
        <>
            <div className="sendBtn" onClick={() => (checkData())}>
                <ion-icon name="paper-plane" ></ion-icon>
            </div>
            <div className="row closeBtn">
                <span>Nuevo correo</span>
                <ion-icon name="close-outline" onClick={() => (setCreatingMail(false))}></ion-icon>
            </div>
            <div className="row subjectCreateMail">
                <input type="text" placeholder='(Sin titulo)' onChange={(e) => { setData({ ...data, subject: e.target.value }) }} />
            </div>
            <div className="row recipientCreateMail"  >
                <span>Para: </span>
                <input type="text" onChange={checkText} onKeyPress={addRecipient} />
                <span>@maxmail.com</span>
                <div className="recipients" ref={refRecipients}>
                    {data.recipients?.map((element, key) => (
                        <RecipientComponent key={key} data={element} state={data} setData={setData} />
                    ))}
                </div>
            </div>
            <div className="row textAreaMail">
                <textarea name="content" placeholder='Escribe aqui tu mensaje...' cols="30" rows="10" onChange={e => setData({ ...data, content: e.target.value })}></textarea>
            </div>
        </>
    )
}
