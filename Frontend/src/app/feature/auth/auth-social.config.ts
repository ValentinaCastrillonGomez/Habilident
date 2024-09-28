import { GoogleLoginProvider, SocialAuthServiceConfig } from "@abacritt/angularx-social-login";
import { environment } from "src/environments/environment";

export default {
    autoLogin: false,
    providers: [
        {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(environment.clientId, {
                oneTapEnabled: false,
                scopes: ['https://www.googleapis.com/auth/calendar']
            })
        }
    ],
    onError: (err) => {
        console.error(err);
    }
} as SocialAuthServiceConfig;
