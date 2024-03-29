import { BiShieldQuarter } from 'react-icons/bi'
import { RxEyeClosed, RxEyeOpen } from 'react-icons/rx'
import { useState } from 'react'
import { useRouter } from 'next/router'
import styles from '../styles/signin.module.scss'
import Head from 'next/head'
import ErrorMessage from '../components/ErrorMessage/ErrorMessage'

const Signin = () => {
  const [show, setShow] = useState(false)
  const [error, setError] = useState(false)
  const router = useRouter()

  const submitHandler = async (event) => {
    event.preventDefault()
    const username = event.target.username.value
    const password = event.target.password.value

    if (username !== 'admin' || password !== '123') {
      setError(!error)
      setTimeout(() => {
        setError(false)
      }, 2500)
    } else {
      router.push({
        pathname: '/',
      })
    }
  }

  const handleKeypress = (e) => {
    //it triggers by pressing the enter key
    if (e.keyCode === 13) {
      submitHandler()
    }
  }

  return (
    <>
      <Head>
        <title>Sign in</title>
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Head>
      <div className={styles.body}>
        <div className={styles.signinBox}>
          <form onSubmit={submitHandler}>
            <div className={styles.logo}>
              <BiShieldQuarter /> <span>RFID Management System</span>
            </div>
            <p>Sign in</p>
            {error ? (
              <ErrorMessage>Incorrect username or password.</ErrorMessage>
            ) : (
              <div></div>
            )}
            <input id="username" type="text" placeholder="Enter username" />
            <div className={styles.showContainer}>
              <div className={styles.showIcon} onClick={() => setShow(!show)}>
                {show ? <RxEyeOpen /> : <RxEyeClosed />}
              </div>
              <input
                id="password"
                type={show ? 'text' : 'password'}
                placeholder="Enter password"
                onKeyPress={handleKeypress}
              />
            </div>

            <div className={styles.createAcc}>
              No account?
              <span onClick={() => router.push('/developing')}>
                Create one!
              </span>
            </div>
            <div className={styles.btnContainer}>
              <input type="submit" value="Sign in" className={styles.btn} />
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default Signin
