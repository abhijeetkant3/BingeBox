import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import ThunderConvergence from "../components/ThunderConvergence";

function Signin() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      navigate("/");
    } catch (err) {
      console.error("Firebase Auth Error:", err.code, err.message);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError("Invalid email or password.");
      } else {
        setError("Failed to sign in. Please check your credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-white flex items-center justify-center overflow-hidden mesh-gradient">
      <button 
        onClick={() => navigate("/")}
        className="absolute top-10 left-6 md:left-12 z-50 flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full hover:bg-red-600 transition-all duration-300 group"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="text-sm font-bold tracking-widest uppercase">Back</span>
      </button>

      <div className="relative z-10 w-full max-w-md px-6 py-12">
        <ThunderConvergence>
          <div className="bg-black/40 backdrop-blur-3xl border border-red-600/30 rounded-3xl p-8 md:p-10 relative overflow-hidden group">
            <div className="relative z-20 text-center mb-10">
              <h2 className="text-4xl font-black tracking-tighter uppercase mb-2">
                Welcome <span className="text-[#dc2626]">Back</span>
              </h2>
              <p className="text-gray-400 text-sm font-medium tracking-wide">
                Sign in to continue your binge.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="relative z-20 space-y-6">
              {error && (
                <div className="p-3 bg-red-600/20 border border-red-600/50 rounded-xl text-red-500 text-xs font-bold text-center animate-shake">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-2 ml-1">Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 outline-none focus:border-red-600/50 focus:bg-white/10 transition-all text-sm font-medium"
                  placeholder="hello@example.com"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-2 ml-1">Password</label>
                <div className="relative group/input">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 pr-12 outline-none focus:border-red-600/50 focus:bg-white/10 transition-all text-sm font-medium"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-600 transition-colors focus:outline-none"
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.046m4.577-2.771A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21m-2.101-2.101L3 3m9 3.5a3 3 0 100 6 3 3 0 000-6z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268-2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-4 mt-4 rounded-xl font-black uppercase tracking-widest text-sm transition-all flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : "Sign In"}
              </button>
            </form>

            <div className="relative z-20 text-center mt-8">
              <p className="text-gray-500 text-xs font-medium">
                Don't have an account?{" "}
                <Link to="/signup" className="text-white hover:text-red-600 transition-colors font-bold">
                  Create Account
                </Link>
              </p>
            </div>
          </div>
        </ThunderConvergence>
      </div>
    </div>
  );
}

export default Signin;
