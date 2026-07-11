import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../components/ui/Toast';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
export const Login = () => {
    const { login } = useApp();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const handleLogin = (e) => {
        e.preventDefault();
        const newErrors = {};
        if (!username && !email) {
            newErrors.username = 'Username or Email is required';
            newErrors.email = 'Username or Email is required';
        }
        if (email && !/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Invalid email address';
        }
        if (!password)
            newErrors.password = 'Password is required';
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            showToast('error', 'Login Failed', 'Please review all form fields');
            return;
        }
        setErrors({});
        setIsLoading(true);
        login(username, email, password)
            .then((success) => {
            setIsLoading(false);
            if (success) {
                showToast('success', 'Welcome Back!', `Logged in as ${username}`);
                navigate('/');
            }
            else {
                showToast('error', 'Login Error', 'Invalid credentials or login failed.');
            }
        })
            .catch((err) => {
            setIsLoading(false);
            showToast('error', 'Connection Error', 'Could not reach server.');
        });
    };
    return (<div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold font-outfit text-white">Sign in to console</h1>
        <p className="text-sm text-slate-400">
          Enter credentials below to enter the sandbox dashboard.
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4 text-slate-300">
        <Input label="Username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} error={errors.username} leftIcon={<User className="h-4 w-4"/>} placeholder="e.g. admin"/>

        <Input label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} leftIcon={<Mail className="h-4 w-4"/>} placeholder="e.g. admin@yourdomain.com"/>

        <div className="space-y-1">
          <Input label="Password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} leftIcon={<Lock className="h-4 w-4"/>} placeholder="••••••••" rightIcon={<button type="button" onClick={() => setShowPassword(!showPassword)} className="focus:outline-hidden hover:text-white text-slate-500 cursor-pointer transition-colors p-1" tabIndex="-1">
                {showPassword ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
              </button>}/>
          <div className="text-right">
            <Link to="/forgot-password" className="text-xs text-primary hover:text-blue-400 font-semibold">
              Forgot your password?
            </Link>
          </div>
        </div>

        <Button type="submit" className="w-full mt-2" isLoading={isLoading}>
          Login
        </Button>
      </form>

      <div className="text-center text-xs text-slate-500">
        Don't have an account?{' '}
        <Link to="/register" className="text-primary hover:text-blue-400 font-semibold">
          Register now
        </Link>
      </div>
    </div>);
};
