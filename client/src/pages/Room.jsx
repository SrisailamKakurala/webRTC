import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { useSocket } from "../providers/socket";
import { usePeer } from "../providers/peer";

const Room = () => {
    const socket = useSocket();
    const { peer, createOffer, createAnswer, setRemoteAnswer, sendStream, remoteStream } = usePeer();

    const [myStream, setMyStream] = useState(null);
    const [remoteEmailId, setRemoteEmailId] = useState(null);

    // Get User Media
    const getUserMediaStream = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setMyStream(stream);
            console.log("Local stream obtained:", stream);
        } catch (error) {
            console.error("Error accessing media devices:", error);
        }
    };

    // When a new user joins
    const handleNewUser = async (data) => {
        const { email } = data;
        console.log(`${email} connected`);
        const offer = await createOffer();
        socket.emit("call-user", { email, offer });
        setRemoteEmailId(email);

        if (myStream) sendStream(myStream);
    };

    // When receiving a call
    const handleIncomingCall = async (data) => {
        const { fromEmail, offer } = data;
        console.log("Incoming Call from", fromEmail);
        const answer = await createAnswer(offer);
        socket.emit("call-accepted", { email: fromEmail, answer });
        setRemoteEmailId(fromEmail);

        if (myStream) sendStream(myStream);
    };

    // When call is accepted
    const handleCallAccepted = async (data) => {
        const { answer } = data;
        console.log("Call accepted, setting remote answer");

        if (peer.signalingState === "have-local-offer") {
            await setRemoteAnswer(answer);
        } else {
            console.warn("Skipping setRemoteAnswer: Already in stable state.");
        }
    };

    useEffect(() => {
        if (!socket) return;

        socket.on("user-joined", handleNewUser);
        socket.on("incoming-call", handleIncomingCall);
        socket.on("call-accepted", handleCallAccepted);

        return () => {
            socket.off("user-joined", handleNewUser);
            socket.off("incoming-call", handleIncomingCall);
            socket.off("call-accepted", handleCallAccepted);
        };
    }, [socket]);

    useEffect(() => {
        getUserMediaStream();
    }, []);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold">Room</h1>
            <p className="text-lg">Remote Email: {remoteEmailId || "Waiting for a user..."}</p>
            <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer mt-2"
                onClick={() => sendStream(myStream)}
            >
                Send Stream
            </button>

            <div className="flex gap-4 mt-4">
                {myStream && <ReactPlayer url={myStream} playing muted />}
                {remoteStream ? (
                    <ReactPlayer url={remoteStream} playing />
                ) : (
                    <p>No remote stream received yet.</p>
                )}
            </div>
        </div>
    );
};

export default Room;
