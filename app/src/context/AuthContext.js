import axios from 'axios';
import React, { createContext, useState } from 'react';
import { useHistory } from 'react-router-dom';

const AuthContext = createContext();
const { Provider } = AuthContext;

const AuthProvider = ({ children }) => {
    const history = useHistory();
    const token = localStorage.getItem('token');
    const userInfo = localStorage.getItem('userInfo');

    const [authState, setAuthState] = useState({
        token: token,
        userInfo: userInfo ? JSON.parse(userInfo) : {},
    });

    const setAuthInfo = ({ token, userInfo, expiresAt, eCATtoken }) => {
        localStorage.setItem('token', token);
        localStorage.setItem(
            'userInfo',
            JSON.stringify(userInfo)
        );

        setAuthState({
            token,
            userInfo,
        });
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        setAuthState({});
        history.push('/login');
    };

    const isAuthenticated = () => {
        if (!authState.token) {
            return false;
        }
        return true;
    };

    return (
        <Provider
            value={{
                authState,
                setAuthState: authInfo => setAuthInfo(authInfo),
                logout,
                isAuthenticated,
            }}
        >
            {children}
        </Provider>
    );
};

export { AuthContext, AuthProvider };