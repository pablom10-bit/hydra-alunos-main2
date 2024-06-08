import React from 'react';
import { Route, BrowserRouter, Navigate, Routes } from 'react-router-dom';
import Login from './public/Login/Login';
import Dashboard from './private/Dashboard/Dashboard';
import Users from './private/Users/Users';
import Limits from './private/Limits/Limits';
import Settings from './private/Settings/Settings'
import Logs from './private/Logs/Logs';
import Symbols from './private/Symbols/Symbols';
import TelegramChat from './private/Users/TelegramChat';

function Router() {

    function PrivateRoute({ children }) {
        const isAuth = localStorage.getItem("token") !== null;
        return isAuth ? children : <Navigate to="/" />;
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" exact element={<Login />} />
                <Route path="/settings" element={
                    <PrivateRoute>
                        <Settings />
                    </PrivateRoute>
                } />
                <Route path="/dashboard" element={
                    <PrivateRoute>
                        <Dashboard />
                    </PrivateRoute>
                } />
                <Route path="/symbols" element={
                    <PrivateRoute>
                        <Symbols />
                    </PrivateRoute>
                } />
                <Route path="/logs" element={
                    <PrivateRoute>
                        <Logs />
                    </PrivateRoute>
                } />
                <Route path="/users" element={
                    <PrivateRoute>
                        <Users />
                    </PrivateRoute>
                } />
                <Route path="/limits" element={
                    <PrivateRoute>
                        <Limits />
                    </PrivateRoute>
                } />
                <Route path="/telegram-chat" element={
                    <PrivateRoute>
                        <TelegramChat />
                    </PrivateRoute>
                } />
            </Routes>
        </BrowserRouter>
    )
}

export default Router;