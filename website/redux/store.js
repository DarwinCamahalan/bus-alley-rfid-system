import { configureStore } from '@reduxjs/toolkit'

import toggleSlice from './reducers/toggle'
export default configureStore({
  reducer: {
    toggle: toggleSlice,
  },
})
