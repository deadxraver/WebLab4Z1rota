import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { tap } from "rxjs";

interface TokenResponse {
    token: string;
}

export interface AuthCredentials {
    username: string;
    password: string;
}

@Injectable({
    providedIn:"root"

})
export class AuthService {

    private apiUrl = "http://localhost:3213/api/auth"

    constructor(private http: HttpClient) {}

    login(credentials: AuthCredentials): Observable<TokenResponse> {
        const loginUrl = `${this.apiUrl}/login`;

        return this.http.post<TokenResponse>(loginUrl,credentials).pipe(
            tap(response => {
                if (response && response.token) {
                    localStorage.setItem("authToken",response.token);
                }
            })
        );
    }


    register(credentials: AuthCredentials): Observable<any> {
        const registerUrl = `${this.apiUrl}/register`;
        return this.http.post(registerUrl,credentials)
    }

    logout(): void {
        localStorage.removeItem('authToken');
    }

    isLoggedIn(): boolean {
        return !!localStorage.getItem('authToken');
    }


}