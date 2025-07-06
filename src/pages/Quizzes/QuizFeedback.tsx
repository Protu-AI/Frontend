import React, { useState, useEffect } from "react";
import { MainLayout } from "@/layouts/MainLayout";
import {
  Clock,
  Check,
  X,
  Lightbulb,
  BookOpen,
  Clock as ClockIcon,
  Search,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { prism } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useLocation, useNavigate } from "react-router-dom";

// --- Interfaces for Quiz Data ---
// IMPORTANT: These interfaces are updated to match YOUR BACKEND RESPONSE
//
// QuizQuestionOption now reflects that 'options' in questionReviews is an array of strings
type QuizQuestionOption = string; // This is the crucial change

interface QuizQuestionReview {
  questionId: string;
  questionText: string;
  questionType: "multiple_choice" | "true_false";
  options: QuizQuestionOption[]; // Now an array of strings
  selectedAnswer: string; // The text of the selected answer
  correctAnswer: string; // The text of the correct answer
  isCorrect: boolean;
  explanation: string;
  order: number;
  codeBlock?: {
    language: string;
    code: string;
  };
}

export interface QuizData {
  attemptId: string;
  quizId: string;
  quizTitle: string;
  quizTopic: string;
  score: number;
  passed: boolean;
  timeTaken: number; // in seconds
  completedAt: string;
  correctAnswersCount: number;
  incorrectAnswersCount: number;
  questionReviews: QuizQuestionReview[];
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
  id: string; // Added id for consistency and React keys
  text: string;
}

interface QuestionDataForUI {
  id: string;
  questionNumber: number;
  questionText: string;
  type: "multiple_choice" | "true_false";
  choices: Choice[]; // Represents the options from QuizQuestionReview, now mapped correctly
  correctAnswerText: string; // The text of the correct answer
  userAnswerText?: string; // The text of the user's selected answer
  isCorrect: boolean;
  explanation: string;
  codeBlock?: {
    language: string;
    code: string;
  };
}

interface QuestionItemProps {
  question: QuestionDataForUI;
  isOpen: boolean;
  onToggle: () => void;
}

interface FeedbackChoiceProps {
  choice: Choice;
  isCorrectAnswer: boolean;
  isUserAnswer: boolean;
  isTrueFalse?: boolean;
}

