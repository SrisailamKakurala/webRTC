import React, { useEffect, useState } from "react";

const PeerContext = React.createContext(null);

export const usePeer = () => {
    return React.useContext(PeerContext);
};

export const PeerProvider = ({ children }) => {
    const [remoteStream, setRemoteStream] = useState(null);

    const peer = React.useMemo(
        () =>
            new RTCPeerConnection({
                iceServers: [
                    {
                        urls: [
                            "stun:stun.l.google.com:19302",
                            "stun:global.stun.twilio.com:3478",
                        ],
                    },
                ],
            }),
        []
    );

    // Create an offer for a new connection
    const createOffer = async () => {
        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);
        console.log("Created offer:", offer);
        return offer;
    };

    // Create an answer to an incoming offer
    const createAnswer = async (offer) => {
        await peer.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);
        console.log("Created answer:", answer);
        return answer;
    };

    // Set remote answer for an accepted call
    const setRemoteAnswer = async (answer) => {
        try {
            await peer.setRemoteDescription(new RTCSessionDescription(answer));
            console.log("Remote answer set successfully");
        } catch (error) {
            console.error("Error setting remote answer:", error);
        }
    };

    // Send media stream to peer
    const sendStream = async (stream) => {
        console.log("Sending stream:", stream);
        stream.getTracks().forEach((track) => {
            console.log("Adding track:", track);
            peer.addTrack(track, stream);
        });
    };

    // Handle incoming tracks from remote peer
    const handleTrackEvent = (event) => {
        console.log("Track event triggered:", event);
        if (event.streams && event.streams[0]) {
            console.log("Setting remote stream:", event.streams[0]);
            setRemoteStream(event.streams[0]);
        } else {
            console.log("No streams found in track event.");
        }
    };

    useEffect(() => {
        peer.addEventListener("track", handleTrackEvent);
        return () => {
            peer.removeEventListener("track", handleTrackEvent);
        };
    }, []);

    return (
        <PeerContext.Provider
            value={{ peer, createOffer, createAnswer, setRemoteAnswer, sendStream, remoteStream }}
        >
            {children}
        </PeerContext.Provider>
    );
};
