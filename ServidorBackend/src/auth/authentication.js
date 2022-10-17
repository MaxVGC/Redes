const { getAuth, createUserWithEmailAndPassword } = require("firebase/auth");
const { admin, app } = require('../data/data.js');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

//Variables

const router = require('express').Router();
const auth = getAuth(app);
const db = getFirestore();

//Functions

async function insertUserDB(uuid, data) {
    const docRef = db.collection('Users').doc(uuid);
    await docRef.set(data);
}

//Endpoints

router.route('/registerUser').post((req, res) => {
    const data = req.body;
    createUserWithEmailAndPassword(auth, data.email, data.password)
        .then((userCredential) => {
            const user = userCredential.user;
            insertUserDB(user.uid, data).then(() => {
                res.json({
                    status: 'OK',
                    message: 'Insertado'
                })
                res.end();
            }).catch((error) => {
                res.status(500).json({
                    status:'ERROR',
                    code:'001',
                    message:'No se ha podido crear el usuario en la base de datos'
                })
                res.end();
            });
        })
        .catch((error) => {
            res.status(500).json({
                status:'ERROR',
                code:'002',
                message:'No se ha podido crear el usuario'
            })
            res.end();
        });
})

router.route('/loginUser').get((req, res) => {
    msg = "loginUser";
    res.json({ msg });
});


module.exports = router;