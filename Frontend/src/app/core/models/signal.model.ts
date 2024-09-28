export interface Signal {
    type: 'candidate' | 'offer' | 'answer';
    clientId?: string;
    body: RTCSessionDescriptionInit | RTCSessionDescriptionInit;
}