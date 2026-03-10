import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  profile: null,
  token: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {

    addUser: (state, action) => {
      state.user = action.payload.user;
      state.profile = action.payload.profile || null;
      state.token = action.payload.token;
    },

    setProfile: (state, action) => {
      state.profile = action.payload;
    },

    removeUser: (state) => {
      state.user = null;
      state.profile = null;
      state.token = null;
    },

  },
});

export const { addUser, setProfile, removeUser } = userSlice.actions;
export default userSlice.reducer;