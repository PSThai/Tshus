import { deleteAsyncStorage } from 'common/utils/cookie';
import { AuthState } from '../../../common/types/auth/types';
import { AuthActionType, PayloadAction } from './context';


export interface ReducerHandler {
  INITIALIZE(state: AuthState, action: PayloadAction<AuthState>): AuthState;
  LOGIN(state: AuthState, action: PayloadAction<AuthState>): AuthState;
  UPDATE(state: AuthState, action: PayloadAction<AuthState>): AuthState;
  LOGOUT(state: AuthState): AuthState;
}

const reducerHandlers: ReducerHandler = {
  INITIALIZE(state: AuthState, action: PayloadAction<AuthState>): AuthState {
    // Destructuring data
    const data = action.payload;

    // Return
    return {
      ...state,
      ...data,
      isInitialized: true,
    };
  },
  UPDATE(state: AuthState, action: PayloadAction<AuthState>): AuthState {
    // Destructuring data
    const data = action.payload;

    // Return
    return {
      ...state,
      ...data,
      isInitialized: true,
    };
  },
  LOGIN(state: AuthState, action: PayloadAction<AuthState>): AuthState {
    // Destructuring data
    const user = action.payload;
    // Return
    return {
      ...state,
      ...user,
      isAuthenticated: true,
    };
  },
  LOGOUT(state: AuthState): AuthState {
    // Return
    return {
      ...state,
      isAuthenticated: false,
    };
  },
};

export function reducer(state: AuthState, action: PayloadAction<AuthState>) {
  // Check
  if (!reducerHandlers[action.type]) {
    // Return
    return state;
  }

  return reducerHandlers[action.type](state, action);
}

// ACTIONS
export function initialize(payload: AuthState): PayloadAction<AuthState> {
  return {
    type: AuthActionType.INITIALZE,
    payload,
  };
}

export function login(payload: AuthState): PayloadAction<AuthState> {
  return {
    type: AuthActionType.INITIALZE,
    payload,
  };
}

export function update(payload: AuthState): PayloadAction<AuthState> {
  
  return {
    type: AuthActionType.UPDATE,
    payload,
  };
}

export function logout(): PayloadAction<AuthState>{
  // Remove cookie
  deleteAsyncStorage('token');

  // Remove user data
  deleteAsyncStorage('user');

  deleteAsyncStorage("tshus.current.conversation");

  // Return
  return {
    type: AuthActionType.LOGOUT,
    payload: {},
  };
}
