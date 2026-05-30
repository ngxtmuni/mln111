import {
  signInWithCustomToken,
  signOut,
  sendEmailVerification,
  User as FirebaseUser
} from "firebase/auth";
import { auth } from "./config";
import { api } from "../api";

export const firebaseAuth = {
  async signUp(email: string, password: string, fullName: string, turnstileToken?: string) {
    await api.auth.register({ email, password, fullName, turnstileToken });
    return { success: true };
  },

  async signIn(email: string, password: string) {
    // 1. Authenticate via backend to get the Custom Token
    const response = await api.auth.login({ email, password });

    if (!response.token) {
      throw new Error("No token received from backend");
    }

    // 2. Hydrate the Firebase Client SDK session
    const userCredential = await signInWithCustomToken(auth, response.token);
    const user = userCredential.user;

    // 3. Get profile to check role for redirection
    const token = await user.getIdToken();
    const backendUser = await api.auth.getProfile();

    return { user, token, backendUser };
  },

  async logout() {
    await signOut(auth);
  }
};
