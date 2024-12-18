import { useThemeStore } from '../../store/themeStore';

interface WelcomeMessageProps {
  username: string;
}

export function WelcomeMessage({ username }: WelcomeMessageProps) {
  const theme = useThemeStore((state) => state.theme);
  
  return (
    <div className="text-center space-y-1">
      <p className={`font-archivo font-normal text-[16px] leading-[17px] ${
        theme === 'dark' ? 'text-[#EFE9FC]' : 'text-[#ABABAB]'
      }`}>
        Welcome, {username}!
      </p>
      <h1 className={`font-archivo font-semibold text-[30px] leading-[32px] ${
        theme === 'dark' ? 'text-[#BFA7F3]' : 'text-[#5F24E0]'
      }`}>
        What can I help with?
      </h1>
    </div>
  );
}