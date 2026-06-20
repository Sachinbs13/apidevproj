import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser, registerUser, fetchProfile } from '../api/newsApi.js';
import { TOKEN_KEY, USER_KEY } from '../constants/routes.js';

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const res = await loginUser(credentials);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login failed');
  }
});

export const register = createAsyncThunk('auth/register', async (payload, { rejectWithValue }) => {
  try {
    const res = await registerUser(payload);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Registration failed');
  }
});

export const loadProfile = createAsyncThunk('auth/loadProfile', async (_, { rejectWithValue }) => {
  try {
    const res = await fetchProfile();
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load profile');
  }
});

const storedToken = localStorage.getItem(TOKEN_KEY);
const storedUser = localStorage.getItem(USER_KEY);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: storedUser ? JSON.parse(storedUser) : null,
    token: storedToken || null,
    loading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    },
    clearError(state) {
      state.error = null;
    },
    updatePreferences(state, action) {
      if (state.user) {
        state.user.preferences = action.payload;
        localStorage.setItem(USER_KEY, JSON.stringify(state.user));
      }
    },
  },
  extraReducers: (builder) => {
    const handleAuthFulfilled = (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
      localStorage.setItem(TOKEN_KEY, action.payload.token);
      localStorage.setItem(USER_KEY, JSON.stringify(action.payload.user));
    };

    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, handleAuthFulfilled)
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, handleAuthFulfilled)
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loadProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        localStorage.setItem(USER_KEY, JSON.stringify(action.payload));
      });
  },
});

export const { logout, clearError, updatePreferences } = authSlice.actions;
export default authSlice.reducer;
