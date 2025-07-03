import React, { useState } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { Clock, Check, X, Lightbulb, BookOpen, Clock as ClockIcon, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { prism } from "react-syntax-highlighter/dist/esm/styles/prism";

interface QuizFeedbackProps {
  score?: number;
  timeSpent?: string;
  correctAnswers?: number;
  incorrectAnswers?: number;
}

interface CourseCardProps {
  icon: string;
  title: string;
  lessons: number;
  hours: number;
  description: string;
  alt: string;
}

interface Choice {
  id: string;
  text: string;
}

interface QuestionData {
  id: string;
  questionNumber: number;
  questionText: string;
  type: 'multiple_choice' | 'true_false';
  choices: Choice[];
  correctAnswerId: string;
  userAnswerId?: string;
  status: 'correct' | 'incorrect' | 'no-answer';
  codeBlock?: {
    language: string;
    code: string;
  };
}

interface QuestionItemProps {
  question: QuestionData;
  isOpen: boolean;
  onToggle: () => void;
}

// Choice Component for Feedback
interface FeedbackChoiceProps {
  choice: Choice;
  isCorrectAnswer: boolean;
  isUserAnswer: boolean;
  status: 'correct' | 'incorrect' | 'no-answer';
  isTrueFalse?: boolean;
}

const FeedbackChoice = ({ choice, isCorrectAnswer, isUserAnswer, status, isTrueFalse = false }: FeedbackChoiceProps) => {
  const getChoiceStyle = () => {
    if (isCorrectAnswer) {
      return {
        borderColor: '#52D999',
        backgroundColor: '#52D99940',
        textColor: '#52D999',
        circleColor: '#52D999'
      };
    } else if (isUserAnswer && status === 'incorrect') {
      return {
        borderColor: '#FF5F5F',
        backgroundColor: '#FF5F5F40',
        textColor: '#FF5F5F',
        circleColor: '#FF5F5F'
      };
    } else {
      return {
        borderColor: '#A6B5BB',
        backgroundColor: '#FFFFFF',
        textColor: '#1C0B43',
        circleColor: '#A6B5BB'
      };
    }
  };

  const style = getChoiceStyle();

  return (
    <div 
      className={`flex items-center border-2 rounded-[24px] py-[24px] px-[32px] ${
        isTrueFalse ? 'flex-1' : ''
      }`}
      style={{
        borderColor: style.borderColor,
        backgroundColor: style.backgroundColor
      }}
    >
      <div 
        className="w-[32px] h-[32px] border-2 rounded-full flex items-center justify-center"
        style={{ borderColor: style.circleColor }}
      >
        {/* Show circle for both correct answer and user's wrong answer */}
        {(isCorrectAnswer || (isUserAnswer && status === 'incorrect')) && (
          <div 
            className="w-[16px] h-[16px] rounded-full"
            style={{ backgroundColor: style.circleColor }}
          />
        )}
      </div>
      <div className="w-[16px]" />
      <span 
        className="font-['Archivo'] text-[28px] font-normal"
        style={{ color: style.textColor }}
      >
        {choice.text}
      </span>
    </div>
  );
};

function CourseCard({ icon, title, lessons, hours, description, alt }: CourseCardProps) {
  return (
    <div className="bg-white rounded-[32px] flex flex-col h-full" style={{ boxShadow: '0px 2px 12px #00000029' }}>
      <div className="p-8 flex-1">
        {/* Course content */}
        <div className="flex items-center">
          {/* Course icon */}
          <div className="flex-shrink-0">
            <img 
              src={icon} 
              alt={alt} 
              className="h-[70px] w-auto"
            />
          </div>
          
          {/* Course info */}
          <div className="ml-6 flex-1">
            {/* Course title */}
            <h3 className="text-[#1C0B43] font-['Archivo'] font-semibold text-[28px] text-left mb-2">
              {title}
            </h3>
            
            {/* Course stats */}
            <div className="flex items-center gap-4">
              {/* Lessons tag */}
              <div className="flex items-center">
                <BookOpen className="w-5 h-5 text-[#A6B5BB] mr-2" strokeWidth={2} />
                <span className="text-[#A6B5BB] font-['Archivo'] font-semibold text-base text-left">{lessons} lessons</span>
              </div>
              
              {/* Hours tag */}
              <div className="flex items-center">
                <ClockIcon className="w-5 h-5 text-[#A6B5BB] mr-2" strokeWidth={2} />
                <span className="text-[#A6B5BB] font-['Archivo'] font-semibold text-base text-left">{hours} hours</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Horizontal line */}
        <hr className="border-[#D6D6D6] border-t-[1px] my-4" />
        
        {/* Course description */}
        <p className="text-[#ABABAB] font-['Archivo'] font-normal text-base text-left">
          {description}
        </p>
      </div>
      
      {/* Open Course button - sticks to bottom with no spacing */}
      <button className="bg-[#5F24E0] hover:bg-[#9F7CEC] text-[#EFE9FC] font-['Archivo'] font-semibold text-[22px] py-5 rounded-b-[32px] transition-colors text-center">
        Open Course
      </button>
    </div>
  );
}

