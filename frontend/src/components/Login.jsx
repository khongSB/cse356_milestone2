// import React from "react";
// import "./login.css"; // Ensure to create a CSS file or include the styles in the same file

// export const Login = () => {
//   return (
//     <div className="container">
//       {/* Sign Up Box */}
//       <div className="box">
//         <h2>Sign Up</h2>
//         <form method="POST" action="/api/adduser">
//           <input type="text" name="username" placeholder="Username" required />
//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             required
//           />
//           <input type="email" name="email" placeholder="Email" required />
//           <button type="submit">Submit</button>
//         </form>
//       </div>

//       {/* Verify Email Box */}
//       <div className="box">
//         <h2>Verify Email</h2>
//         <form method="GET" action="/api/verify">
//           <input type="email" name="email" placeholder="Email" required />
//           <input type="text" name="key" placeholder="Key" required />
//           <button type="submit">Verify</button>
//         </form>
//       </div>

//       {/* Login Box */}
//       <div className="box">
//         <h2>Login</h2>
//         <form method="POST" action="/api/login">
//           <input type="text" name="username" placeholder="Username" required />
//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             required
//           />
//           <button type="submit">Login</button>
//         </form>
//       </div>

//       {/* Logout Box */}
//       <div className="box">
//         <h2>Logout</h2>
//         <form method="POST" action="/api/logout">
//           <button type="submit">Logout</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// import React from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import "./login.css";

// export const Login = () => {
//   const navigate = useNavigate();

//   const handleSignUp = async (e) => {
//     e.preventDefault();
//     const { username, password, email } = e.target.elements;

//     try {
//       await axios.post("/api/adduser", {
//         username: username.value,
//         password: password.value,
//         email: email.value,
//       });
//       navigate("/");
//     } catch (error) {
//       console.error("Sign up failed:", error);
//     }
//   };

//   const handleVerifyEmail = async (e) => {
//     e.preventDefault();
//     const { email, key } = e.target.elements;

//     try {
//       await axios.get("/api/verify", {
//         params: { email: email.value, key: key.value },
//       });
//       navigate("/");
//     } catch (error) {
//       console.error("Email verification failed:", error);
//     }
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     const { username, password } = e.target.elements;

//     try {
//       await axios.post("/api/login", {
//         username: username.value,
//         password: password.value,
//       });
//       navigate("/");
//     } catch (error) {
//       console.error("Login failed:", error);
//     }
//   };

//   const handleLogout = async (e) => {
//     e.preventDefault();

//     try {
//       await axios.post("/api/logout");
//       navigate("/Login");
//     } catch (error) {
//       console.error("Logout failed:", error);
//     }
//   };

//   return (
//     <div className="container">
//       {/* Sign Up Box */}
//       <div className="box">
//         <h2>Sign Up</h2>
//         <form onSubmit={handleSignUp}>
//           <input type="text" name="username" placeholder="Username" required />
//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             required
//           />
//           <input type="email" name="email" placeholder="Email" required />
//           <button type="submit">Submit</button>
//         </form>
//       </div>

//       {/* Verify Email Box */}
//       <div className="box">
//         <h2>Verify Email</h2>
//         <form onSubmit={handleVerifyEmail}>
//           <input type="email" name="email" placeholder="Email" required />
//           <input type="text" name="key" placeholder="Key" required />
//           <button type="submit">Verify</button>
//         </form>
//       </div>

//       {/* Login Box */}
//       <div className="box">
//         <h2>Login</h2>
//         <form onSubmit={handleLogin}>
//           <input type="text" name="username" placeholder="Username" required />
//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             required
//           />
//           <button type="submit">Login</button>
//         </form>
//       </div>

//       {/* Logout Box */}
//       <div className="box">
//         <h2>Logout</h2>
//         <form onSubmit={handleLogout}>
//           <button type="submit">Logout</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// import React from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import "./login.css";

// export const Login = () => {
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     const { username, password } = e.target.elements;

//     try {
//       const result = await axios.post(
//         "/api/login",
//         {
//           username: username.value,
//           password: password.value,
//         },
//         { withCredentials: true }
//       );

