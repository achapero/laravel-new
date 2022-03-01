edit main .env APP_URL=http://127.0.0.1

create .env socket-server/ folder file and add = APP_ENV=local

npm install

npm start

cd ..

npm install socket.io-client

on react app create file (socketio.js)

    import io from "socket.io-client";
    export const socketio = io.connect(
        `${window.location.origin}:${
            window.location.protocol === "https:" ? "4001" : "4002"
        }`
    );

then import socketio file to the pages
    import { socketio } from "../../../../socketio";

    useEffect(() => {
        console.log("@user", userdata);
        socketio.on("message", message => {
            refetchNotif();
        });

        return () => {};
    }, []); 