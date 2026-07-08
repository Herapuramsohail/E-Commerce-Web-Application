import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Key } from 'lucide-react';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const passwordVal = watch('password');

  const onSubmit = (formData) => {
    setIsSubmitting(true);
    // Simulate API reset request
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Password reset completed successfully!');
      navigate('/login');
    }, 1200);
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-dark-900 transition-colors duration-300">
        
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white">
            Reset Password
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Set your new account password.
          </p>
        </div>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            
            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                New Password
              </label>
              <input
                type="password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                })}
                className={`mt-1.5 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none dark:bg-dark-800 dark:text-white ${
                  errors.password
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-slate-300 focus:border-primary-500 dark:border-slate-700'
                }`}
                placeholder="••••••••"
              />
              {errors.password && (
                <span className="mt-1 block text-xs text-red-500">{errors.password.message}</span>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Confirm New Password
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
            className="flex w-full justify-center rounded-lg bg-primary-600 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 focus:outline-none disabled:bg-primary-400"
          >
            {isSubmitting ? 'Resetting...' : 'Save Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
