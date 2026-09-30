import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../features/auth/authSlice';
import { toast } from 'react-hot-toast';

const Schema = yup.object().shape({
  email: yup.string().email('Enter a valid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: Schema,
    onSubmit: (values) => { dispatch(login(values)); },
  });

  const { isLoading, isError, isSuccess, message } = useSelector((s) => s.auth);

  useEffect(() => {
    if (isSuccess) { toast.success('Welcome back! 🙏'); navigate('/admin'); }
    if (isError)   { toast.error(message?.message || 'Invalid credentials'); }
  }, [isSuccess, isError]);

  const inputBox = (hasErr) =>
    `flex items-center gap-3 rounded-xl border bg-white px-3.5 transition focus-within:ring-4 ${
      hasErr
        ? 'border-red-400 focus-within:border-red-500 focus-within:ring-red-500/15'
        : 'border-maroon/15 focus-within:border-sindoor focus-within:ring-sindoor/15'
    }`;

  return (
    <div className="relative isolate flex min-h-svh flex-col overflow-hidden bg-maroon">

      {/* Ambient glow */}
      <div className="pointer-events-none absolute -left-32 -top-32 -z-10 size-[28rem] rounded-full bg-crimson/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-24 -z-10 size-[30rem] rounded-full bg-gold/25 blur-3xl" />

      <div className="mx-auto grid w-full max-w-6xl flex-1 items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:gap-16">

        {/* ── BRAND SIDE ── */}
        <div className="text-center text-white lg:text-left">
          <div className="mx-auto mb-5 grid size-20 place-items-center rounded-3xl border border-gold/40 bg-white/5 text-4xl shadow-[0_0_0_8px_rgba(233,185,73,0.08)] lg:mx-0 lg:size-24 lg:text-5xl">
            <span>🛕</span>
          </div>
          <h1 className="font-display text-4xl leading-tight sm:text-5xl lg:text-6xl">
            मंगलग्रह <br className="hidden lg:block" />मंदिर
          </h1>
          <p className="mt-4 font-display text-base text-gold-soft sm:text-lg">|| ॐ क्रां क्रीं क्रौं सः भौमाय नमः ||</p>

          <div className="mt-6 hidden flex-wrap gap-2.5 sm:flex lg:justify-start">
            <span className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm text-white/85">🕐 06 AM – 08 PM</span>
            <span className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm text-white/85">📍 Amalner, M.S.</span>
            <span className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm text-white/85">🙏 Est. 1933</span>
          </div>

          <p className="mt-6 hidden max-w-md leading-7 text-white/70 lg:block">
            "A divine place to seek blessings, remove doshas
            and bring peace, prosperity & protection."
          </p>
        </div>

        {/* ── FORM SIDE ── */}
        <div className="mx-auto w-full max-w-md">
          <div className="rounded-3xl bg-linear-to-br from-gold via-sindoor to-gold p-px shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)]">
            <div className="rounded-[calc(1.5rem-1px)] bg-paper p-6 sm:p-9">

              <div className="mb-7">
                <span className="inline-block rounded-full bg-sindoor/10 px-3 py-1 text-xs font-bold tracking-widest text-sindoor">ADMIN PANEL</span>
                <h2 className="mt-3 font-display text-3xl text-maroon">Welcome Back</h2>
                <p className="mt-1 text-muted">Sign in to manage temple operations</p>
              </div>

              <form onSubmit={formik.handleSubmit} className="space-y-5" noValidate>

                {/* Email */}
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-maroon-2">Email Address</label>
                  <div className={inputBox(formik.touched.email && formik.errors.email)}>
                    <svg viewBox="0 0 24 24" className="size-5 shrink-0 text-muted"><path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" fill="currentColor"/></svg>
                    <input
                      type="email" name="email"
                      autoComplete="username"
                      placeholder="admin@mangalgrah.com"
                      className="min-h-12 w-full bg-transparent text-base text-ink outline-none placeholder:text-muted/60"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </div>
                  {formik.touched.email && formik.errors.email && <p className="mt-1.5 text-sm text-red-600">{formik.errors.email}</p>}
                </div>

                {/* Password */}
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-maroon-2">Password</label>
                  <div className={inputBox(formik.touched.password && formik.errors.password)}>
                    <svg viewBox="0 0 24 24" className="size-5 shrink-0 text-muted"><path d="M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5zm0 2a3 3 0 0 1 3 3v3H9V7a3 3 0 0 1 3-3zm0 9a2 2 0 1 1 0 4 2 2 0 0 1 0-4z" fill="currentColor"/></svg>
                    <input
                      type={showPass ? 'text' : 'password'} name="password"
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      className="min-h-12 w-full bg-transparent text-base text-ink outline-none placeholder:text-muted/60"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    <button type="button" className="grid size-9 shrink-0 place-items-center rounded-lg text-muted transition hover:bg-maroon/5 hover:text-maroon" onClick={() => setShowPass(!showPass)} aria-label={showPass ? 'Hide password' : 'Show password'}>
                      {showPass
                        ? <svg viewBox="0 0 24 24" className="size-5"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/></svg>
                        : <svg viewBox="0 0 24 24" className="size-5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" fill="none"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" fill="none"/></svg>
                      }
                    </button>
                  </div>
                  {formik.touched.password && formik.errors.password && <p className="mt-1.5 text-sm text-red-600">{formik.errors.password}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-linear-to-b from-crimson to-sindoor text-base font-bold text-white shadow-glow transition hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isLoading ? (
                    <><span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" /> Signing in...</>
                  ) : (
                    <><span>Sign In</span> <span>→</span></>
                  )}
                </button>

              </form>

              <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted">
                <svg viewBox="0 0 24 24" width="14" height="14"><path d="M12 2L4 6v6c0 5.5 3.8 10.7 8 12 4.2-1.3 8-6.5 8-12V6l-8-4z" fill="#22c55e"/></svg>
                SSL Secured · Authorized Access Only
              </div>

            </div>
          </div>
        </div>

      </div>

      {/* Footer */}
      <div className="px-4 pb-6 text-center text-sm text-white/55">
        © {new Date().getFullYear()} Mangal Grah Mandir · Admin Portal
      </div>
    </div>
  );
};

export default Login;
