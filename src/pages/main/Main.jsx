import styles from "./Main.module.css";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import URL from "../../utils/URL"
import axios from "axios";
/* react-toastify */
import { ToastContainer, toast } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
/* react-loading */
import ReactLoading from "react-loading";

const Main = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({});
  const [isAddingTodayWin, setIsAddingTodayWin] = useState(false);
  const [isAddingTomorrowWin, setIsAddingTomorrowWin] = useState(false);
  const [todayWins, setTodayWins] = useState([]);
  const [tomorrowWins, setTomorrowWins] = useState([]);
  const [date, setDate] = useState({});

  const todayWinRef = useRef(null);
  const tomorrowWinRef = useRef(null);

  let navigate = useNavigate();

  const formatDate = (d) => {
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  }

  const getMonth = (month) => {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ];

    return months[month];
  }

  const getDay = (day) => {
    const days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday'
    ];

    return days[day];
  }

  const isDateSameAsToday = () => {
    const d = new Date(date);
    const d2 = new Date();
    return d.getDate() === d2.getDate() && d.getFullYear() === d2.getFullYear() && d.getMonth() === d2.getMonth();
  }

  const formatDateLabel = () => {
    const d = new Date(date);
    const d2 = new Date();
    if (isDateSameAsToday()) {
      return `Today, ${getMonth(d.getMonth())} ${d.getDate()}, ${d.getFullYear()}`;
    } else {
      return `${getDay(d.getDay())}, ${getMonth(d.getMonth())} ${d.getDate()}, ${d.getFullYear()}`;
    }
  }

  const fetchWins = async (d) => {
    if (localStorage.getItem("token")) {
      try {
        setLoading(true);
        let res = await axios.post(`${URL}/user`, {
          token: localStorage.getItem("token")
        });
        /* Fetch user data ... */
        setUser({
          username: res.data.username,
        });
        res = await axios.post(`${URL}/getWins`, {
          token: localStorage.getItem("token"),
          date: d
        })
        setTodayWins(res.data.todaywins);
        setTomorrowWins(res.data.tomorrowwins);
        setLoading(false);
      } catch (error) {
        navigate('/');
      }
    }
  }

  useEffect(() => {
    /* Cek apakah localStorage memiliki user data yang benar */
    if (localStorage.getItem("token")) {
      fetchWins(formatDate(new Date()));
      setDate(formatDate(new Date()));
      toast.success(`Successfully authorized!`)
    } else {
      /* Kembalikan ke login screen */
      navigate('/');
    }
  }, []);

  useEffect(() => {
    if (isAddingTodayWin) {
      todayWinRef.current.focus();
    }
  }, [isAddingTodayWin]);

  useEffect(() => {
    if (isAddingTomorrowWin) {
      tomorrowWinRef.current.focus();
    }
  }, [isAddingTomorrowWin]);

  const handleLogOut = () => {
    localStorage.removeItem("token");
    navigate("/");
  }

  const handleAddTodayWin = async () => {
    if (todayWinRef.current.value !== '') {
      if (localStorage.getItem("token")) {
        try {
          setLoading(true);
          let res = await axios.post(`${URL}/todayWin`, {
            token: localStorage.getItem("token"),
            date: date,
            win: todayWinRef.current.value
          });
          setIsAddingTodayWin(false);
          setTodayWins([...todayWins, {
            id: res.data.message.id,
            date: res.data.message.date,
            username: res.data.message.username,
            win: res.data.message.win
          }]);
          setLoading(false);
          toast.success("Added win successfully!");
        } catch {
          /* Kembalikan ke login screen */
          nagivate("/");
        }
      } else {
        /* Kembalikan ke login screen */
        nagivate("/");
      }
    } else {
      toast.error("Please fill out the form first!");
    }
  }

  const removeTodayWin = async (id) => {
    if (localStorage.getItem("token")) {
      try {
        setLoading(true);
        await axios.delete(`${URL}/todayWin`, {
          data: {
            token: localStorage.getItem("token"),
            id: id
          }
        });
        setTodayWins(oldTodayWins => {
          return oldTodayWins.filter((win) => {
            return win.id !== id;
          });
        });
        setLoading(false);
        toast.success("Removed win successfully!");
      } catch {
        /* Kembalikan ke login screen */
        nagivate("/");
      }
    } else {
      /* Kembalikan ke login screen */
      nagivate("/");
    }
  };

  const handleAddTomorrowWin = async () => {
    if (tomorrowWinRef.current.value !== '') {
      if (localStorage.getItem("token")) {
        try {
          setLoading(true);
          let res = await axios.post(`${URL}/tomorrowWin`, {
            token: localStorage.getItem("token"),
            date: date,
            win: tomorrowWinRef.current.value,
          });
          setIsAddingTomorrowWin(false);
          setTomorrowWins([
            ...tomorrowWins,
            {
              id: res.data.message.id,
              date: res.data.message.date,
              username: res.data.message.username,
              win: res.data.message.win,
            },
          ]);
          setLoading(false);
          toast.success("Added win successfully!");
        } catch {
          /* Kembalikan ke login screen */
          nagivate("/");
        }
      } else {
        /* Kembalikan ke login screen */
        nagivate("/");
      }
    } else {
      toast.error("Please fill out the form first!");
    }
  };

  const removeTomorrowWin = async (id) => {
    if (localStorage.getItem("token")) {
      try {
        setLoading(true);
        await axios.delete(`${URL}/tomorrowWin`, {
          data: {
            token: localStorage.getItem("token"),
            id: id,
          },
        });
        setTomorrowWins((oldTomorrowWins) => {
          return oldTomorrowWins.filter((win) => {
            return win.id !== id;
          });
        });
        setLoading(false);
        toast.success("Removed win successfully!");
      } catch {
        /* Kembalikan ke login screen */
        nagivate("/");
      }
    } else {
      /* Kembalikan ke login screen */
      nagivate("/");
    }
  };

  const handleNextDate = () => {
    let d = new Date(date);
    d.setDate(d.getDate() + 1);
    setDate(formatDate(d));
    fetchWins(formatDate(new Date(d)));
  }

  const handlePrevDate = () => {
    let d = new Date(date);
    d.setDate(d.getDate() - 1);
    setDate(formatDate(d));
    fetchWins(formatDate(new Date(d)));
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
            <div className={styles.topContainer}>
              <p className={styles.helloLabel}>Hello, {user.username}!</p>
              <button className={styles.primaryBtn} onClick={handleLogOut}>
                Log out
              </button>
            </div>
            <div className={styles.dateContainer}>
              <button className={styles.secondaryBtn} onClick={handlePrevDate}>
                {"<"}
              </button>
              <p className={styles.dateLabel}>{formatDateLabel()}</p>
              <button
                className={styles.secondaryBtn}
                onClick={handleNextDate}
                disabled={isDateSameAsToday() ? "true" : ""}
              >
                {">"}
              </button>
            </div>
            <div className={styles.todayWinsContainer}>
              <div className={styles.winsHeading}>
                <p className={styles.cardLabelBold}>Today's Wins</p>
                <button
                  className={styles.addWinButton}
                  onClick={() => {
                    setIsAddingTodayWin(true);
                  }}
                >
                  +
                </button>
              </div>
              {todayWins.map((win) => {
                return (
                  <div className={styles.singleWin} key={win.id}>
                    <p className={styles.cardLabel}>{win.win}</p>
                    <button
                      className={styles.deleteWinButton}
                      onClick={() => {
                        removeTodayWin(win.id);
                      }}
                    >
                      -
                    </button>
                  </div>
                );
              })}
              {isAddingTodayWin && (
                <div className={styles.winInput}>
                  <input
                    type="text"
                    placeholder="Insert win here ..."
                    className={styles.input}
                    ref={todayWinRef}
                  />
                  <button
                    className={styles.deleteWinButton}
                    onClick={() => {
                      setIsAddingTodayWin(false);
                    }}
                  >
                    -
                  </button>
                  <button
                    className={styles.addWinButton}
                    onClick={handleAddTodayWin}
                  >
                    +
                  </button>
                </div>
              )}
            </div>
            <div className={styles.tomorrowWinsContainer}>
              <div className={styles.winsHeading}>
                <p className={styles.cardLabelBold}>Tomorrow's Wins</p>
                <button
                  className={styles.addWinButton}
                  onClick={() => {
                    setIsAddingTomorrowWin(true);
                  }}
                >
                  +
                </button>
              </div>
              {tomorrowWins.map((win) => {
                return (
                  <div className={styles.singleWin} key={win.id}>
                    <p className={styles.cardLabel}>{win.win}</p>
                    <button
                      className={styles.deleteWinButton}
                      onClick={() => {
                        removeTomorrowWin(win.id);
                      }}
                    >
                      -
                    </button>
                  </div>
                );
              })}
              {isAddingTomorrowWin && (
                <div className={styles.winInput}>
                  <input
                    type="text"
                    placeholder="Insert win here ..."
                    className={styles.input}
                    ref={tomorrowWinRef}
                  />
                  <button
                    className={styles.deleteWinButton}
                    onClick={() => {
                      setIsAddingTomorrowWin(false);
                    }}
                  >
                    -
                  </button>
                  <button
                    className={styles.addWinButton}
                    onClick={handleAddTomorrowWin}
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Main;
