const router=require('express').Router();

const createMailRoute =require('../create/mail');
const getUsers =require('../get/users');
const getMailBox=require('../get/mailbox')

router.use('/create',createMailRoute);
router.use('/get',getUsers);
router.use('/get',getMailBox);

module.exports=router;