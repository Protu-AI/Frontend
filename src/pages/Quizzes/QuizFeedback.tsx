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
import { useParams, useNavigate } from "react-router-dom";
import { config } from "../../../config";

// --- Interfaces for Quiz Data ---
type QuizQuestionOption = string;

interface QuizQuestionReview {
  questionId: string;
  questionText: string;
  questionType: "multiple_choice" | "true_false";
  options: QuizQuestionOption[];
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation?: string; // Made optional as per example
  order: number;
  codeBlock?: {
    language: string;
    code: string;
  };
}

interface RecommendedCourse {
  id: number;
  name: string;
  description: string;
  picUrl: string;
  lessonCount: number;
}

export interface QuizAttemptData {
  attemptId: string;
  score: number;
  passed: boolean;
  timeTaken: number; // in seconds
  completedAt: string;
  correctAnswersCount: number;
  incorrectAnswersCount: number;
  questionReviews: QuizQuestionReview[];
  aiFeedback: {
    signal: string;
    feedbackMessage: string;
  };
  recommendedCourses: RecommendedCourse[];
}

export interface QuizApiResponse {
  status: string;
  message: string;
  data: {
    id: string;
    title: string;
    topic: string;
    difficultyLevel: string;
    numberOfQuestions: number;
    timeLimit: number;
    createdAt: string;
    hasBeenAttempted: boolean;
    bestAttempt: QuizAttemptData;
  };
}

interface CourseCardProps {
  course: RecommendedCourse;
}

interface Choice {
  id: string;
  text: string;
}

interface QuestionDataForUI {
  id: string;
  questionNumber: number;
  questionText: string;
  type: "multiple_choice" | "true_false";
  choices: Choice[];
  correctAnswerText: string;
  userAnswerText?: string;
  isCorrect: boolean;
  explanation?: string;
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
        {choice.text}
      </span>
    </div>
  );
};

function CourseCard({ course }: CourseCardProps) {
  const navigate = useNavigate();

  function getTextStartingFrom(
    fullText: string,
    searchTerm: string
  ): string | null {
    const startIndex = fullText.indexOf(searchTerm);

    if (startIndex !== -1) {
      return "This " + fullText.substring(startIndex);
    }
    return null;
  }

  const handleOpenCourse = async () => {
    // <--- ADD THIS FUNCTION
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Authentication token not found.");
        navigate("/login"); // Or handle as desired
        return;
      }

      const encodedCourseName = encodeURIComponent(course.name);

      const response = await fetch(
        `${config.apiUrl}/v1/courses/${encodedCourseName}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch course details.");
      }

      const result = await response.json();
      const fullCourseData = result.data; // The complete course object

      navigate(`/course/${encodedCourseName}`, {
        state: { course: fullCourseData }, // <--- PASS THE FULL DATA HERE
      });
    } catch (err) {
      console.error("Error opening course:", err);
      alert(
        `Failed to open course: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    }
  };

  return (
    <div
      className="bg-white rounded-[32px] flex flex-col h-full"
      style={{ boxShadow: "0px 2px 12px #00000029" }}
    >
      <div className="p-8 flex-1">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <img
              src={
                course.picUrl ||
                "https://img.icons8.com/ios-filled/100/EFE9FC/html-5.png"
              }
              alt={course.name}
              className="h-[70px] w-auto hue-rotate-[330deg] saturate-[5000%] brightness-[90%] contrast-[94%]"
            />
          </div>
          <div className="ml-6 flex-1">
            <h3 className="text-[#1C0B43] font-['Archivo'] font-semibold text-[28px] text-left mb-2">
              {course.name}
            </h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <BookOpen
                  className="w-5 h-5 text-[#A6B5BB] mr-2"
                  strokeWidth={2}
                />
                <span className="text-[#A6B5BB] font-['Archivo'] font-semibold text-base text-left">
                  {course.lessonCount} lessons
                </span>
              </div>
              {course.lessonCount > 0 && (
                <div className="flex items-center">
                  <ClockIcon
                    className="w-5 h-5 text-[#A6B5BB] mr-2"
                    strokeWidth={2}
                  />
                  <span className="text-[#A6B5BB] font-['Archivo'] font-semibold text-base text-left">
                    {Math.ceil(course.lessonCount * 0.5)} hours
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        <hr className="border-[#D6D6D6] border-t-[1px] my-4" />
        <p className="text-[#ABABAB] font-['Archivo'] font-normal text-base text-left">
          {getTextStartingFrom(course.description, "course")}
        </p>
      </div>
      <button
        onClick={handleOpenCourse}
        className="bg-[#5F24E0] hover:bg-[#9F7CEC] text-[#EFE9FC] font-['Archivo'] font-semibold text-[22px] py-5 rounded-b-[32px] transition-colors text-center"
      >
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
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();

  // All useState hooks must be declared at the top level
  const [quizData, setQuizData] = useState<QuizAttemptData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openQuestions, setOpenQuestions] = useState<{
    [key: number]: boolean;
  }>({});

  useEffect(() => {
    const fetchQuizResults = async () => {
      if (!quizId) {
        setError("Quiz ID not provided.");
        setLoading(false);
        navigate("/quizzes", { replace: true });
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authentication token not found.");
        }

        const response = await fetch(
          `${config.apiUrl}/v1/attempts/attempted-preview/${quizId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch quiz results.");
        }

        const result: QuizApiResponse = await response.json();
        setQuizData(result.data.bestAttempt);
      } catch (err) {
        console.error("Error fetching quiz results:", err);
        setError(
          err instanceof Error
            ? err.message
            : "An unknown error occurred while fetching quiz results."
        );
        // Do not navigate immediately on error, allow error message to show
      } finally {
        setLoading(false);
      }
    };

    fetchQuizResults();
  }, [quizId, navigate]);

  // Now, place your conditional returns AFTER all hooks are called
  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-screen text-xl text-[#1C0B43]">
          Loading quiz results...
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex flex-col justify-center items-center h-screen text-xl text-[#FF5F5F]">
          Error: {error}
          <button
            onClick={() => navigate("/quizzes")}
            className="mt-4 px-6 py-3 bg-[#5F24E0] text-white rounded-lg hover:bg-[#9F7CEC] transition-colors"
          >
            Go back to Quizzes
          </button>
        </div>
      </MainLayout>
    );
  }

  if (!quizData) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-screen text-xl text-[#1C0B43]">
          No quiz results available.
          <button
            onClick={() => navigate("/quizzes")}
            className="mt-4 px-6 py-3 bg-[#5F24E0] text-white rounded-lg hover:bg-[#9F7CEC] transition-colors"
          >
            Go back to Quizzes
          </button>
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
    recommendedCourses,
  } = quizData;

  const quizTitle =
    questionReviews.length > 0 ? quizData.aiFeedback.signal : "Quiz Feedback";

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

  const toggleQuestion = (questionIndex: number) => {
    setOpenQuestions((prev) => ({
      ...prev,
      [questionIndex]: !prev[questionIndex],
    }));
  };

  // Map backend question reviews to UI friendly format
  const questions: QuestionDataForUI[] = questionReviews.map(
    (review, index) => ({
      id: review.questionId,
      questionNumber: review.order,
      questionText: review.questionText,
      type: review.questionType,
      choices: review.options.map((optionText, idx) => ({
        id: `${review.questionId}-option-${idx}`,
        text: optionText,
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

            {/* Recommended Courses Section - Conditionally rendered */}
            {recommendedCourses && recommendedCourses.length > 0 && (
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
                    {recommendedCourses.map((course) => (
                      <CourseCard key={course.id} course={course} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Question Review Section */}
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
