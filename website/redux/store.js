import { configureStore } from '@reduxjs/toolkit'

import toggleSlice from './reducers/toggle'
import menuSlice from './reducers/menu'
export default configureStore({
  reducer: {
    toggle: toggleSlice,
    menu: menuSlice,
  },
})
