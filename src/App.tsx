import React, { useState, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { FirstPersonControls } from '@react-three/drei'
import { io } from "socket.io-client";
import './App.css';

function App() {
    const [socketClient, setSocketClient] = useState(null);

    // On mount initialize the socket connection
    useEffect(() => {
        setSocketClient(io());
    }, []);

    return (socketClient &&
        <Canvas camera={{ position: [0, 1, -5], near: 0.1, far: 1000 }}>
            <FirstPersonControls change={() => {
                console.log('lol');
            }} lookSpeed={.009} movementSpeed={2} />
            <gridHelper rotation={[0, 0, 0]} />
        </Canvas>
    );
}

export default App;