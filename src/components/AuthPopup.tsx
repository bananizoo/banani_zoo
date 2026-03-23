"use client";

import { useEffect, useState } from "react";

type AuthPopupProps = {
  onClose: () => void;
};

type UserType = {
  id: string;
  name: string;
  email: string;
};

export default function AuthPopup({ onClose }: AuthPopupProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [user, setUser] = useState<UserType | null>(null);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadCurrentUser() {
    try {
      const response = await fetch("/api/auth/me", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        setUser(null);
        return;
      }

      const data = await response.json();
      setUser(data.user);
    } catch {
      setUser(null);
    }
  }

  useEffect(() => {
    loadCurrentUser();
  }, []);

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Помилка входу");
        setLoading(false);
        return;
      }

      setMessage(data.message || "Вхід виконано успішно");
      setLoginEmail("");
      setLoginPassword("");
      await loadCurrentUser();
    } catch {
      setMessage("Помилка сервера");
    }

    setLoading(false);
  }

  async function handleRegister(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: registerName,
          email: registerEmail,
          password: registerPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Помилка реєстрації");
        setLoading(false);
        return;
      }

      setMessage(data.message || "Реєстрацію виконано успішно");
      setRegisterName("");
      setRegisterEmail("");
      setRegisterPassword("");
      await loadCurrentUser();
    } catch {
      setMessage("Помилка сервера");
    }

    setLoading(false);
  }

  async function handleLogout() {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Помилка виходу");
        setLoading(false);
        return;
      }

      setUser(null);
      setMessage(data.message || "Вихід виконано успішно");
    } catch {
      setMessage("Помилка сервера");
    }

    setLoading(false);
  }

  return (
    <div className="auth-popup">
      <button className="auth-close" onClick={onClose}>
        ×
      </button>

      {user ? (
        <div>
          <h3>Профіль</h3>
          <p><strong>Ім’я:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>

          <button onClick={handleLogout} disabled={loading}>
            {loading ? "Завантаження..." : "Вийти"}
          </button>
        </div>
      ) : (
        <div>
          <div className="auth-tabs">
            <button onClick={() => setMode("login")} disabled={mode === "login"}>
              Увійти
            </button>
            <button
              onClick={() => setMode("register")}
              disabled={mode === "register"}
            >
              Реєстрація
            </button>
          </div>

          {mode === "login" ? (
            <form onSubmit={handleLogin} className="auth-form">
              <h3>Увійти</h3>

              <input
                type="email"
                placeholder="Email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />

              <input
                type="password"
                placeholder="Пароль"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />

              <button type="submit" disabled={loading}>
                {loading ? "Завантаження..." : "Увійти"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="auth-form">
              <h3>Реєстрація</h3>

              <input
                type="text"
                placeholder="Ім’я"
                value={registerName}
                onChange={(e) => setRegisterName(e.target.value)}
              />

              <input
                type="email"
                placeholder="Email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
              />

              <input
                type="password"
                placeholder="Пароль"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
              />

              <button type="submit" disabled={loading}>
                {loading ? "Завантаження..." : "Зареєструватися"}
              </button>
            </form>
          )}
        </div>
      )}

      {message && <p className="auth-message">{message}</p>}
    </div>
  );
}