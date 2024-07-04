import { createContext, Dispatch, useEffect, useReducer } from 'react';
import { AuthState } from '../../../common/types/auth/types';
import { initialize, reducer } from './reducers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAsyncStorage } from 'common/utils/cookie';
import { TshusSocket } from 'common/types/other/socket.type';
import { useSocket } from 'common/hooks/use-socket';


export enum AuthActionType {
  INITIALZE = 'INITIALIZE',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  UPDATE = "UPDATE"
}

export interface PayloadAction<T> {
  type: AuthActionType;
  payload: T;
}

export interface AuthContextType extends AuthState {
  dispatch: Dispatch<PayloadAction<AuthState>>;
}

const initialState: AuthState = {
  isAuthenticated: false,
  isInitialized: false,
};

export const AuthContext = createContext<AuthContextType>({
  ...initialState,
  dispatch: () => { },
});

interface Props {
  children: React.ReactNode;
}

const AuthProvider: React.FC<Props> = ({ children }: Props) => {
  // State
  const [state, dispatch] = useReducer(reducer, initialState);
  // Socket
  const socket: TshusSocket = useSocket();
  // Use Effect
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get access token from AsyncStorage
        const accessToken = await getAsyncStorage('token');

        // Check access token
        if (!accessToken) {
          return dispatch(initialize({ isAuthenticated: false }));
        }

        // Get user data from AsyncStorage
        const userDataString = await getAsyncStorage('user');

        if (!userDataString) {
          throw new Error('User data not found in AsyncStorage');
        }

        const user = JSON.parse(userDataString);

        // Dispatch initialize action with user data
        dispatch(initialize({ isAuthenticated: true, ...user }));

      } catch (error) {
        console.error('Error fetching user data:', error);
        dispatch(initialize({ isAuthenticated: false }));
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    (async () => {
      // User
      const user = await getAsyncStorage('user');

      // Check
      if (socket && user) {
        // Set id to socket
        socket.auth = {
          user: user?._id,
        };
        socket?.connect();
      }

      // Return 
      return () => socket?.disconnect();
    })();
  }, [socket, state]);
  // Shared
  const shared: any = {
    user: {
      get: state,
      set: dispatch,
    },
  };

  // Return
  return <AuthContext.Provider value={shared}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
