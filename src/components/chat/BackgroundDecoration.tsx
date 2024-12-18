import { motion } from 'framer-motion';
import { useThemeStore } from '../../store/themeStore';

export function BackgroundDecoration() {
  const theme = useThemeStore((state) => state.theme);

  return (
    <motion.div
      className="absolute right-0 bottom-0 z-0 pointer-events-none"
      initial={{ opacity: 1, x: 0, y: 0 }}
      exit={{ 
        opacity: 0, 
        x: 100, 
        y: 100,
        transition: { duration: 0.8, ease: "easeInOut" }
      }}
    >
      <div className={`w-[300px] h-[300px] ${
        theme === 'dark' ? 'bg-[#BFA7F3]' : 'bg-[#5F24E0]'
      } opacity-30 rounded-tl-full transform translate-x-1/4 translate-y-1/4`} />
    </motion.div>
  );
}