import { useState, type FC, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineUser, HiOutlineArrowRight } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Register: FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await register(name, email, password);
      toast.success('Compte créé avec succès !');
      navigate('/login');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'inscription");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--lv-cream)] flex items-center justify-center px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full max-w-[440px]"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <Link to="/">
            <motion.h1
              whileHover={{ scale: 1.02 }}
              className="text-[22px] font-semibold tracking-[0.35em] uppercase text-[var(--lv-black)] mb-2"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Africa Market
            </motion.h1>
          </Link>
          <div className="w-12 h-[2px] bg-[var(--lv-gold)] mx-auto mt-4 mb-6" />
          <p className="text-[11px] tracking-[0.2em] uppercase text-[var(--lv-grey)] font-light">
            Créer votre compte
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
                Nom complet
              </label>
              <div className="relative">
                <HiOutlineUser size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--lv-grey)]" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3.5 border border-[var(--lv-border)] text-[13px] text-[var(--lv-black)] font-light tracking-wide bg-transparent outline-none focus:border-[var(--lv-gold)] transition-colors duration-300"
                  placeholder="Votre nom"
                />
              </div>
            </div>

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
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full pl-11 pr-4 py-3.5 border border-[var(--lv-border)] text-[13px] text-[var(--lv-black)] font-light tracking-wide bg-transparent outline-none focus:border-[var(--lv-gold)] transition-colors duration-300"
                  placeholder="••••••••"
                />
              </div>
              <p className="text-[10px] text-[var(--lv-grey)] mt-2 font-light">
                Minimum 6 caractères
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="lv-btn lv-btn-filled w-full justify-center gap-2 !py-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="text-[11px] tracking-[0.2em]">Inscription...</span>
              ) : (
                <>
                  <span className="text-[11px] tracking-[0.2em]">Créer mon compte</span>
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
            Déjà un compte ?{' '}
            <Link
              to="/login"
              className="text-[var(--lv-black)] font-medium tracking-wide hover:text-[var(--lv-gold)] transition-colors underline underline-offset-4"
            >
              Se connecter
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register;
