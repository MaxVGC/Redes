const { db } = require('../firebase/firebaseConfig')
const router = require('express').Router();
const { doc, getDoc, setDoc,collection } = require("firebase/firestore");

async function setDataMail(id,data){
    await setDoc(doc(db, "mails", id), data);
}

router.route('/mail').post((req, res) => {
    const ref = doc(collection(db, "mails"));
    const date=Date.now();
    const data={...req.body,date:date,id:ref.id};
    setDataMail(ref.id,data).then(()=>{
        res.json({code:'200'})
    })
});

module.exports = router;