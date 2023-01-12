import { createSlice } from '@reduxjs/toolkit'

const toggleSlice = createSlice({
  name: 'toggle',
  initialState: {
    toggle: false,
  },

  reducers: {
    SET_TOGGLE_EDIT(state, action) {
      state.toggleEdit = action.payload
    },
    SET_TOGGLE_DELETE(state, action) {
      state.toggleDelete = action.payload
    },
  },
})

export const { SET_TOGGLE_DELETE, SET_TOGGLE_EDIT } = toggleSlice.actions
export default toggleSlice.reducer
