export const environment = {
    production: true,
    apiUrl: 'https://poliskills-back-production.up.railway.app',
    clientId: '1006223143866-5ka5hmq2hucke2hhlassle8ustlfb8rb.apps.googleusercontent.com',
    STUN: {
        iceServers: [{
            urls: [
                'stun:stun1.l.google.com:19302',
                'stun:stun2.l.google.com:19302',
            ],
        },],
        iceCandidatePoolSize: 10,
    }
};
