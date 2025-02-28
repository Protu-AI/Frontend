import { ForgotPasswordHeader } from "@/components/ForgotPassword/ForgotPasswordHeader";
    import { ForgotPasswordFooter } from "@/components/ForgotPassword/ForgotPasswordFooter";
    import { motion } from 'framer-motion';

    export function ForgotPasswordStep3() {
      const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.3 } }
      };

      return (
        <div 
          className="flex h-screen w-full flex-col bg-gradient-to-b from-white via-[#F9F6FE] to-[#F5F0FD] dark:from-[#1C0B43] dark:to-[#1C0B43]"
        >
          <ForgotPasswordHeader />
          <motion.div 
            className="flex-1 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { staggerChildren: 0.1 } }}
            exit={{ opacity: 0, y: 20 }}
          >
            <div>
              Step 3 Content
            </div>
          </motion.div>
          <ForgotPasswordFooter step={3} />
        </div >
      );
    }
