//var authDomain = "server-smtp-redes.firebaseapp.com";
//import { authDomain } from "../firebase/firebaseConfig";
//HELO server-smtp-redes.firebaseapp.com
//MAIL FROM: <carlos.andres12390@live.com>
//MAIL FROM: <carlos.andres12490@live.com>
//RCPT TO: <marlesandres1@gmail.com>
//RCPT TO: <marlesandres2@gmail.com>
//RCPT TO: <marlesandres3@gmail.com>

import { authDomain, auth, db } from "../firebase/firebaseConfig.js";
import { collection, query, where, getDocs, doc, setDoc } from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";


class smtp {
    data = {
        email: null,
        uid: null,
        socket: null
    }

    protocol = {
        helo: null,
        mail: null,
        rcpt: [],
        data: '',
        rset: null,
        noop: null,
        quit: null,
        subject: '(Sin asunto)',
        waiting: {
            password: false,
            data: false
        }
    }

    constructor(uid, socket, line) {
        this.data.uid = uid;
        this.data.socket = socket;
        this.data.line = line;
    }

    validateCommand(cmd) {
        return cmd
    }

    async sendMail() {
        const col = doc(collection(db, "mails"));
        const res = await setDoc(col, {
            sender: this.protocol.mail,
            recipients: this.protocol.rcpt,
            content: this.protocol.data,
            timestamp: Date.now(),

        });
        return res;
    }

    async isUserExist(email) {
        var aux = email.substring(1, email.length - 1);
        const q = query(collection(db, "users"), where("email", "==", aux));
        const res = await getDocs(q);
        return res;
    }

    inputCommand(cmd) {
        var parts = cmd.split(" ");
        if (this.protocol.waiting.password) {
            this.data.socket.write("Please wait a moment... ");
            signInWithEmailAndPassword(auth, this.protocol.mail, cmd)
                .then(() => {
                    this.data.socket.write("250 Sender ok.\r\n");
                    this.protocol.waiting.password = false;
                })
                .catch(() => {
                    this.protocol.mail = null;
                    this.protocol.waiting.password = false;
                    this.data.socket.write("550 Password incorrect.\r\n")
                });
        } else if (this.protocol.waiting.data) {
            if (cmd.toUpperCase().split(':')[0] == "SUBJECT") {
                cmd.split(':')[1] != "" ? (this.protocol.subject = cmd.split(':')[1]) : (null);
            } else if (cmd != '.') {
                this.protocol.data = this.protocol.data + " " + cmd;
            } else {
                this.protocol.waiting.data = false;
                this.data.socket.write("Please wait a moment... ");
                this.sendMail().then((e) => {
                    console.log(e)
                    this.data.socket.write("250 Message accepted for delivery.\r\n")
                }).catch(() => {
                    this.data.socket.write("554 Transaction failed.\r\n")
                })
                this.protocol = {
                    helo: null,
                    mail: null,
                    rcpt: [],
                    data: '',
                    rset: null,
                    noop: null,
                    quit: null,
                    subject: '(Sin asunto)',
                    waiting: {
                        password: false,
                        data: false
                    }
                }
            }
        } else {
            switch (parts[0].toUpperCase()) {
                case "HELO":
                    if (parts.length == 1 || parts.length >= 3) {
                        this.data.socket.write("501 Syntax error in parameters or arguments.\r\n");
                    } else if (this.protocol.helo != null) {
                        this.data.socket.write("550 User already identified, for a new transaction use the command RSET.\r\n")
                    } else {
                        if (parts[1] === authDomain) {
                            this.protocol.helo = authDomain;
                            this.data.socket.write("250 Max Mail Server Hello, pleased to meet you.\r\n");
                        } else {
                            this.data.socket.write("550 Domain name not recognized.\r\n")
                        }
                    }
                    break;
                case "MAIL":
                    if (this.protocol.helo == null) {
                        this.data.socket.write("503(Bad sequence of commands) Please use the command HELO first.\r\n")
                    } else if (parts.length == 1 || parts.length >= 4) {
                        this.data.socket.write("501 Syntax error in parameters or arguments.\r\n");
                    } else if (this.protocol.mail != null) {
                        this.data.socket.write("550 User already connected, for a new transaction use the command RSET.\r\n")
                    } else {
                        this.data.socket.write("Please wait a moment... ");
                        this.isUserExist(parts[2]).then((res) => {
                            if (res.empty) {
                                this.data.socket.write("550 User does not exist.\r\n")
                            } else {
                                this.data.socket.write("250 Input password for " + parts[2] + ".\r\n");
                                this.protocol.mail = parts[2].substring(1, parts[2].length - 1);
                                this.protocol.waiting.password = true;
                            }
                        });
                    }
                    break;
                case "RCPT":
                    if (this.protocol.helo == null || this.protocol.mail == null) {
                        this.data.socket.write("503(Bad sequence of commands) Please authenticate first.\r\n")
                    } else if (parts.length == 1 || parts.length >= 4) {
                        this.data.socket.write("501 Syntax error in parameters or arguments.\r\n");
                    } else {
                        const found = this.protocol.rcpt.find(element => element == parts[2].substring(1, parts[2].length - 1));
                        if (found == undefined) {
                            this.data.socket.write("Please wait a moment... ");
                            this.isUserExist(parts[2]).then((res) => {
                                if (res.empty) {
                                    this.data.socket.write("550 User does not exist.\r\n")
                                } else {
                                    this.protocol.rcpt.push(parts[2].substring(1, parts[2].length - 1));
                                    this.data.socket.write("250 Recipient added.\r\n");
                                }
                            });
                        } else {
                            this.data.socket.write("550 User alredy added.\r\n")
                        }
                    }
                    break;
                case "DATA":
                    if (this.protocol.helo == null || this.protocol.mail == null || this.protocol.rcpt.length == 0) {
                        this.data.socket.write("503(Bad sequence of commands) Please add a recipient first.\r\n")
                    } else if (parts.length >= 2) {
                        this.data.socket.write("501 Syntax error in parameters or arguments.\r\n");
                    } else {
                        this.data.socket.write("354 Enter mail, end with '.' on a line by itself.\r\n")
                        this.protocol.waiting.data = true;
                    }
                    break;
                case "VERIFY":
                    console.log(this.protocol);
                    break;
                case "RSET":
                    this.protocol = {
                        helo: null,
                        mail: null,
                        rcpt: [],
                        data: '',
                        rset: null,
                        noop: null,
                        quit: null,
                        subject: '(Sin asunto)',
                        waiting: {
                            password: false,
                            data: false
                        }
                    }
                    break;
                case "QUIT":
                    console.log(this.validateCommand(cmd));
                    this.data.socket.write("221 Max Mail Server closing connection.\r\n");
                    this.data.socket.end();
                    break;
                default:
                    this.data.socket.write("500 Syntax error, command unrecognized.\r\n")
                    break;
            }
        }
        return
    }
}

export default smtp;