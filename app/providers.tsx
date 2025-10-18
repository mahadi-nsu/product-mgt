"use client";
import { Provider } from "react-redux";
import { SWRConfig } from "swr";
import { store } from "@/store";
import { useEffect } from "react";
import { loadFromStorage } from "@/store/slices/authSlice";

function AuthBootstrap() {
  useEffect(() => {
    store.dispatch(loadFromStorage());
  }, []);
  return null;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthBootstrap />
      <SWRConfig
        value={{
          fetcher: async (resource: string, init?: RequestInit) => {
            const state = store.getState();
            const headers = new Headers(init?.headers);
            if (state.auth.token) {
              headers.set("Authorization", `Bearer ${state.auth.token}`);
            }
            const res = await fetch(resource, { ...init, headers });
            if (!res.ok) {
              const message = await res.text();
              throw new Error(message || `Request failed: ${res.status}`);
            }
            const contentType = res.headers.get("content-type") || "";
            if (contentType.includes("application/json")) return res.json();
            return res.text();
          },
          onError: (err) => {
            // could dispatch toast here later
            console.error(err);
          },
        }}
      >
        {children}
      </SWRConfig>
    </Provider>
  );
}
