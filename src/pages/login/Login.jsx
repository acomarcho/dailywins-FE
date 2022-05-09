import styles from "./Login.module.css"
import { Link } from "react-router-dom"
import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios";
import URL from "../../utils/URL";
/* react-toastify */
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
/* react-loading */
import ReactLoading from "react-loading";

const Login = () => {
  const [loading, setLoading] = useState(false);

  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  let navigate = useNavigate();

  const validateToken = async () => {
    setLoading(true);
    if (localStorage.getItem("token")) {
      try {
        await axios.post(`${URL}/user`, {
          token: localStorage.getItem("token") 
        });
        navigate("/app");
      } catch (error) {
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }

  /* Auto login if token is available */
  useEffect(() => {
    validateToken();
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();
    const username = usernameRef.current.value;
    const password = passwordRef.current.value;
    if (username !== '' && password !== '') {
      setLoading(true);
      try {
        let res = await axios.post(`${URL}/login`, {
          username: username,
          password: password
        });
        localStorage.setItem("token", res.data.token);
        navigate('/app')
      } catch (error) {
        toast.error(error.response.data.message);
      }
      setLoading(false);
    } else {
      toast.error("Please fill out the form first!");
    }
  };

  return (
    <>
      <ToastContainer
        position="bottom-center"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <div className={styles.appContainer}>
        {loading && (
          <ReactLoading type="bars" color="#FFFFFF" height="20%" width="20%" />
        )}
        {!loading && (
          <div className={styles.main}>
            <h1 className={styles.heading}>Welcome to DailyWins!</h1>
            <p className={styles.logInText}>Please log in to continue.</p>
            <form className={styles.formContainer} onSubmit={handleSubmit}>
              <div className={styles.form}>
                <p className={styles.formLabel}>Username</p>
                <input
                  type="text"
                  className={styles.formInput}
                  placeholder="johndoe"
                  ref={usernameRef}
                />
              </div>
              <div className={styles.form}>
                <p className={styles.formLabel}>Password</p>
                <input
                  type="password"
                  className={styles.formInput}
                  placeholder="mypassword"
                  ref={passwordRef}
                />
              </div>
              <button type="submit" className={styles.button}>Log in</button>
            </form>
            <p className={styles.label}>Don't have an account yet?</p>
            <Link to="/register" className={styles.register}>
              Sign up
            </Link>
          </div>
        )}
      </div>
    </>
  );
}

export default Login;