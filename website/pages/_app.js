import '../styles/globals.scss'

import { Provider } from 'react-redux'
import store from '../redux/store'
import { useState, useEffect } from 'react'
import Restrict from './mobileView'
export default function App({ Component, pageProps }) {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)

    handleResize()

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [setWidth])

  return (
    <Provider store={store}>
      {width < 670 ? <Restrict /> : <Component {...pageProps} />}
    </Provider>
  )
}
