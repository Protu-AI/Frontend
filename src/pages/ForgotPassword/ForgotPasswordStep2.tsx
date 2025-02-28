import { Mail } from 'lucide-react';
    import { Button } from '@/components/ui/button';
    import { cn } from '@/lib/utils';
    import { useState, useRef, useEffect } from 'react';
    import { motion, useAnimation } from 'framer-motion';
    import { Link, useNavigate } from 'react-router-dom';
    import { ForgotPasswordHeader } from '@/components/ForgotPassword/ForgotPasswordHeader';
    import { ForgotPasswordFooter } from '@/components/ForgotPassword/ForgotPasswordFooter';

    export function ForgotPasswordStep2() {
      const [code, setCode] = useState('');
      const navigate = useNavigate();
      const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

      const handleVerify = () => {
        // Verification logic here
        navigate('/forgot-password/step3');
      };

      const handleInput = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (!/^\d*$/.test(value)) return;

        const newCode = code.substring(0, index) + value + code.substring(index + 1);
        setCode(newCode);

        if (value && index < 5) {
          inputRefs.current[index + 1]?.focus();
        }
      };

      const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
          inputRefs.current[index - 1]?.focus();
        }
      };

      const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.3 } }
      };

      return (
        <div className="flex h-screen w-full flex-col bg-gradient-to-b from-white via-[#F9F6FE] to-[#F5F0FD] dark:from-[#1C0B43] dark:to-[#1C0B43]">
          <ForgotPasswordHeader />
          <motion.div
            className="flex-1 flex items-center justify-center flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { staggerChildren: 0.1 } }}
            exit={{ opacity: 0, y: 20 }}
          >
            <motion.div 
              className="flex flex-col items-center"
              variants={fadeIn}
            >
              <motion.div 
                className="bg-[#5F24E0] rounded-[24px] p-[15px]"
                variants={fadeIn}
              >
                <Mail className="w-[50px] h-[50px] text-white" />
              </motion.div>
              <motion.div 
                className="mt-[32px] flex flex-col items-center"
                variants={fadeIn}
              >
                <h1 className="font-['Archivo'] text-[32px] font-semibold text-center text-[#5F24E0]">
                  Verify Your Email
                </h1>
                <p className="font-['Archivo'] text-base text-[#A6B5BB] text-center mt-[8px]">
                  A reset code has been sent to <span className="text-[#5F24E0]">mahmoudelkholy@protu.com</span>
                </p>
              </motion.div>
              <motion.div 
                className="mt-[32px] flex flex-col items-center"
                variants={fadeIn}
              >
                <p className="font-['Archivo'] text-[20px] text-[#5F24E0] text-center">
                  Enter the 6-digit code
                </p>
              </motion.div>
              <motion.div 
                className="mt-[32px]"
                variants={fadeIn}
              >
                {/* Verification Code Inputs */}
                <div className="flex gap-4">
                  {Array(6).fill(null).map((_, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength={1}
                      ref={el => inputRefs.current[index] = el}
                      value={code[index] || ''}
                      onChange={(e) => handleInput(index, e)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className={cn(
                        "w-[59px] h-[64px] rounded-[12px] border border-[#A6B5BB] bg-white font-['Archivo'] text-[48px] text-center",
                        code[index] ? "text-[#5F24E0] border-[#5F24E0]" : "text-[#A6B5BB]"
                      )}
                    />
                  ))}
                </div>
              </motion.div>
              <motion.div 
                variants={fadeIn}
              >
                <Button className="mt-[32px] w-[400px] h-[80px] bg-[#5F24E0] hover:bg-[#9F7CEC] text-[#EFE9FC] font-['Archivo'] text-[22px] font-semibold rounded-[24px]" onClick={handleVerify}>
                  Continue
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
          <ForgotPasswordFooter step={2} />
        </div >
      );
    }
