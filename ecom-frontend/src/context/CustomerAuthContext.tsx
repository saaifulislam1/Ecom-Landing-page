"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { BackendCustomerAccount, getCurrentCustomer, loginCustomer, registerCustomer } from "@/lib/api";

const CUSTOMER_TOKEN_KEY = "customer_token";

type CustomerAuthContextValue = {
  customer: BackendCustomerAccount | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: { name: string; email: string; password: string; phone: string; address?: string; city?: string }) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
};

const CustomerAuthContext = createContext<CustomerAuthContextValue | null>(null);

export function CustomerAuthProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<BackendCustomerAccount | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    Promise.resolve().then(async () => {
      const storedToken = window.localStorage.getItem(CUSTOMER_TOKEN_KEY);
      if (!storedToken) {
        if (!cancelled) setLoading(false);
        return;
      }

      try {
        const currentCustomer = await getCurrentCustomer(storedToken);
        if (cancelled) return;
        setToken(storedToken);
        setCustomer(currentCustomer);
      } catch {
        window.localStorage.removeItem(CUSTOMER_TOKEN_KEY);
        if (!cancelled) {
          setToken(null);
          setCustomer(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo<CustomerAuthContextValue>(() => ({
    customer,
    token,
    loading,
    async login(email, password) {
      const result = await loginCustomer(email, password);
      window.localStorage.setItem(CUSTOMER_TOKEN_KEY, result.token);
      setToken(result.token);
      setCustomer(result.customer);
    },
    async register(payload) {
      await registerCustomer(payload);
    },
    logout() {
      window.localStorage.removeItem(CUSTOMER_TOKEN_KEY);
      setToken(null);
      setCustomer(null);
    },
    async refresh() {
      if (!token) return;
      const currentCustomer = await getCurrentCustomer(token);
      setCustomer(currentCustomer);
    },
  }), [customer, loading, token]);

  return <CustomerAuthContext.Provider value={value}>{children}</CustomerAuthContext.Provider>;
}

export function useCustomerAuth() {
  const context = useContext(CustomerAuthContext);
  if (!context) throw new Error("useCustomerAuth must be used inside CustomerAuthProvider");
  return context;
}
