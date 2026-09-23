import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../features/auth/authSlice';
import { toast } from 'react-hot-toast';
import './Login.css';

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

  return (
    <div className="lp_root">

      {/* Animated background orbs */}
      <div className="lp_orb lp_orb1" />
      <div className="lp_orb lp_orb2" />
      <div className="lp_orb lp_orb3" />

      {/* Floating particles */}
      {[...Array(8)].map((_, i) => (
        <div key={i} className={`lp_particle lp_p${i + 1}`}>🪔</div>
      ))}

      <div className="lp_wrap">

        {/* ── BRAND SIDE ── */}
        <div className="lp_brand">
          <div className="lp_brand_inner">
            <div className="lp_mandir_icon">
              <span>🛕</span>
            </div>
            <h1 className="lp_brand_title">मंगलग्रह<br />मंदिर</h1>
            <p className="lp_brand_mantra">|| ॐ क्रां क्रीं क्रौं सः भौमाय नमः ||</p>

            <div className="lp_brand_badges">
              <span className="lp_badge">🕐 06 AM – 08 PM</span>
              <span className="lp_badge">📍 Amalner, M.S.</span>
              <span className="lp_badge">🙏 Est. 1933</span>
            </div>

            <div className="lp_quote">
              "A divine place to seek blessings, remove doshas<br />
              and bring peace, prosperity & protection."
            </div>
          </div>
        </div>

        {/* ── FORM SIDE ── */}
        <div className="lp_form_side">
          <div className="lp_glass_card">

            {/* Card glow ring */}
            <div className="lp_card_glow" />

            <div className="lp_form_header">
              <div className="lp_admin_badge">ADMIN PANEL</div>
              <h2>Welcome Back</h2>
              <p>Sign in to manage temple operations</p>
            </div>

            <form onSubmit={formik.handleSubmit} className="lp_form">

              {/* Email */}
              <div className="lp_field">
                <label>Email Address</label>
                <div className={`lp_input_box ${formik.touched.email && formik.errors.email ? 'lp_err_border' : ''}`}>
                  <svg viewBox="0 0 24 24" className="lp_field_icon"><path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" fill="currentColor"/></svg>
                  <input
                    type="email" name="email"
                    placeholder="admin@mangalgrah.com"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>
                {formik.touched.email && formik.errors.email && <p className="lp_err_msg">{formik.errors.email}</p>}
              </div>

              {/* Password */}
              <div className="lp_field">
                <label>Password</label>
                <div className={`lp_input_box ${formik.touched.password && formik.errors.password ? 'lp_err_border' : ''}`}>
                  <svg viewBox="0 0 24 24" className="lp_field_icon"><path d="M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5zm0 2a3 3 0 0 1 3 3v3H9V7a3 3 0 0 1 3-3zm0 9a2 2 0 1 1 0 4 2 2 0 0 1 0-4z" fill="currentColor"/></svg>
                  <input
                    type={showPass ? 'text' : 'password'} name="password"
                    placeholder="Enter your password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <button type="button" className="lp_eye_btn" onClick={() => setShowPass(!showPass)}>
                    {showPass
                      ? <svg viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/></svg>
                      : <svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" fill="none"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" fill="none"/></svg>
                    }
                  </button>
                </div>
                {formik.touched.password && formik.errors.password && <p className="lp_err_msg">{formik.errors.password}</p>}
              </div>

              <button type="submit" className="lp_submit_btn" disabled={isLoading}>
                {isLoading ? (
                  <><span className="lp_spin" /> Signing in...</>
                ) : (
                  <><span>Sign In</span> <span className="lp_btn_arrow">→</span></>
                )}
              </button>

            </form>

            <div className="lp_security_note">
              <svg viewBox="0 0 24 24" width="14" height="14"><path d="M12 2L4 6v6c0 5.5 3.8 10.7 8 12 4.2-1.3 8-6.5 8-12V6l-8-4z" fill="#22c55e"/></svg>
              SSL Secured · Authorized Access Only
            </div>

          </div>
        </div>

      </div>

      {/* Footer */}
      <div className="lp_footer">
        © {new Date().getFullYear()} Mangal Grah Mandir · Admin Portal
      </div>
    </div>
  );
};

export default Login;
