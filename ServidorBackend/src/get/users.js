const router = require('express').Router();
const { db } = require('../firebase/firebaseConfig')
const { doc, getDocs,query,where , setDoc,collection } = require("firebase/firestore");

const usersRef = collection(db, "users");


router.route('/validateUser/:email').get((req, res) => {
    const q = query(usersRef, where("email", "==", req.params.email));
    const querySnapshot = getDocs(q);
    querySnapshot.then((response)=>{
        if(response.size!=0){
            res.json({code:200,isUserExist:true})
        }else{
            res.json({code:200,isUserExist:false})
        }
    })
});

module.exports = router;