const FeedbackChoice = ({
  choice,
  isCorrectAnswer,
  isUserAnswer,
  isTrueFalse = false,
}: FeedbackChoiceProps) => {
  const getChoiceStyle = () => {
    if (isCorrectAnswer) {
      return {
        borderColor: "#52D999",
        backgroundColor: "#52D99940",
        textColor: "#52D999",
        circleColor: "#52D999",
      };
    } else if (isUserAnswer && !isCorrectAnswer) {
      // User selected this and it's incorrect
      return {
        borderColor: "#FF5F5F",
        backgroundColor: "#FF5F5F40",
        textColor: "#FF5F5F",
        circleColor: "#FF5F5F",
      };
    } else {
      // Not selected by user and not the correct answer, or selected by user and it's correct (handled by isCorrectAnswer)
      return {
        borderColor: "#A6B5BB",
        backgroundColor: "#FFFFFF",
        textColor: "#1C0B43",
        circleColor: "#A6B5BB",
      };
    }
  };

  const style = getChoiceStyle();

  return (
    <div
      className={`flex items-center border-2 rounded-[24px] py-[24px] px-[32px] ${
        isTrueFalse ? "flex-1" : ""
      }`}
      style={{
        borderColor: style.borderColor,
        backgroundColor: style.backgroundColor,
      }}
    >
      <div
        className="w-[32px] h-[32px] border-2 rounded-full flex items-center justify-center"
        style={{ borderColor: style.circleColor }}
      >
        {/* Show circle for correct answer and user's incorrect answer */}
        {(isCorrectAnswer || (isUserAnswer && !isCorrectAnswer)) && (
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
        {choice.text} {/* This will now correctly display the option string */}
      </span>
    </div>
  );
};

function CourseCard({
  icon,
  title,
  lessons,
  hours,
  description,
  alt,
}: CourseCardProps) {
  return (
    <div
      className="bg-white rounded-[32px] flex flex-col h-full"
      style={{ boxShadow: "0px 2px 12px #00000029" }}
    >
      <div className="p-8 flex-1">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <img src={icon} alt={alt} className="h-[70px] w-auto" />
          </div>
          <div className="ml-6 flex-1">
            <h3 className="text-[#1C0B43] font-['Archivo'] font-semibold text-[28px] text-left mb-2">
              {title}
            </h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <BookOpen
                  className="w-5 h-5 text-[#A6B5BB] mr-2"
                  strokeWidth={2}
                />
                <span className="text-[#A6B5BB] font-['Archivo'] font-semibold text-base text-left">
                  {lessons} lessons
                </span>
              </div>
              <div className="flex items-center">
                <ClockIcon
                  className="w-5 h-5 text-[#A6B5BB] mr-2"
                  strokeWidth={2}
                />
                <span className="text-[#A6B5BB] font-['Archivo'] font-semibold text-base text-left">
                  {hours} hours
                </span>
              </div>
            </div>
          </div>
        </div>
        <hr className="border-[#D6D6D6] border-t-[1px] my-4" />
        <p className="text-[#ABABAB] font-['Archivo'] font-normal text-base text-left">
          {description}
        </p>
      </div>
      <button className="bg-[#5F24E0] hover:bg-[#9F7CEC] text-[#EFE9FC] font-['Archivo'] font-semibold text-[22px] py-5 rounded-b-[32px] transition-colors text-center">
        Open Course
      </button>
    </div>
  );
}

function QuestionItem({ question, isOpen, onToggle }: QuestionItemProps) {
  const getStatusConfig = (isCorrect: boolean, userAnswerText?: string) => {
    if (isCorrect) {
      return {
        borderColor: "#52D999",
        textColor: "#52D999",
        circleBackground: "#52D99940",
        statusText: "Correct Answer",
      };
    } else if (userAnswerText) {
      return {
        borderColor: "#FF5F5F",
        textColor: "#FF5F5F",
        circleBackground: "#FF5F5F66",
        statusText: "Incorrect Answer",
      };
    } else {
      return {
        borderColor: "#A6B5BB",
        textColor: "#A6B5BB",
        circleBackground: "#A6B5BB66",
        statusText: "No Answer Given",
      };
    }
  };

  const config = getStatusConfig(question.isCorrect, question.userAnswerText);

  return (
    <div
      className="w-full bg-white rounded-[32px] py-8 cursor-pointer"
      style={{
        boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
        borderLeft: `16px solid ${config.borderColor}`,
      }}
      onClick={onToggle}
    >
      <div className="flex pl-4 pr-16">
        <div className="w-8"></div>
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: config.circleBackground }}
        >
          <span
            className="font-['Archivo'] font-semibold text-[28px] text-left"
            style={{ color: config.textColor }}
          >
            {question.questionNumber}
          </span>
        </div>
        <div className="w-4"></div>
        <div className="flex-1">
          <h3 className="text-[#1C0B43] font-['Archivo'] font-semibold text-[28px] text-left">
            {question.questionText}
          </h3>
          <div className="mt-2">
            <p
              className="font-['Archivo'] font-medium text-2xl text-left"
              style={{ color: config.textColor }}
            >
              {config.statusText}
            </p>
          </div>
        </div>
        <div className="ml-4 flex-shrink-0 flex items-center">
          {isOpen ? (
            <ChevronUp className="w-10 h-10 text-[#A6B5BB]" strokeWidth={3} />
          ) : (
            <ChevronDown className="w-10 h-10 text-[#A6B5BB]" strokeWidth={3} />
          )}
        </div>
      </div>
      {isOpen && (
        <div className="mt-4 pl-4 pr-4">
          {question.codeBlock && (
            <div className="mb-4">
              <div className="bg-[#EFE9FC] rounded-[8px] p-[24px]">
                <style
                  dangerouslySetInnerHTML={{
                    __html: `
                      .quiz-code-block code,
                      .quiz-code-block pre,
                      .quiz-code-block * {
                        font-family: 'Archivo', sans-serif !important;
                        font-weight: 500 !important;
                        font-size: 16px !important;
                        text-align: left !important;
                      }
                    `,
                  }}
                />
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
          <div
            className={
              question.type === "true_false"
                ? "flex gap-[16px]"
                : "space-y-[16px]"
            }
          >
            {question.choices.map((choice) => (
              <FeedbackChoice
                key={choice.id}
                choice={choice}
                isCorrectAnswer={choice.text === question.correctAnswerText}
                isUserAnswer={choice.text === question.userAnswerText}
                isTrueFalse={question.type === "true_false"}
              />
            ))}
          </div>
          {question.explanation && (
            <div className="mt-6 flex items-start">
              <Lightbulb className="w-6 h-6 text-[#A6B5BB] flex-shrink-0 mt-1" />
              <div className="ml-3 text-[#1C0B43] font-['Archivo'] font-normal text-base leading-relaxed">
                {question.explanation}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function QuizFeedback() {
  const location = useLocation();
  const navigate = useNavigate();

  const { quizResult } = (location.state || {}) as { quizResult?: QuizData };

  useEffect(() => {
    if (!quizResult) {
      console.warn("No quiz results found in navigation state. Redirecting...");
      navigate("/quizzes", { replace: true });
    }
  }, [quizResult, navigate]);

  const [openQuestions, setOpenQuestions] = useState<{
    [key: number]: boolean;
  }>({});

  const toggleQuestion = (questionIndex: number) => {
    setOpenQuestions((prev) => ({
      ...prev,
      [questionIndex]: !prev[questionIndex],
    }));
  };

  if (!quizResult) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-screen text-xl text-[#1C0B43]">
          Loading quiz results or redirecting...
        </div>
      </MainLayout>
    );
  }

  const {
    score,
    passed,
    timeTaken,
    correctAnswersCount,
    incorrectAnswersCount,
    questionReviews,
    quizTitle,
  } = quizResult;

  const formatTimeTaken = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const formattedTimeTaken = formatTimeTaken(timeTaken);

  const status = passed ? "Passed" : "Failed";

  const getScoreColorClass = (score: number) => {
    if (score >= 0 && score <= 49) return "text-[#FF5F5F]";
    if (score >= 50 && score <= 59) return "text-[#FFBF00]";
    if (score >= 60 && score <= 89) return "text-[#52D999]";
    if (score >= 90 && score <= 100) return "text-[#41D0E3]";
    return "text-[#FF5F5F]";
  };

  const getScoreColor = (score: number) => {
    if (score >= 0 && score <= 49) return "#FF5F5F";
    if (score >= 50 && score <= 59) return "#FFBF00";
    if (score >= 60 && score <= 89) return "#52D999";
    if (score >= 90 && score <= 100) return "#41D0E3";
    return "#FF5F5F";
  };

  const scoreColorClass = getScoreColorClass(score);
  const scoreColor = getScoreColor(score);

  const getHeaderText = (score: number) => {
    if (score >= 0 && score <= 49) return "NEEDS IMPROVEMENT";
    if (score >= 50 && score <= 59) return "ALMOST THERE!";
    if (score >= 60 && score <= 89) return "NICE WORK!";
    if (score >= 90 && score <= 100) return "EXCELLENT PERFORMANCE!";
    return "NEEDS IMPROVEMENT";
  };

  const getDescriptionText = (score: number) => {
    if (score >= 0 && score <= 49)
      return "It looks like you're still getting the hang of this. Don't worry — review the material and try again!";
    if (score >= 50 && score <= 69)
      return "You didn't quite reach the passing score of 60%. Keep practicing!";
    if (score >= 70 && score <= 89)
      return "You've just reached the passing score. Solid effort — keep practicing to improve even more!";
    if (score >= 90 && score <= 100)
      return "You nailed it! Your strong score shows you've got a great grasp of the material. Keep it up!";
    return "It looks like you're still getting the hang of this. Don't worry — review the material and try again!";
  };

  const headerText = getHeaderText(score);
  const descriptionText = getDescriptionText(score);

  const progress = score;
  const outerRadius = 99;
  const strokeWidth = 16;
  const svgSize = (outerRadius + strokeWidth) * 2;
  const center = svgSize / 2;
  const dashArray = 2 * Math.PI * outerRadius;
  const dashOffset = dashArray - (dashArray * progress) / 100;

  const courses = [
    {
      icon: "https://img.icons8.com/ios-filled/100/5F24E0/html-5.png",
      title: "HTML & CSS for Beginners",
      lessons: 12,
      hours: 8,
      description:
        "Start your web development journey by mastering the fundamentals of HTML and CSS. Learn how to structure pages, and create responsive layouts using Flexbox and Grid.",
      alt: "HTML5",
    },
    {
      icon: "https://img.icons8.com/ios-filled/100/5F24E0/javascript.png",
      title: "JavaScript for Beginners",
      lessons: 10,
      hours: 6,
      description:
        "Learn the fundamentals of JavaScript. Understand variables, loops, functions, and more to build interactive web applications.",
      alt: "JavaScript",
    },
    {
      icon: "https://img.icons8.com/ios-filled/100/5F24E0/react-native.png",
      title: "React for Beginners",
      lessons: 15,
      hours: 10,
      description:
        "Dive into React and learn how to build user interfaces with components, state management, and modern development patterns.",
      alt: "React",
    },
  ];

  // Corrected mapping: now 'option' is a string
  const questions: QuestionDataForUI[] = questionReviews.map(
    (review, index) => ({
      id: review.questionId,
      questionNumber: review.order,
      questionText: review.questionText,
      type: review.questionType,
      // THE CHANGE IS HERE:
      choices: review.options.map((optionText, idx) => ({
        id: `${review.questionId}-option-${idx}`,
        text: optionText, // Directly use the string value here
      })),
      correctAnswerText: review.correctAnswer,
      userAnswerText: review.selectedAnswer,
      isCorrect: review.isCorrect,
      explanation: review.explanation,
      codeBlock: review.codeBlock,
    })
  );

  return (
    <MainLayout>
      <div className="w-full overflow-y-auto h-full">
        <div className="mx-32">
          <div className="mt-16">
            <div className="w-full rounded-[32px] p-8 bg-[#5F24E0]">
              <div className="flex items-center">
                <div
                  className="relative flex items-center justify-center flex-shrink-0"
                  style={
                    {
                      "--progress-color": scoreColor,
                      "--dash-array": dashArray,
                      "--dash-offset": dashOffset,
                    } as React.CSSProperties
                  }
                >
                  <svg
                    width={svgSize}
                    height={svgSize}
                    className="transform rotate-90 scale-x-[-1]"
                  >
                    <circle
                      cx={center}
                      cy={center}
                      r={outerRadius}
                      className="stroke-[#5F24E0] fill-none"
                      strokeWidth={strokeWidth}
                    />
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
                  <div className="absolute flex flex-col items-center justify-center rounded-full w-[170px] h-[170px] bg-[#EFE9FC]">
                    <div
                      className={`text-center font-['Archivo'] font-semibold text-[62px] ${scoreColorClass}`}
                    >
                      {Math.round(score)}%
                    </div>
                    <div
                      className={`text-center font-['Archivo'] font-semibold text-2xl ${scoreColorClass}`}
                    >
                      {status}
                    </div>
                  </div>
                </div>
                <div className="ml-16 flex-1">
                  <h1 className="text-[#EFE9FC] font-['Archivo'] font-bold text-[42px] text-left mb-2">
                    {headerText}
                  </h1>
                  <p className="text-[#EFE9FC] font-['Archivo'] font-normal text-2xl text-left mb-8">
                    {descriptionText}
                  </p>
                  <div className="flex gap-8">
                    <div className="bg-[#EFE9FC] rounded-2xl py-2 px-8 flex items-center">
                      <Clock
                        className="w-5 h-5 mr-2 text-[#5F24E0]"
                        strokeWidth={4}
                      />
                      <span className="text-[#5F24E0] font-['Archivo'] font-medium text-2xl">
                        Completed in {formattedTimeTaken}
                      </span>
                    </div>
                    <div className="bg-[#EFE9FC] rounded-2xl py-2 px-8 flex items-center">
                      <Check
                        className="w-5 h-5 mr-2 text-[#52D999]"
                        strokeWidth={4}
                      />
                      <span className="text-[#5F24E0] font-['Archivo'] font-medium text-2xl">
                        {correctAnswersCount} Correct answers
                      </span>
                    </div>
                    <div className="bg-[#EFE9FC] rounded-2xl py-2 px-8 flex items-center">
                      <X
                        className="w-5 h-5 mr-2 text-[#DC2626]"
                        strokeWidth={4}
                      />
                      <span className="text-[#5F24E0] font-['Archivo'] font-medium text-2xl">
                        {incorrectAnswersCount} Incorrect answers
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <div className="mb-8">
                <div className="flex items-start">
                  <div className="bg-[#EFE9FC] rounded-xl p-4 flex-shrink-0">
                    <Lightbulb
                      className="w-[35px] h-[35px] text-[#5F24E0]"
                      strokeWidth={3}
                    />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-[#1C0B43] font-['Archivo'] font-semibold text-[32px] text-left">
                      Recommended Courses Just for You
                    </h2>
                    <p className="text-[#A6B5BB] font-['Archivo'] font-normal text-[22px] text-left">
                      Based on your quiz results, we suggest the following
                      courses to help you improve.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-8">
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
            <div className="mt-8">
              <div className="mb-8">
                <div className="flex items-start">
                  <div className="bg-[#EFE9FC] rounded-xl p-4 flex-shrink-0">
                    <Search
                      className="w-[35px] h-[35px] text-[#5F24E0]"
                      strokeWidth={3}
                    />
                  </div>
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
              <div className="mt-8">
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
                <div className="mt-8"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
