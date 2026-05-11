import { Routes, Route, Navigate } from 'react-router-dom';

import { PrivateRoute } from './PrivateRoute';
import Settings from '../pages/Settings';
import Profile from '../pages/Profile';
import Deposit from '../pages/Deposit/Deposit';
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';
import Dashboard from '../pages/Dashboard/Dashboard';
import CompleteProfile from '../pages/Register/CompleteProfile';
import Transfer from '../pages/Transfer/Transfer';
import TransferHistory from '../pages/Transfer/TransferHistory';
import TransactionDetail from '../pages/Transfer/TransferDetail';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/deposit" element={<Deposit />} />
        <Route path="/transfer" element={<Transfer/>} />
        <Route path="/transfer-history" element={<TransferHistory/>} />
        <Route path="/transfer-detail/:id" element={<TransactionDetail />} />
        <Route path="/complete-profile" element={<CompleteProfile />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}