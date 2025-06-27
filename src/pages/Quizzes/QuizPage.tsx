import { useState, useEffect } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { prism } from "react-syntax-highlighter/dist/esm/styles/prism";

/*
INTEGRATION GUIDE FOR QUIZ COMPONENTS:

1. DATA STRUCTURE:
   Your backend should return quiz data matching the Question[] interface below.

2. BACKEND INTEGRATION:
   Replace the sample quizData with your API call:
   
   const [quizData, setQuizData] = useState<Question[]>([]);
   
   useEffect(() => {
     const fetchQuiz = async () => {
       const response = await fetch('/api/quiz/123');
       const data = await response.json();
       setQuizData(data.questions);
     };
     fetchQuiz();
   }, []);

3. ANSWER SUBMISSION:
   The selectedAnswers state contains all user selections:
   - Key: questionId
   - Value: choiceId
   
   Submit format: { "q1": "q1_b", "q2": "q2_a", "q3": "q3_c" }

4. QUESTION TYPES SUPPORTED:
   - 'multiple_choice': Vertical list of choices
   - 'true_false': Horizontal True/False options (full width)
   
5. CODE BLOCKS:
   Optional codeBlock field supports any language with syntax highlighting.
   
6. STYLING:
   All styling is self-contained. No additional CSS needed.
*/

// Types for quiz data - Use these for backend integration
interface Choice {
  id: string;
  text: string;
}

interface Question {
  id: string;
  questionNumber: number;
  questionText: string;
  type: 'multiple_choice' | 'true_false';
  choices: Choice[];
  codeBlock?: {
    language: string; // e.g., 'javascript', 'python', 'html', 'css'
    code: string;
  };
}

// Quiz data interface for complete quiz
interface QuizData {
  id: string;
  title: string;
  timeLimit: number; // in seconds
  questions: Question[];
}

// Clock Icon Component
const ClockIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="text-[#DC2626]"
    strokeWidth="2"
  >
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 6V12L16 14"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Choice Component
interface ChoiceProps {
  choice: Choice;
  isSelected: boolean;
  onClick: () => void;
  isTrueFalse?: boolean;
}

const QuizChoice = ({ choice, isSelected, onClick, isTrueFalse = false }: ChoiceProps) => (
  <label 
    onClick={onClick}
    className={`flex items-center border-2 rounded-[24px] py-[24px] px-[32px] cursor-pointer transition-all duration-200 ${
      isTrueFalse ? 'flex-1' : ''
    } ${
      isSelected 
        ? 'border-[#5F24E0] bg-[#EFE9FC]' 
        : 'border-[#A6B5BB] hover:border-[#5F24E0] hover:bg-[#EFE9FC]'
    }`}
  >
    <div className={`w-[32px] h-[32px] border-2 rounded-full flex items-center justify-center ${
      isSelected ? 'border-[#5F24E0]' : 'border-[#A6B5BB]'
    }`}>
      <div className={`w-[16px] h-[16px] bg-[#5F24E0] rounded-full ${
        isSelected ? 'block' : 'hidden'
      }`}></div>
    </div>
    <div className="w-[16px]" />
    <span className={`font-['Archivo'] text-[28px] font-normal ${
      isSelected ? 'text-[#5F24E0]' : 'text-[#1C0B43]'
    }`}>{choice.text}</span>
  </label>
);

// Question Component
interface QuestionProps {
  question: Question;
  selectedAnswer: string | undefined;
  onAnswerSelect: (questionId: string, choiceId: string) => void;
}

const QuizQuestion = ({ question, selectedAnswer, onAnswerSelect }: QuestionProps) => (
  <div 
    className="bg-[#FFFFFF] rounded-[32px] p-[32px] mb-[64px]"
    style={{ boxShadow: "0px 3px 12px #00000029" }}
  >
    {/* Question Header */}
    <div className="flex items-center">
      <div className="bg-[#EFE9FC] rounded-full px-[14px] py-[6.4px] flex items-center justify-center">
        <span className="font-['Archivo'] text-[28px] font-semibold text-[#5F24E0]">
          {question.questionNumber}
        </span>
      </div>
      <div className="w-[16px]" />
      <h3 className="font-['Archivo'] text-[28px] font-semibold text-[#1C0B43] text-left">
        {question.questionText}
      </h3>
    </div>
    
    {/* 32px spacing */}
    <div className="mb-[32px]" />
    
    {/* Code Block (if exists) */}
    {question.codeBlock && (
              <div className="bg-[#EFE9FC] rounded-[8px] p-[24px] mt-0 mb-[24px]">
          <style dangerouslySetInnerHTML={{
            __html: `
              .quiz-code-block code,
              .quiz-code-block pre,
              .quiz-code-block * {
                font-family: 'Archivo', sans-serif !important;
                font-weight: 500 !important;
                font-size: 16px !important;
                text-align: left !important;
              }
            `
          }} />
          <SyntaxHighlighter
            style={prism}
            language={question.codeBlock.language}
            PreTag="div"
            className="quiz-code-block !bg-[#FFFFFF] border-l-[8px] border-[#5F24E0] px-[32px] py-[12px] !mt-0 !mb-[24px]"
          >
          {question.codeBlock.code}
        </SyntaxHighlighter>
      </div>
    )}
    
    {/* Choices */}
    <div className={question.type === 'true_false' ? 'flex gap-[16px]' : 'space-y-[16px]'}>
      {question.choices.map((choice) => (
        <QuizChoice
          key={choice.id}
          choice={choice}
          isSelected={selectedAnswer === choice.id}
          onClick={() => onAnswerSelect(question.id, choice.id)}
          isTrueFalse={question.type === 'true_false'}
        />
      ))}
    </div>
  </div>
);

