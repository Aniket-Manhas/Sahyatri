import React, { useContext } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import "../styling/login.css";

const Login = () => {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Train Navigation Login</h2>
        <p>Sign in with Google to continue</p>
        <div className="google-login-button">
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              const userData = jwtDecode(credentialResponse.credential);
              console.log("Decoded Token:", userData);

              // Save user data to context
              setUser({
                name: userData.name,
                email: userData.email,
                picture: userData.picture,
                sub: userData.sub
              });

              // Display the user info on the page
              document.getElementById("user-info").innerHTML = `
                <h3>Welcome, ${userData.name}!</h3>
                <p>Email: ${userData.email}</p>
                <img src="${userData.picture}" alt="Profile" />
                <p>Redirecting to homepage...</p>
              `;

              // Navigate to home page after a short delay
              setTimeout(() => {
                navigate('/');
              }, 1500);
            }}
            onError={() => {
              console.log("Login Failed");
              document.getElementById("user-info").innerHTML =
                '<p class="error">Login failed. Please try again.</p>';
            }}
          />
        </div>
        <div id="user-info"></div>
      </div>
    </div>
  );
};

export default Login;
