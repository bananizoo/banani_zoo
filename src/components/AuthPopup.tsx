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
  const [isCheckingUser, setIsCheckingUser] = useState(true);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadCurrentUser() {
    setIsCheckingUser(true);

    try {
      const res = await fetch("/api/auth/me", { credentials: "include" });

      if (!res.ok) {
        setUser(null);
        return;
      }

      const data = await res.json();
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setIsCheckingUser(false);
    }
  }

  useEffect(() => {
    loadCurrentUser();
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    if (!loginEmail || !loginPassword) {
      setMessage("Усі поля обов'язкові");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Помилка входу");
        return;
      }

      setMessage("Успішно 🎉");
      setLoginEmail("");
      setLoginPassword("");
      await loadCurrentUser();
    } catch {
      setMessage("Помилка сервера");
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    if (!registerName || !registerEmail || !registerPassword) {
      setMessage("Усі поля обов'язкові");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: registerName,
          email: registerEmail,
          password: registerPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Помилка реєстрації");
        return;
      }

      setMessage("Створено 🎉");
      setRegisterName("");
      setRegisterEmail("");
      setRegisterPassword("");
      await loadCurrentUser();
    } catch {
      setMessage("Помилка сервера");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    setLoading(true);

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      setUser(null);
      setMessage("");
      setMode("login");
    } catch {
      setMessage("Помилка");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-popup">
      <button className="auth-close" onClick={onClose}>
        ✕
      </button>

      {isCheckingUser ? (
        <div className="profile-view">
          <p>Завантаження...</p>
        </div>
      ) : user ? (
        <div className="profile-view">
          <div className="avatar-big">🐵</div>
          <h3>{user.name}</h3>
          <p>{user.email}</p>

          <button onClick={handleLogout}>
            {loading ? "..." : "Вийти"}
          </button>
        </div>
      ) : (
        <>
          <div className="auth-tabs">
            <button
              onClick={() => setMode("login")}
              className={mode === "login" ? "active" : ""}
            >
              Увійти
            </button>
            <button
              onClick={() => setMode("register")}
              className={mode === "register" ? "active" : ""}
            >
              Реєстрація
            </button>
          </div>

          {mode === "login" ? (
            <form onSubmit={handleLogin} className="auth-form">
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
                {loading ? "..." : "Увійти"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="auth-form">
              <input
                type="text"
                placeholder="Ім'я"
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
                {loading ? "..." : "Зареєструватися"}
              </button>
            </form>
          )}

          {message && <p className="auth-message">{message}</p>}
        </>
      )}
    </div>
  );
}