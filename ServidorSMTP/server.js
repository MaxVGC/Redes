import smtp from "./classes/smtpProtocol.js";
import { createServer } from "net";
import { createInterface } from 'readline';


const server = createServer((socket) => {

    const tiempoTranscurrido = Date.now();
    const hoy = new Date(tiempoTranscurrido);
    var rl = createInterface({ input: socket });
    const protocol=new smtp(0,socket,rl);
    
    socket.write("220 Connected to Max Mail Server "+hoy.toUTCString()+" \r\n")

    rl.on('line', function (l) {
        protocol.inputCommand(l.trim());
    });

    socket.on("close", () => {
        console.log("Connection closed");
    })
    
});

server.listen(3001);