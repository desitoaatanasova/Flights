import { motion } from 'framer-motion';
import NavBar from './NavBar';
import Footer from './Footer';

export default function PageLayout({ children }) {
  return (
    <>
      <NavBar />
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="min-h-screen"
      >
        {children}
      </motion.main>
      <Footer />
    </>
  );
}