//       console.log(result.data);
//       if (result.data.status === "OK") {
//         // Redirect to a new URL and reload the page
//         sessionStorage.setItem("token", result.data.token);
//         console.log("token", result.data.token);
//         console.log("login successful");
//         window.location.href = "/";
//       }
//     } catch (error) {
//       console.error("Login failed:", error);
//     }
//   };

//   return (
//     <div className="container">
//       {/* Sign Up Box */}
//       <div className="box">
//         <h2>Sign Up</h2>
//         <form method="POST" action="/api/adduser">
//           <input type="text" name="username" placeholder="Username" required />
//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             required
//           />
//           <input type="email" name="email" placeholder="Email" required />
//           <button type="submit">Submit</button>
//         </form>
//       </div>

//       {/* Verify Email Box */}
//       <div className="box">
//         <h2>Verify Email</h2>
//         <form method="GET" action="/api/verify">
//           <input type="email" name="email" placeholder="Email" required />
//           <input type="text" name="key" placeholder="Key" required />
//           <button type="submit">Verify</button>
//         </form>
//       </div>

//       {/* Login Box */}
//       <div className="box">
//         <h2>Login</h2>
//         <form onSubmit={handleLogin}>
//           <input type="text" name="username" placeholder="Username" required />
//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             required
//           />
//           <button type="submit">Login</button>
//         </form>
//       </div>

//       {/* Logout Box */}
//       <div className="box">
//         <h2>Logout</h2>
//         <form method="POST" action="/api/logout">
//           <button type="submit">Logout</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// import React from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import "./login.css";

// export const Login = () => {
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     const { username, password } = e.target.elements;

//     try {
//       const result = await axios.post(
//         "/api/login",
//         {
//           username: username.value,
//           password: password.value,
//         },
//         { withCredentials: true } // Enable cookies for session management
//       );

//       console.log(result.data);
//       if (result.data.status === "OK") {
//         // Redirect to the home page after successful login
//         console.log("login successful");
//         window.location.href = "/";
//       } else {
//         console.error("Login failed:", result.data.message);
//       }
//     } catch (error) {
//       console.error("Login request failed:", error);
//     }
//   };

//   return (
//     <div className="container">
//       {/* Sign Up Box */}
//       <div className="box">
//         <h2>Sign Up</h2>
//         <form method="POST" action="/api/adduser">
//           <input type="text" name="username" placeholder="Username" required />
//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             required
//           />
//           <input type="email" name="email" placeholder="Email" required />
//           <button type="submit">Submit</button>
//         </form>
//       </div>

//       {/* Verify Email Box */}
//       <div className="box">
//         <h2>Verify Email</h2>
//         <form method="GET" action="/api/verify">
//           <input type="email" name="email" placeholder="Email" required />
//           <input type="text" name="key" placeholder="Key" required />
//           <button type="submit">Verify</button>
//         </form>
//       </div>

//       {/* Login Box */}
//       <div className="box">
//         <h2>Login</h2>
//         <form onSubmit={handleLogin}>
//           <input type="text" name="username" placeholder="Username" required />
//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             required
//           />
//           <button type="submit">Login</button>
//         </form>
//       </div>

//       {/* Logout Box */}
//       <div className="box">
//         <h2>Logout</h2>
//         <form method="POST" action="/api/logout">
//           <button type="submit">Logout</button>
//         </form>
//       </div>
//     </div>
//   );
// };

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./login.css";

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is already logged in, and if so, redirect to the main page.
    axios
      .post(
        "http://bubbleguppies.cse356.compas.cs.stonybrook.edu/api/check-auth",
        { withCredentials: true }
      )
      .then((response) => {
        if (!response.data.error) {
          navigate("/");
        }
      })
      .catch((error) => {
        console.log("Authorization check failed:", error);
      });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    // Attempt login via the API
    axios
      .post(
        "http://bubbleguppies.cse356.compas.cs.stonybrook.edu/api/login",
        { username: username, password: password },
        { withCredentials: true }
      )
      .then((response) => {
        if (response.data.error) {
          console.log("Login error:", response.data.message);
        } else {
          console.log("Login successful");
          navigate("/");
        }
      })
      .catch((error) => {
        console.log("Login request failed:", error);
      });
  };

  return (
    <div className="container">
      <div className="box">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};
