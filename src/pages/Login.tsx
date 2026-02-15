import { useState, type FC, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineArrowRight, HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import SEO from '../components/SEO';
import { useAuth } from '../context/AuthContext';

const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/admin');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur de connexion');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--lv-cream)] flex items-center justify-center px-4 py-20">
      <SEO
        title="Connexion"
        description="Connectez-vous à votre compte Africa Market."
        noindex
      />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full max-w-[440px]"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <Link to="/">
            <motion.img
              whileHover={{ scale: 1.04 }}
              src="/africamarket-logo.jpg"
              alt="Africa Market"
              className="h-16 sm:h-20 w-auto object-contain mx-auto mb-2"
            />
          </Link>
          <div className="w-12 h-[2px] bg-[var(--lv-gold)] mx-auto mt-4 mb-6" />
          <p className="text-[11px] tracking-[0.2em] uppercase text-[var(--lv-grey)] font-light">
            Connexion à votre compte
          </p>
        </div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-white p-8 sm:p-10 border border-[var(--lv-border)]"
        >
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 mb-6 text-[12px] tracking-wide"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-[var(--lv-grey)] font-medium mb-2">
                Adresse email
              </label>
              <div className="relative">
                <HiOutlineMail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--lv-grey)]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3.5 border border-[var(--lv-border)] text-[13px] text-[var(--lv-black)] font-light tracking-wide bg-transparent outline-none focus:border-[var(--lv-gold)] transition-colors duration-300"
                  placeholder="votre@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-[var(--lv-grey)] font-medium mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <HiOutlineLockClosed size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--lv-grey)]" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-11 pr-11 py-3.5 border border-[var(--lv-border)] text-[13px] text-[var(--lv-black)] font-light tracking-wide bg-transparent outline-none focus:border-[var(--lv-gold)] transition-colors duration-300"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--lv-grey)] hover:text-[var(--lv-black)] transition-colors"
                >
                  {showPassword ? <HiOutlineEyeOff size={16} /> : <HiOutlineEye size={16} />}
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="lv-btn lv-btn-filled w-full justify-center gap-2 !py-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="text-[11px] tracking-[0.2em]">Connexion...</span>
              ) : (
                <>
                  <span className="text-[11px] tracking-[0.2em]">Se connecter</span>
                  <HiOutlineArrowRight size={14} />
                </>
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-center mt-8"
        >
          <p className="text-[12px] text-[var(--lv-grey)] font-light">
            Pas encore de compte ?{' '}
            <Link
              to="/register"
              className="text-[var(--lv-black)] font-medium tracking-wide hover:text-[var(--lv-gold)] transition-colors underline underline-offset-4"
            >
              Créer un compte
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
