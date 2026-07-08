import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Eye, EyeOff } from 'lucide-react';

const Register = () => {
  const { register: registerAuth } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const passwordVal = watch('password');

  const onSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      await registerAuth(formData.name, formData.email, formData.password);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-dark-900 transition-colors duration-300">
        
        {/* Title */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white">
            Create Account
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Sign up to get started on ShopSphere.
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Full Name
              </label>
              <input
                type="text"
                {...register('name', { required: 'Name is required' })}
                className={`mt-1.5 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none dark:bg-dark-800 dark:text-white ${
                  errors.name
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-slate-300 focus:border-primary-500 dark:border-slate-700'
                }`}
                placeholder="John Doe"
              />
              {errors.name && (
                <span className="mt-1 block text-xs text-red-500">{errors.name.message}</span>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Email Address
              </label>
              <input
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Please enter a valid email address'
                  }
                })}
                className={`mt-1.5 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none dark:bg-dark-800 dark:text-white ${
                  errors.email
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-slate-300 focus:border-primary-500 dark:border-slate-700'
                }`}
                placeholder="you@example.com"
              />
              {errors.email && (
                <span className="mt-1 block text-xs text-red-500">{errors.email.message}</span>
              )}
            </div>

            {/* Password Field */}
            <div className="relative">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Password
              </label>
              <div className="mt-1.5 relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                  className={`w-full rounded-lg border px-3 py-2 pr-10 text-sm focus:outline-none dark:bg-dark-800 dark:text-white ${
                    errors.password
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-slate-300 focus:border-primary-500 dark:border-slate-700'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
              {errors.password && (
                <span className="mt-1 block text-xs text-red-500">{errors.password.message}</span>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Confirm Password
              </label>
              <input
                type="password"
                {...register('confirmPassword', {
                  required: 'Confirm password is required',
                  validate: (val) => val === passwordVal || 'Passwords do not match'
                })}
                className={`mt-1.5 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none dark:bg-dark-800 dark:text-white ${
                  errors.confirmPassword
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-slate-300 focus:border-primary-500 dark:border-slate-700'
                }`}
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <span className="mt-1 block text-xs text-red-500">{errors.confirmPassword.message}</span>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full justify-center rounded-lg bg-primary-600 py-2.5 mt-4 text-sm font-semibold text-white hover:bg-primary-700 focus:outline-none disabled:bg-primary-400"
          >
            {isSubmitting ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="text-center text-sm text-slate-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-500">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
