import { createSlice } from '@reduxjs/toolkit'

const menuSlice = createSlice({
  name: 'menu',
  initialState: {
    menu: '1',
  },

  reducers: {
    SET_MENU_CHOICE(state, action) {
      state.menuChoice = action.payload
    },
  },
})

export const { SET_MENU_CHOICE } = menuSlice.actions
export default menuSlice.reducer
