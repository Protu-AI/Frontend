import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Fingerprint } from 'lucide-react';

export function ForgotPasswordStep1() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center">
      <div className="bg-[#5F24E0] rounded-[24px] p-[15px] mb-[32px]">
        <Fingerprint className="w-[50px] h-[50px] text-white" />
      </div>
      <h1 className="font-['Archivo'] text-[32px] font-semibold text-center text-[#5F24E0]">
        Forgot Your Password?
      </h1>
      <p className="font-['Archivo'] text-base text-[#A6B5BB] text-center mt-[8px]">
        Don’t worry, we’ll help you reset it.
      </p>
      <div className="mt-[24px] relative w-[400px]">
        <Input
          type="email"
          placeholder="Enter Your Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={cn(
            "w-full h-[80px] rounded-[24px] border border-[#A6B5BB] bg-white font-['Archivo'] text-[16px] focus:outline-none",
            email ? "text-[#0E1117]" : "text-[#A6B5BB]",
            "pl-[77px]"
          )}
          style={{ fontFamily: 'Archivo', fontWeight: '400' }}
        />
        <div className="absolute top-1/2 transform -translate-y-1/2 text-[#A6B5BB] flex items-center" style={{ left: '32px' }}>
          {/* Email Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2Z" /><polyline points="22,6 12,13 2,6" /></svg>
          <div className="h-[30px] w-[1px] bg-[#A6B5BB]" style={{ marginLeft: '26px' }} />
        </div>
      </div>

      <Button className="mt-[24px] w-[400px] h-[80px] bg-[#5F24E0] hover:bg-[#9F7CEC] text-[#EFE9FC] font-['Archivo'] text-[22px] font-semibold rounded-[24px]" onClick={() => navigate('/forgot-password/step2')}>
        Send Reset Code
      </Button>
      <div
        className="mt-[24px] w-[400px] flex items-center justify-center"
      >
        <div className="flex-1 h-[1px] bg-[#A6B5BB]" />
        <span className="mx-[7px] font-['Archivo'] text-[16px] text-[#A6B5BB]">OR</span>
        <div className="flex-1 h-[1px] bg-[#A6B5BB]" />
      </div>
      <div
        className="mt-[24px]"
      >
        <Link
          to="/signin"
          className="font-['Archivo'] text-[16px] font-semibold text-[#5F24E0] hover:text-[#9F7CEC] transition-colors"
        >
          Back to Log in
        </Link>
      </div>
    </div>
  );
}