export function QuizPage() {
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes in seconds
  
  // Sample quiz data - REPLACE WITH YOUR API CALL
  // Example: const [quizData, setQuizData] = useState<Question[]>([]);
  // Then fetch data: useEffect(() => { fetchQuizData().then(setQuizData); }, []);
  const [quizData, setQuizData] = useState<Question[]>([
    {
      id: 'q1',
      questionNumber: 1,
      questionText: 'Which of the following is NOT a JavaScript data type?',
      type: 'multiple_choice',
      choices: [
        { id: 'q1_a', text: 'String' },
        { id: 'q1_b', text: 'Float' },
        { id: 'q1_c', text: 'Number' },
        { id: 'q1_d', text: 'Boolean' }
      ]
    },
    {
      id: 'q2',
      questionNumber: 2,
      questionText: 'JavaScript is a compiled programming language.',
      type: 'true_false',
      choices: [
        { id: 'q2_a', text: 'True' },
        { id: 'q2_b', text: 'False' }
      ]
    },
    {
      id: 'q3',
      questionNumber: 3,
      questionText: 'What will be the output of the following code?',
      type: 'multiple_choice',
      choices: [
        { id: 'q3_a', text: '"object" "undefined"' },
        { id: 'q3_b', text: '"null" "undefined"' },
        { id: 'q3_c', text: '"object" "object"' }
      ],
      codeBlock: {
        language: 'javascript',
        code: `console.log(typeof null);\nconsole.log(typeof undefined);`
      }
    }
  ]);
  
  // State for selected answers
  const [selectedAnswers, setSelectedAnswers] = useState<{[key: string]: string}>({});
  
  // Handle answer selection
  const handleAnswerSelect = (questionId: string, choiceId: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: choiceId
    }));
  };
  
  // Calculate questions remaining
  const questionsRemaining = quizData.length - Object.keys(selectedAnswers).length;
  
  // Submit quiz answers - CUSTOMIZE THIS FOR YOUR BACKEND
  const handleSubmitQuiz = async () => {
    try {
      // Example API call structure:
      // const response = await fetch('/api/quiz/submit', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     quizId: 'current_quiz_id',
      //     answers: selectedAnswers,
      //     timeSpent: 180 - timeLeft
      //   })
      // });
      // const result = await response.json();
      // Navigate to results page: navigate('/quiz/results', { state: result });
      
      console.log('Quiz submitted:', {
        answers: selectedAnswers,
        timeSpent: 180 - timeLeft,
        questionsAnswered: Object.keys(selectedAnswers).length,
        totalQuestions: quizData.length
      });
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };

  // Timer countdown effect
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Top Fixed Line */}
      <div 
        className="h-[130px] bg-white flex items-center justify-between px-[128px] py-[32px] fixed top-0 left-0 right-0 z-10"
        style={{ boxShadow: "0px 2px 12px #00000029" }}
      >
        {/* Left Side - Quiz Title and Instruction */}
        <div className="flex flex-col justify-center">
          <h1 className="font-['Archivo'] text-[32px] font-bold text-[#5F24E0] text-left">
            JavaScript Fundamentals for Web Development
          </h1>
          <div className="mb-[8px]" />
          <p className="font-['Archivo'] text-[22px] font-normal text-[#A6B5BB] text-left">
            Answer all questions before the time runs out
          </p>
        </div>

        {/* Right Side - Timer */}
        <div className="flex items-center justify-center bg-[#FEE2E2] rounded-[25px] px-[32px] py-[12px]">
          <ClockIcon />
          <div className="w-[8px]" />
          <span className="font-['Archivo'] text-[24px] font-medium text-[#DC2626] text-left">
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      {/* Middle Scrollable Content */}
      <div className="flex-1 bg-white px-[128px] py-[32px] mt-[130px] mb-[130px] overflow-y-auto">
        {/* Quiz Content */}
        <div className="flex flex-col">
          {/* 64px spacing before first question */}
          <div className="mb-[64px]" />
          
          {/* Render Questions Dynamically */}
          {quizData.map((question) => (
            <QuizQuestion
              key={question.id}
              question={question}
              selectedAnswer={selectedAnswers[question.id]}
              onAnswerSelect={handleAnswerSelect}
            />
          ))}
          
          {/* 64px spacing after last question */}
          <div className="mb-[64px]" />
        </div>
      </div>

      {/* Bottom Fixed Line */}
      <div 
        className="h-[130px] bg-white flex items-center justify-between px-[128px] py-[32px] fixed bottom-0 left-0 right-0 z-10"
        style={{ boxShadow: "0px -2px 6px #00000029" }}
      >
        {/* Left Side - Questions Remaining */}
        <p className="font-['Archivo'] text-[22px] font-normal text-[#A6B5BB] text-left">
          {questionsRemaining} questions remaining
        </p>

        {/* Right Side - Submit Button */}
        <button 
          onClick={handleSubmitQuiz}
          className="bg-[#5F24E0] hover:bg-[#9F7CEC] text-[#EFE9FC] font-['Archivo'] text-[28px] font-semibold rounded-[24px] py-[16px] px-[32px] transition-all duration-200"
        >
          Submit
        </button>
      </div>
    </div>
  );
} 