import { createContext, useState, useEffect } from "react";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
    // Load userInfo from localStorage on first render
    const [userInfo, setUserInfoState] = useState(() => {
        const stored = localStorage.getItem('userInfo');
        return stored ? JSON.parse(stored) : null;
    });

    // Sync userInfo to localStorage whenever it changes
    useEffect(() => {
        if (userInfo) {
            localStorage.setItem('userInfo', JSON.stringify(userInfo));
        } else {
            localStorage.removeItem('userInfo');
        }
    }, [userInfo]);

    // Wrap setUserInfo to update state
    const setUserInfo = (info) => {
        setUserInfoState(info);
    };

    return (
        <UserContext.Provider value={{ userInfo, setUserInfo }}>
            {children}
        </UserContext.Provider>
    );
}
