import React, { useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { io } from "socket.io-client";

import "./App.css";

const ControlsWrapper = ({ socket }) => {
    const controlsRef = useRef();
    const [updateCallback, setUpdateCallback] = useState(null);

    // Register the update event and clean up
    useEffect(() => {

        const onControlsChange = val => {
            const { position, rotation } = val.target.object;
            const { id } = socket;
            socket.emit('move', {
                id,
                rotation,
                position
            });
        };

        if (controlsRef.current) {
            setUpdateCallback(controlsRef.current.addEventListener('change', onControlsChange));
        }

        // Dispose
        return () => {
            if (updateCallback && controlsRef.current) controlsRef.current.removeEventListener('change', onControlsChange);
        }
    }, [controlsRef, socket]);

    return (<OrbitControls ref={controlsRef} />)
}

function App() {
    const [socketClient, setSocketClient] = useState(null);

    useEffect(() => {
        // On mount initialize the socket connection
        setSocketClient(io());

        // Dispose gracefuly
        return () => { if (socketClient) socketClient.disconnect(); }
    }, []);

    useEffect(() => {
        if (socketClient) {
            socketClient.on('introduction', (id, clientCount, clientIds) => {
                console.log(clientCount);
            })
        }
    }, [socketClient]);

    return (socketClient &&
        <Canvas camera={{ position: [0, 1, -5], near: 0.1, far: 1000 }}>
            <ControlsWrapper socket={socketClient} />
            <gridHelper rotation={[0, 0, 0]} />
        </Canvas>
    );
}

export default App;