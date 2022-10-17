const router = require('express').Router();
const { db } = require('../firebase/firebaseConfig')
const { query,where, orderBy, limit,getDocs,collection } = require("firebase/firestore");

const mailBoxRef = collection(db, "mails");

router.route('/mailbox/inbox/:email').get((req, res) => {
    const q = query(mailBoxRef, where("recipientsAccepted", "array-contains", req.params.email),orderBy("date","desc"),limit(20));
    const querySnapshot = getDocs(q);
    querySnapshot.then((response)=>{
        var mails=[]
        response.forEach((doc)=>{
            var aux=doc.data();
            mails.push({
                id:aux.id,
                name:aux.senderData.name,
                email:aux.senderData.email,
                content:aux.content,
                date:aux.date,
                subject:aux.subject,
                opened:false,
                tags:[]
            });
        })
        res.json({mails:mails})
    })
});

router.route('/mailbox/sended/:email').get((req, res) => {
    const q = query(mailBoxRef, where("senderData.email", "==", req.params.email),orderBy("date","desc"),limit(20));
    const querySnapshot = getDocs(q);
    querySnapshot.then((response)=>{
        var mails=[];
        response.forEach((doc)=>{
            var aux=doc.data();
            if(aux.recipientsAccepted.length==1){
                mails.push({
                    id:aux.id,
                    email:aux.senderData.email,
                    name:aux.recipientsAccepted[0],
                    recipients:aux.recipientsAccepted,
                    content:aux.content,
                    date:aux.date,
                    subject:aux.subject,
                    opened:false,
                    tags:[]
                });
            }else{
                mails.push({
                    id:aux.id,
                    email:aux.senderData.email,
                    name:aux.recipientsAccepted[0]+", "+(aux.recipientsAccepted.length-1)+" Mas",
                    recipients:aux.recipientsAccepted,
                    content:aux.content,
                    date:aux.date,
                    subject:aux.subject,
                    opened:false,
                    tags:[]
                });
            }
            
        })
        res.json({mails:mails})
    })
});

module.exports = router;