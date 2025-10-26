// Google OAuth Service for Frontend
export interface GoogleAuthResponse {
    success: boolean;
    message: string;
    token?: string;
}

// Type declaration for Google API
declare global {
    interface Window {
        google?: any;
    }
}

class GoogleAuthService {
    private static clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

    // Initialize Google Identity Services
    static initializeGoogleAuth(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (window.google) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://accounts.google.com/gsi/client';
            script.async = true;
            script.defer = true;

            script.onload = () => {
                if (window.google) {
                    resolve();
                } else {
                    reject(new Error('Google Identity Services failed to load'));
                }
            };

            script.onerror = () => {
                reject(new Error('Failed to load Google Identity Services script'));
            };

            document.head.appendChild(script);
        });
    }


    // Trigger Google Sign-In 
    static signIn(): void {
        const googleAuthUrl = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'}/auth/google`;
        window.location.href = googleAuthUrl;
    }
}

export default GoogleAuthService;
