import React, { useEffect, useState } from 'react'

export default function RecipientComponent({ data, index, state, setData }) {

    const [iconState, setIconState] = useState(2);

    function removeRecipient() {
        const recipients = state.recipients.filter((item) => item !== data)
        const recipientsA = state.recipientsAccepted.filter((item) => item !== data)
        setData({ ...state, recipients: recipients, recipientsAccepted: recipientsA });
    }

    async function checkUserExist() {
        const response = await fetch("http://localhost:3001/get/ValidateUser/" + data)
        return response.json();
    }

    useEffect(() => {
        if (index == 1) {
            setIconState(3);
        } else {
            checkUserExist().then((res) => {
                if (res.isUserExist) {
                    setIconState(1);
                    var aux = state.recipientsAccepted;
                    aux.push(data);
                    setData({ ...state, recipientsAccepted: aux })
                } else {
                    setIconState(0);
                }
            })
        }

    }, [])

    return (
        <div className='recipientComponent'>
            {index == 1 ? (
                <>
                    <div className={'icon letter'} >
                        <span>{data.substring(0, 1).toUpperCase()}</span>
                    </div>
                    <span>{data}</span>
                </>
            ) : (
                <>
                    <div className={iconState == 0 ? ('icon invalid') : (iconState == 1) ? ('icon valid') : ('icon waiting')} onClick={() => (removeRecipient())}>
                        {iconState == 2 && <ion-icon class="main" name="time-outline"></ion-icon>}
                        {iconState == 1 && <ion-icon class="main" name="checkmark-outline"></ion-icon>}
                        {iconState == 0 && <ion-icon class="main" name="close-outline"></ion-icon>}
                        <ion-icon class="close" name="close-outline"></ion-icon>
                    </div>
                    <span>{data}</span>
                </>
            )}

        </div>
    )
}
