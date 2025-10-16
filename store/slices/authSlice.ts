import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type AuthState = {
  email: string | null;
  token: string | null;
};

const initialState: AuthState = {
  email: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ email: string; token: string }>
    ) => {
      state.email = action.payload.email;
      state.token = action.payload.token;
      if (typeof window !== "undefined") {
        localStorage.setItem("auth", JSON.stringify(state));
      }
    },
    loadFromStorage: (state) => {
      if (typeof window === "undefined") return;
      const raw = localStorage.getItem("auth");
      if (!raw) return;
      try {
        const parsed = JSON.parse(raw) as AuthState;
        state.email = parsed.email;
        state.token = parsed.token;
      } catch {}
    },
    logout: (state) => {
      state.email = null;
      state.token = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth");
      }
    },
  },
});

export const { setCredentials, loadFromStorage, logout } = authSlice.actions;
export default authSlice.reducer;
