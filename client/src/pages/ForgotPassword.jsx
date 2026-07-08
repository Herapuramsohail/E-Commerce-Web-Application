import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Mail, CheckCircle } from 'lucide-react';

const ForgotPassword = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = (formData) => {
    setIsSubmitting(true);
    // Simulate API request
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      toast.success('Reset code sent to ' + formData.email);
    }, 1000);
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-dark-900 transition-colors duration-300">
        
        {!isSubmitted ? (
          <>
            <div className="text-center">
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white">
                Forgot Password
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Enter your email address and we'll send you a link to reset your password.
              </p>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
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

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full justify-center rounded-lg bg-primary-600 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 focus:outline-none disabled:bg-primary-400"
              >
                {isSubmitting ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-4 space-y-4">
            <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
            <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white">
              Check Your Inbox
            </h2>
            <p className="text-sm text-slate-500">
              We've sent a simulated password recovery email. Normally, this email would contain a link to set a new password.
            </p>
            <div className="pt-4">
              <Link
                to="/reset-password?token=dummy_token_123"
                className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
              >
                Go to Reset Password Screen (Demo)
              </Link>
            </div>
          </div>
        )}

        <div className="text-center text-sm text-slate-500 mt-6">
          Back to{' '}
          <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-500">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
