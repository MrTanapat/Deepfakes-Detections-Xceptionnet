// ─────────────────────────────────────────────────────────────────────────────
// src/services/auth.service.ts
// ─────────────────────────────────────────────────────────────────────────────

import api, { tokenStorage } from "./api";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  MeResponse,
} from "@/types";

const AuthService = {
  async login(payload: LoginRequest): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>("/api/auth/login", payload);
    tokenStorage.set(data.tokens.accessToken, data.tokens.refreshToken);
    return data;
  },

  async register(payload: RegisterRequest): Promise<RegisterResponse> {
    const { data } = await api.post<RegisterResponse>("/api/auth/register", payload);
    tokenStorage.set(data.tokens.accessToken, data.tokens.refreshToken);
    return data;
  },

  async me(): Promise<MeResponse> {
    const { data } = await api.get<MeResponse>("/api/auth/me");
    return data;
  },

  async logout(): Promise<void> {
    try {
      await api.post("/api/auth/logout");
    } finally {
      tokenStorage.clear();
    }
  },
};

export default AuthService;