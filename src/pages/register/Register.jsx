import styles from "./Register.module.css"
import { Link } from "react-router-dom"
import { useState, useRef } from "react"
import axios from "axios"
import URL from "../../utils/URL"
/* react-toastify */
import { ToastContainer, toast } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
/* react-loading */
import ReactLoading from "react-loading";

const Register = () => {
  const [loading, setLoading] = useState(false);

  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const username = usernameRef.current.value;
    const password = passwordRef.current.value;
    if (username !== '' && password !== '') {
      setLoading(true);
      try {
        await axios.post(`${URL}/register`, {
          username,
          password
        });
        toast.success("Account successfully registered!");
      } catch (error) {
        toast.error(error.response.data.message);
      }
      setLoading(false);
    } else {
      toast.error("Please fill out the form first!");
    }
  }

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
            <h1 className={styles.heading}>Register an account!</h1>
            <p className={styles.registerText}>Input your credentials below.</p>
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
              <button type="submit" className={styles.button}>
                Register
              </button>
            </form>
            <p className={styles.label}>Already have an account?</p>
            <Link to="/" className={styles.login}>
              Login
            </Link>
          </div>
        )}
      </div>
    </>
  );
}

export default Register;