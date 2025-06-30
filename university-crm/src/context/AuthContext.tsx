import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import { User, AuthState, LoginRequest, RegisterRequest } from "@/types";
import { authService } from "@/services/auth";
import { wsService } from "@/services/websocket";
import { toast } from "react-hot-toast";

interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

type AuthAction =
  | { type: "AUTH_START" }
  | { type: "AUTH_SUCCESS"; payload: { user: User; token: string } }
  | { type: "AUTH_FAILURE" }
  | { type: "LOGOUT" };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "AUTH_START":
      return { ...state, isLoading: true };
    case "AUTH_SUCCESS":
      return {
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };
    case "AUTH_FAILURE":
      return {
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case "LOGOUT":
      return {
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };
    default:
      return state;
  }
};

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const initAuth = () => {
      const user = authService.getCurrentUser();
      const token = authService.getToken();

      if (user && token && authService.isTokenValid()) {
        dispatch({ type: "AUTH_SUCCESS", payload: { user, token } });
        wsService.connect(token);
      } else {
        authService.logout();
        dispatch({ type: "AUTH_FAILURE" });
      }
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginRequest) => {
    try {
      console.log("DTA COMIGN INTO THE AUTH GUARD: ", credentials);
      // dispatch({ type: "AUTH_START" });
      const { user, token } = await authService.login(credentials);

      console.log("USER DETAILS:", user, token);

      dispatch({ type: "AUTH_SUCCESS", payload: { user, token } });
      wsService.connect(token);
      toast.success("Login successful!");
    } catch (error) {
      dispatch({ type: "AUTH_FAILURE" });
      toast.error(error instanceof Error ? error.message : "Login failed");
      throw error;
    }
  };

  const register = async (userData: RegisterRequest) => {
    try {
      dispatch({ type: "AUTH_START" });
      await authService.register(userData);
      // Don't auto-login after registration
      dispatch({ type: "AUTH_FAILURE" });
      toast.success("Registration successful! Please log in.");
    } catch (error) {
      dispatch({ type: "AUTH_FAILURE" });
      toast.error(
        error instanceof Error ? error.message : "Registration failed"
      );
      throw error;
    }
  };
  const logout = () => {
    authService.logout();
    wsService.disconnect();
    dispatch({ type: "LOGOUT" });
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
