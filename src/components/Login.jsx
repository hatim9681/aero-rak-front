import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");


  const checkAccount = (e) => {
    e.preventDefault();
    const hashedPassword = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
  
    axios
      .get(`http://127.0.0.1:8080/utilisateurs/check-account/${email}/${hashedPassword}`)
      .then((response) => {
        const userId = response.data;
        if (userId > 0) {
          axios
            .get(`http://127.0.0.1:8080/utilisateurs/${userId}`)
            .then((response) => {
              const updatedUser = {
                isLogged: true,
                user_id: userId,
                role: response.data.role,
                nomComplet: response.data.nomComplet,
              };
              localStorage.setItem('user', JSON.stringify(updatedUser));

              navigate('/sidebar');
            })
           ;
        } else {
          setEmailError("Email ou Mot de Passe incorrect");
        }
      })
      .catch((error) => {
        console.error("Error checking account:", error);
      });
  };
  



  return (
    <section className="home">
      <div className="form_container">
        <div className="form login_form">
          <form onSubmit={checkAccount}>
            <h2>Bienvenue</h2>
            <div className="input_box">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <i className="uil uil-envelope-alt email" />
            </div>
            <div className="input_box">
              <input
                type="password"
                placeholder="Mot de Passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <i className="uil uil-lock password" />
            </div>
            {emailError && (
              <p style={{ color: "red", fontSize: "10px" }}>{emailError}</p>
            )}
            <button type="submit" className="button">
              Se Connecter
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Login;