function QuestionItem({ question, isOpen, onToggle }: QuestionItemProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'correct':
        return {
          borderColor: '#52D999',
          textColor: '#52D999',
          circleBackground: '#52D99940',
          statusText: 'Correct Answer'
        };
      case 'incorrect':
        return {
          borderColor: '#FF5F5F',
          textColor: '#FF5F5F',
          circleBackground: '#FF5F5F66',
          statusText: 'Incorrect Answer'
        };
      case 'no-answer':
        return {
          borderColor: '#A6B5BB',
          textColor: '#A6B5BB',
          circleBackground: '#A6B5BB66',
          statusText: 'No Answer Given'
        };
      default:
        return {
          borderColor: '#A6B5BB',
          textColor: '#A6B5BB',
          circleBackground: '#A6B5BB66',
          statusText: 'No Answer Given'
        };
    }
  };

  const config = getStatusConfig(question.status);

  return (
    <div 
      className="w-full bg-white rounded-[32px] py-8 cursor-pointer"
      style={{ 
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
        borderLeft: `16px solid ${config.borderColor}`
      }}
      onClick={onToggle}
    >
      {/* First line with question header */}
      <div className="flex pl-4 pr-16">
        {/* 32px margin at the left of the number */}
        <div className="w-8"></div>
        
        {/* Question number circle */}
        <div 
          className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: config.circleBackground }}
        >
          <span className="font-['Archivo'] font-semibold text-[28px] text-left" style={{ color: config.textColor }}>
            {question.questionNumber}
          </span>
        </div>

        {/* 16px spacing */}
        <div className="w-4"></div>

        {/* Question content */}
        <div className="flex-1">
          {/* Question text */}
          <h3 className="text-[#1C0B43] font-['Archivo'] font-semibold text-[28px] text-left">
            {question.questionText}
          </h3>

          {/* 8px spacing */}
          <div className="mt-2">
            {/* Status text */}
            <p className="font-['Archivo'] font-medium text-2xl text-left" style={{ color: config.textColor }}>
              {config.statusText}
            </p>
          </div>
        </div>

        {/* Toggle icon */}
        <div className="ml-4 flex-shrink-0 flex items-center">
          {isOpen ? (
            <ChevronUp className="w-10 h-10 text-[#A6B5BB]" strokeWidth={3} />
          ) : (
            <ChevronDown className="w-10 h-10 text-[#A6B5BB]" strokeWidth={3} />
          )}
        </div>
      </div>

      {/* Expanded content - spans full width of rectangle */}
      {isOpen && (
        <div className="mt-4 pl-4 pr-4">
          {/* Code Block (if exists) */}
          {question.codeBlock && (
            <div className="mb-4">
              <div className="bg-[#EFE9FC] rounded-[8px] p-[24px]">
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
                  className="quiz-code-block !bg-[#FFFFFF] border-l-[8px] border-[#5F24E0] px-[32px] py-[12px] !mt-0 !mb-0"
                >
                  {question.codeBlock.code}
                </SyntaxHighlighter>
              </div>
            </div>
          )}

          {/* Choices */}
          <div className={question.type === 'true_false' ? 'flex gap-[16px]' : 'space-y-[16px]'}>
            {question.choices.map((choice) => (
              <FeedbackChoice
                key={choice.id}
                choice={choice}
                isCorrectAnswer={choice.id === question.correctAnswerId}
                isUserAnswer={choice.id === question.userAnswerId}
                status={question.status}
                isTrueFalse={question.type === 'true_false'}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function QuizFeedback({ 
  score = 43, 
  timeSpent = "12m 25s", 
  correctAnswers = 2, 
  incorrectAnswers = 8 
}: QuizFeedbackProps) {
  const [openQuestions, setOpenQuestions] = useState<{ [key: number]: boolean }>({});

  const toggleQuestion = (questionIndex: number) => {
    setOpenQuestions(prev => ({
      ...prev,
      [questionIndex]: !prev[questionIndex]
    }));
  };

  // Determine if passed or failed
  const isPassed = score >= 70;
  const status = isPassed ? 'Passed' : 'Failed';
  
  // Determine color based on score ranges
  const getScoreColorClass = (score: number) => {
    if (score >= 0 && score <= 49) return 'text-[#FF5F5F]';
    if (score >= 50 && score <= 69) return 'text-[#FFBF00]';
    if (score >= 70 && score <= 89) return 'text-[#52D999]';
    if (score >= 90 && score <= 100) return 'text-[#41D0E3]';
    return 'text-[#FF5F5F]'; // default
  };

  const getScoreColor = (score: number) => {
    if (score >= 0 && score <= 49) return '#FF5F5F';
    if (score >= 50 && score <= 69) return '#FFBF00';
    if (score >= 70 && score <= 89) return '#52D999';
    if (score >= 90 && score <= 100) return '#41D0E3';
    return '#FF5F5F'; // default
  };

  const scoreColorClass = getScoreColorClass(score);
  const scoreColor = getScoreColor(score);
  
  // Get header text based on score
  const getHeaderText = (score: number) => {
    if (score >= 0 && score <= 49) return "NEEDS IMPROVEMENT";
    if (score >= 50 && score <= 69) return "ALMOST THERE!";
    if (score >= 70 && score <= 89) return "NICE WORK!";
    if (score >= 90 && score <= 100) return "EXCELLENT PERFORMANCE!";
    return "NEEDS IMPROVEMENT";
  };
  
  // Get description text based on score
  const getDescriptionText = (score: number) => {
    if (score >= 0 && score <= 49) return "It looks like you're still getting the hang of this. Don't worry — review the material and try again!";
    if (score >= 50 && score <= 69) return "You didn't quite reach the passing score of 70%. Keep practicing!";
    if (score >= 70 && score <= 89) return "You've just reached the passing score. Solid effort — keep practicing to improve even more!";
    if (score >= 90 && score <= 100) return "You nailed it! Your strong score shows you've got a great grasp of the material. Keep it up!";
    return "It looks like you're still getting the hang of this. Don't worry — review the material and try again!";
  };
  
  const headerText = getHeaderText(score);
  const descriptionText = getDescriptionText(score);
  
  // Calculate progress for the circular bar (0-100%)
  const progress = score;
  // Circle radii: inner=85, outer=99 (6px spacing)
  const outerRadius = 99;
  
  // Convert to degrees (starts at 90deg, moves clockwise - fills to the right)
  const dashArray = 2 * Math.PI * outerRadius;
  const dashOffset = dashArray - (dashArray * progress / 100); // Show exactly the progress percentage
  
  // SVG size needs to accommodate stroke width (16px) on all sides
  const strokeWidth = 16;
  const svgSize = (outerRadius + strokeWidth) * 2;
  const center = svgSize / 2;

  // Course data
  const courses = [
    {
      icon: "https://img.icons8.com/ios-filled/100/5F24E0/html-5.png",
      title: "HTML & CSS for Beginners",
      lessons: 12,
      hours: 8,
      description: "Start your web development journey by mastering the fundamentals of HTML and CSS. Learn how to structure pages, and create responsive layouts using Flexbox and Grid.",
      alt: "HTML5"
    },
    {
      icon: "https://img.icons8.com/ios-filled/100/5F24E0/javascript.png",
      title: "JavaScript for Beginners",
      lessons: 10,
      hours: 6,
      description: "Learn the fundamentals of JavaScript. Understand variables, loops, functions, and more to build interactive web applications.",
      alt: "JavaScript"
    },
    {
      icon: "https://img.icons8.com/ios-filled/100/5F24E0/react-native.png",
      title: "React for Beginners",
      lessons: 15,
      hours: 10,
      description: "Dive into React and learn how to build user interfaces with components, state management, and modern development patterns.",
      alt: "React"
    }
  ];

  // Sample questions data with detailed feedback
  const questions: QuestionData[] = [
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
      ],
      correctAnswerId: 'q1_b',
      userAnswerId: 'q1_c',
      status: 'incorrect'
    },
    {
      id: 'q2',
      questionNumber: 2,
      questionText: 'What does CSS stand for?',
      type: 'multiple_choice',
      choices: [
        { id: 'q2_a', text: 'Computer Style Sheets' },
        { id: 'q2_b', text: 'Cascading Style Sheets' },
        { id: 'q2_c', text: 'Creative Style Sheets' },
        { id: 'q2_d', text: 'Colorful Style Sheets' }
      ],
      correctAnswerId: 'q2_b',
      userAnswerId: 'q2_b',
      status: 'correct'
    },
    {
      id: 'q3',
      questionNumber: 3,
      questionText: 'Which HTML tag is used for creating hyperlinks?',
      type: 'multiple_choice',
      choices: [
        { id: 'q3_a', text: '<link>' },
        { id: 'q3_b', text: '<a>' },
        { id: 'q3_c', text: '<href>' },
        { id: 'q3_d', text: '<url>' }
      ],
      correctAnswerId: 'q3_b',
      status: 'no-answer'
    },
    {
      id: 'q4',
      questionNumber: 4,
      questionText: 'What will be the output of the following code?',
      type: 'multiple_choice',
      choices: [
        { id: 'q4_a', text: '"object" "undefined"' },
        { id: 'q4_b', text: '"null" "undefined"' },
        { id: 'q4_c', text: '"object" "object"' }
      ],
      correctAnswerId: 'q4_a',
      userAnswerId: 'q4_b',
      status: 'incorrect',
      codeBlock: {
        language: 'javascript',
        code: `console.log(typeof null);\nconsole.log(typeof undefined);`
      }
    },
    {
      id: 'q5',
      questionNumber: 5,
      questionText: 'JavaScript is a compiled programming language.',
      type: 'true_false',
      choices: [
        { id: 'q5_a', text: 'True' },
        { id: 'q5_b', text: 'False' }
      ],
      correctAnswerId: 'q5_b',
      userAnswerId: 'q5_b',
      status: 'correct'
    },
    {
      id: 'q6',
      questionNumber: 6,
      questionText: 'Which CSS property is used to change the text color?',
      type: 'multiple_choice',
      choices: [
        { id: 'q6_a', text: 'font-color' },
        { id: 'q6_b', text: 'text-color' },
        { id: 'q6_c', text: 'color' },
        { id: 'q6_d', text: 'foreground-color' }
      ],
      correctAnswerId: 'q6_c',
      status: 'no-answer'
    },
    {
      id: 'q7',
      questionNumber: 7,
      questionText: 'What does HTML stand for?',
      type: 'multiple_choice',
      choices: [
        { id: 'q7_a', text: 'Hyper Text Markup Language' },
        { id: 'q7_b', text: 'High Tech Modern Language' },
        { id: 'q7_c', text: 'Home Tool Markup Language' },
        { id: 'q7_d', text: 'Hyperlink and Text Markup Language' }
      ],
      correctAnswerId: 'q7_a',
      userAnswerId: 'q7_d',
      status: 'incorrect'
    },
    {
      id: 'q8',
      questionNumber: 8,
      questionText: 'Which of these is a JavaScript framework?',
      type: 'multiple_choice',
      choices: [
        { id: 'q8_a', text: 'React' },
        { id: 'q8_b', text: 'CSS' },
        { id: 'q8_c', text: 'HTML' },
        { id: 'q8_d', text: 'Bootstrap' }
      ],
      correctAnswerId: 'q8_a',
      userAnswerId: 'q8_d',
      status: 'incorrect'
    },
    {
      id: 'q9',
      questionNumber: 9,
      questionText: 'What is the purpose of the <head> tag in HTML?',
      type: 'multiple_choice',
      choices: [
        { id: 'q9_a', text: 'To contain the main content' },
        { id: 'q9_b', text: 'To contain metadata and links' },
        { id: 'q9_c', text: 'To create headings' },
        { id: 'q9_d', text: 'To add headers to tables' }
      ],
      correctAnswerId: 'q9_b',
      userAnswerId: 'q9_a',
      status: 'incorrect'
    },
    {
      id: 'q10',
      questionNumber: 10,
      questionText: 'How do you create a comment in CSS?',
      type: 'multiple_choice',
      choices: [
        { id: 'q10_a', text: '// This is a comment' },
        { id: 'q10_b', text: '<!-- This is a comment -->' },
        { id: 'q10_c', text: '/* This is a comment */' },
        { id: 'q10_d', text: '# This is a comment' }
      ],
      correctAnswerId: 'q10_c',
      userAnswerId: 'q10_a',
      status: 'incorrect'
    }
  ];
  
  return (
    <MainLayout>
      <div className="w-full overflow-y-auto h-full">
        {/* Content with 128px margins */}
        <div className="mx-32">
          {/* 64px spacing under navbar */}
          <div className="mt-16">
            {/* Purple container box */}
            <div className="w-full rounded-[32px] p-8 bg-[#5F24E0]">
              <div className="flex items-center">
                {/* Left column - Circular progress container */}
                <div 
                  className="relative flex items-center justify-center flex-shrink-0"
                  style={{
                    '--progress-color': scoreColor,
                    '--dash-array': dashArray,
                    '--dash-offset': dashOffset
                  } as React.CSSProperties}
                >
                  {/* SVG container for all circles */}
                  <svg 
                    width={svgSize} 
                    height={svgSize} 
                    className="transform rotate-90 scale-x-[-1]"
                  >
                    {/* Outermost circle - Progress bar background */}
                    <circle
                      cx={center}
                      cy={center}
                      r={outerRadius}
                      className="stroke-[#5F24E0] fill-none"
                      strokeWidth={strokeWidth}
                    />
                    {/* Outermost circle - Progress bar */}
                    <circle
                      cx={center}
                      cy={center}
                      r={outerRadius}
                      className="fill-none transition-all duration-500 ease-in-out"
                      stroke="var(--progress-color)"
                      strokeWidth={strokeWidth}
                      strokeLinecap="butt"
                      strokeDasharray="var(--dash-array)"
                      strokeDashoffset="var(--dash-offset)"
                    />
                  </svg>
                  
                  {/* Innermost circle with text */}
                  <div className="absolute flex flex-col items-center justify-center rounded-full w-[170px] h-[170px] bg-[#EFE9FC]">
                    {/* Score text */}
                    <div className={`text-center font-['Archivo'] font-semibold text-[62px] ${scoreColorClass}`}>
                      {score}%
                    </div>
                    
                    {/* Status text */}
                    <div className={`text-center font-['Archivo'] font-semibold text-2xl ${scoreColorClass}`}>
                      {status}
                    </div>
                  </div>
                </div>

                {/* Right column - Text content */}
                <div className="ml-16 flex-1">
                  {/* Header text */}
                  <h1 className="text-[#EFE9FC] font-['Archivo'] font-bold text-[42px] text-left mb-2">
                    {headerText}
                  </h1>
                  
                  {/* Description text */}
                  <p className="text-[#EFE9FC] font-['Archivo'] font-normal text-2xl text-left mb-8">
                    {descriptionText}
                  </p>
                  
                  {/* Statistics tags */}
                  <div className="flex gap-8">
                    {/* Time spent tag */}
                    <div className="bg-[#EFE9FC] rounded-2xl py-2 px-8 flex items-center">
                      <Clock className="w-5 h-5 mr-2 text-[#5F24E0]" strokeWidth={4} />
                      <span className="text-[#5F24E0] font-['Archivo'] font-medium text-2xl">
                        Completed in {timeSpent}
                      </span>
                    </div>
                    
                    {/* Correct answers tag */}
                    <div className="bg-[#EFE9FC] rounded-2xl py-2 px-8 flex items-center">
                      <Check className="w-5 h-5 mr-2 text-[#52D999]" strokeWidth={4} />
                      <span className="text-[#5F24E0] font-['Archivo'] font-medium text-2xl">
                        {correctAnswers} Correct answers
                      </span>
                    </div>
                    
                    {/* Incorrect answers tag */}
                    <div className="bg-[#EFE9FC] rounded-2xl py-2 px-8 flex items-center">
                      <X className="w-5 h-5 mr-2 text-[#DC2626]" strokeWidth={4} />
                      <span className="text-[#5F24E0] font-['Archivo'] font-medium text-2xl">
                        {incorrectAnswers} Incorrect answers
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 32px spacing under score rectangle */}
            <div className="mt-8">
              {/* Recommended Courses Section */}
              <div className="mb-8">
                {/* Header with lamp icon and texts */}
                <div className="flex items-start">
                  {/* Lamp icon */}
                  <div className="bg-[#EFE9FC] rounded-xl p-4 flex-shrink-0">
                    <Lightbulb className="w-[35px] h-[35px] text-[#5F24E0]" strokeWidth={3} />
                  </div>
                  
                  {/* Text content */}
                  <div className="ml-4">
                    <h2 className="text-[#1C0B43] font-['Archivo'] font-semibold text-[32px] text-left">
                      Recommended Courses Just for You
                    </h2>
                    <p className="text-[#A6B5BB] font-['Archivo'] font-normal text-[22px] text-left">
                      Based on your quiz results, we suggest the following courses to help you improve.
                    </p>
                  </div>
                </div>
              </div>

              {/* 32px spacing */}
              <div className="mt-8">
                {/* Course grid - 3 columns */}
                <div className="grid grid-cols-3 gap-6">
                  {courses.map((course, index) => (
                    <CourseCard
                      key={index}
                      icon={course.icon}
                      title={course.title}
                      lessons={course.lessons}
                      hours={course.hours}
                      description={course.description}
                      alt={course.alt}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* 32px spacing under courses section */}
            <div className="mt-8">
              {/* Question Review Section */}
              <div className="mb-8">
                {/* Header with lens icon and texts */}
                <div className="flex items-start">
                  {/* Lens icon */}
                  <div className="bg-[#EFE9FC] rounded-xl p-4 flex-shrink-0">
                    <Search className="w-[35px] h-[35px] text-[#5F24E0]" strokeWidth={3} />
                  </div>
                  
                  {/* Text content */}
                  <div className="ml-4">
                    <h2 className="text-[#1C0B43] font-['Archivo'] font-semibold text-[32px] text-left">
                      Question Review
                    </h2>
                    <p className="text-[#A6B5BB] font-['Archivo'] font-normal text-[22px] text-left">
                      Review your mistakes and find the correct answer.
                    </p>
                  </div>
                </div>
              </div>

              {/* 32px spacing */}
              <div className="mt-8">
                {/* Questions list */}
                <div className="space-y-8">
                  {questions.map((question, index) => (
                    <QuestionItem
                      key={question.id}
                      question={question}
                      isOpen={openQuestions[index] || false}
                      onToggle={() => toggleQuestion(index)}
                    />
                  ))}
                </div>
                
                {/* 32px spacing under last question */}
                <div className="mt-8"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 