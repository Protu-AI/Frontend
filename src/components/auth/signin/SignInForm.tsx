import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SignInStepOne } from "./SignInStepOne";
import { SignInStepTwo } from "./SignInStepTwo";

export function SignInForm() {
  const [email, setEmail] = useState("");
  const [isStepTwo, setIsStepTwo] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const handleContinue = (email: string, imageUrl: string) => {
    setImageUrl(imageUrl);
    setEmail(email);
    setIsStepTwo(true);
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
  };

  const handleBack = () => {
    setIsStepTwo(false);
  };

  return (
    <div className="w-full max-w-[420px] mx-auto">
      <AnimatePresence mode="wait">
        {isStepTwo ? (
          <SignInStepTwo
            key="step-two"
            email={email}
            onBack={handleBack}
            imageUrl={imageUrl}
          />
        ) : (
          <SignInStepOne
            key="step-one"
            email={email}
            onEmailChange={handleEmailChange}
            onContinue={handleContinue}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
