import http from "../http-common";

class AuthService {

    signIn (data) {
        return http.post("/auth/login", data);
    }

    signUp (data) {
        return http.post("/auth/register", data);
    }

}

export default new AuthService();
