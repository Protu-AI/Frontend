import { MainLayout } from "@/layouts/MainLayout";
import { useState } from "react";
import { config } from "../../../config"; // Adjust the path as per your project structure

export function QuizGenerator() {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    "medium"
  );
  const [numberOfQuestions, setNumberOfQuestions] = useState(12);
  const [timeLimit, setTimeLimit] = useState(12);
  const [questionTypes, setQuestionTypes] = useState({
    multipleChoice: true,
    trueFalse: true,
  });
  const [prompt, setPrompt] = useState("");
  const [subtopicSuggestions, setSubtopicSuggestions] = useState<
    { id: string; text: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);

    const token = localStorage.getItem("token"); // Get token from local storage

    if (!token) {
      setError("Authorization token not found. Please log in.");
      setIsLoading(false);
      return;
    }

    // Convert questionTypes state to the array format expected by the API
    const selectedQuestionTypes = [];
    if (questionTypes.multipleChoice) {
      selectedQuestionTypes.push("multiple_choice");
    }
    if (questionTypes.trueFalse) {
      selectedQuestionTypes.push("true_false");
    }

    // Prepare the request body
    const requestBody = {
      prompt: prompt,
      difficultyLevel: difficulty,
      numberOfQuestions: numberOfQuestions,
      questionTypes: selectedQuestionTypes,
      timeLimit: timeLimit * 60,
    };

    try {
      const response = await fetch(`${config.apiUrl}/v1/quizzes/stage1`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create quiz.");
      }

      const responseData = await response.json();
      console.log("Quiz creation successful:", responseData);
      setSubtopicSuggestions(responseData.data.subtopicSuggestions);
      // You might want to navigate to the next step or a new page here
      setCurrentStep(2); // Example: move to the next step
    } catch (err) {
      console.error("Error creating quiz:", err);
      setError((err as Error).message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="flex flex-col w-full overflow-y-auto h-full px-[128px]">
        {/* 32px spacing under navbar */}
        <div className="pt-[32px]" />

        {/* "Create Your Quiz" text */}
        <h1 className="font-['Archivo'] text-[64px] font-semibold text-[#5F24E0] text-left">
          Create Your Quiz
        </h1>

        {/* 16px spacing under text */}
        <div className="mb-[16px]" />

        {/* Step indicator lines */}
        <div className="flex items-center gap-[18px]">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={`w-[44px] h-[5px] rounded-full transition-colors duration-200 ${
                currentStep >= step ? "bg-[#5F24E0]" : "bg-[#D6D6D6]"
              }`}
            />
          ))}
        </div>

        {/* 16px spacing under lines */}
        <div className="mb-[16px]" />

        {/* Step text */}
        <p className="font-['Archivo'] text-[22px] font-normal text-[#A6B5BB] text-left">
          Step {currentStep}: Define your quiz parameters
        </p>

        {/* 32px spacing under step text */}
        <div className="mb-[32px]" />

        {/* Form block */}
        <div
          className="bg-[#FFFFFF] rounded-[32px] flex-1 p-[32px]"
          style={{
            boxShadow: "0px 2px 6px #00000014",
          }}
        >
          {/* First line with icon and texts */}
          <div className="flex items-start">
            {/* Octopus icon */}
            <div className="bg-[#EFE9FC] rounded-[12px] p-[12px] flex items-center justify-center">
              <svg
                width="45"
                height="45"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-[#5F24E0]"
                strokeWidth="2"
              >
                <path
                  d="M12 2C15.866 2 19 5.134 19 9C19 12.866 15.866 16 12 16C8.134 16 5 12.866 5 9C5 5.134 8.134 2 12 2Z"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 14L6 18L4 16"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10 15L9 20L7 18"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14 15L15 20L17 18"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16 14L18 18L20 16"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="10" cy="8" r="1" fill="currentColor" />
                <circle cx="14" cy="8" r="1" fill="currentColor" />
              </svg>
            </div>

            <div className="ml-[16px] flex-1">
              {/* Quiz Topic or Prompt */}
              <h2 className="font-['Archivo'] text-[32px] font-semibold text-[#1C0B43] text-left">
                Quiz Topic or Prompt
              </h2>

              <div className="mb-[8px]" />

              {/* Describe what you want to test */}
              <p className="font-['Archivo'] text-[22px] font-normal text-[#A6B5BB] text-left">
                Describe what you want to test
              </p>
            </div>
          </div>

          {/* 16px spacing under first line */}
          <div className="mb-[16px]" />

          {/* Text input */}
          <textarea
            className="w-full bg-[#EFE9FC40] border-2 border-[#A6B5BB] rounded-[12px] p-[32px] font-['Archivo'] text-[22px] font-normal text-[#1C0B43] placeholder-[#A6B5BB] focus:border-[#5F24E0] focus:outline-none resize-none overflow-y-auto"
            style={{
              caretColor: "#1C0B43",
              height: "calc(1.5em + 64px)", // One line height + padding
              minHeight: "calc(1.5em + 64px)",
            }}
            placeholder="Be specific about the topic, difficulty level, and any special focus areas. The more detailed your prompt, the better the AI-generated quiz will be."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />

          {/* 39px spacing after input */}
          <div className="mb-[39px]" />

          {/* Second line with stat icon and texts */}
          <div className="flex items-start">
            {/* Settings icon */}
            <div className="bg-[#EFE9FC] rounded-[12px] p-[12px] flex items-center justify-center">
              <svg
                width="45"
                height="45"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-[#5F24E0]"
                strokeWidth="2"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="3"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* 16px spacing between icon and text */}
            <div className="ml-[16px] flex-1">
              {/* Customize Your Quiz */}
              <h2 className="font-['Archivo'] text-[32px] font-semibold text-[#1C0B43] text-left">
                Customize Your Quiz
              </h2>

              {/* 8px spacing */}
              <div className="mb-[8px]" />

              {/* Adjust settings to match your needs */}
              <p className="font-['Archivo'] text-[22px] font-normal text-[#A6B5BB] text-left">
                Adjust settings to match your needs
              </p>
            </div>
          </div>

          {/* 32px spacing */}
          <div className="mb-[32px]" />

          {/* Difficulty Level line */}
          <div className="flex items-center">
            {/* Gauge icon */}
            <svg
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-[#1C0B43]"
              strokeWidth="2"
            >
              <path
                d="M8 18C8.5 16 10.5 14 12 14s4 2 4 4"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8 12L16 4"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            {/* 16px spacing */}
            <div className="ml-[16px]">
              <p className="font-['Archivo'] text-[22px] font-normal text-[#1C0B43] text-left">
                Difficulty Level
              </p>
            </div>
          </div>

          {/* 16px spacing under difficulty line */}
          <div className="mb-[16px]" />

          {/* Difficulty level choices */}
          <div className="flex gap-[32px]">
            {/* Easy */}
            <button
              onClick={() => setDifficulty("easy")}
              className={`flex-1 border-2 rounded-[16px] p-[20px] flex items-center transition-all duration-200 ${
                difficulty === "easy"
                  ? "bg-[#EFE9FC] border-[#5F24E0]"
                  : "bg-transparent border-[#A6B5BB]"
              }`}
            >
              {/* Star icon */}
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-[#52D999]"
                strokeWidth="2"
              >
                <polygon
                  points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              {/* 16px spacing before text */}
              <div className="ml-[16px] flex-1">
                <h3
                  className={`font-['Archivo'] text-[28px] font-normal text-left mb-[8px] ${
                    difficulty === "easy" ? "text-[#5F24E0]" : "text-[#1C0B43]"
                  }`}
                >
                  Easy
                </h3>
                <p className="font-['Archivo'] text-[16px] font-normal text-[#A6B5BB] text-left">
                  Basic concepts and fundamentals
                </p>
              </div>
            </button>

            {/* Medium */}
            <button
              onClick={() => setDifficulty("medium")}
              className={`flex-1 border-2 rounded-[16px] p-[20px] flex items-center transition-all duration-200 ${
                difficulty === "medium"
                  ? "bg-[#EFE9FC] border-[#5F24E0]"
                  : "bg-transparent border-[#A6B5BB]"
              }`}
            >
              {/* Two stars icon */}
              <div className="flex">
                <svg
                  width="16"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-[#52D999]"
                  strokeWidth="2"
                >
                  <polygon
                    points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <svg
                  width="16"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-[#52D999]"
                  strokeWidth="2"
                >
                  <polygon
                    points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              {/* 16px spacing before text */}
              <div className="ml-[16px] flex-1">
                <h3
                  className={`font-['Archivo'] text-[28px] font-normal text-left mb-[8px] ${
                    difficulty === "medium"
                      ? "text-[#5F24E0]"
                      : "text-[#1C0B43]"
                  }`}
                >
                  Medium
                </h3>
                <p className="font-['Archivo'] text-[16px] font-normal text-[#A6B5BB] text-left">
                  Intermediate knowledge and application
                </p>
              </div>
            </button>

            {/* Hard */}
            <button
              onClick={() => setDifficulty("hard")}
              className={`flex-1 border-2 rounded-[16px] p-[20px] flex items-center transition-all duration-200 ${
                difficulty === "hard"
                  ? "bg-[#EFE9FC] border-[#5F24E0]"
                  : "bg-transparent border-[#A6B5BB]"
              }`}
            >
              {/* Three stars icon */}
              <div className="flex">
                <svg
                  width="11"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-[#52D999]"
                  strokeWidth="2"
                >
                  <polygon
                    points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <svg
                  width="11"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-[#52D999]"
                  strokeWidth="2"
                >
                  <polygon
                    points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <svg
                  width="11"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-[#52D999]"
                  strokeWidth="2"
                >
                  <polygon
                    points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              {/* 16px spacing before text */}
              <div className="ml-[16px] flex-1">
                <h3
                  className={`font-['Archivo'] text-[28px] font-normal text-left mb-[8px] ${
                    difficulty === "hard" ? "text-[#5F24E0]" : "text-[#1C0B43]"
                  }`}
                >
                  Hard
                </h3>
                <p className="font-['Archivo'] text-[16px] font-normal text-[#A6B5BB] text-left">
                  Advanced topics and scenarios
                </p>
              </div>
            </button>
          </div>

          {/* 32px spacing under difficulty selection */}
          <div className="mb-[32px]" />

          {/* Question Settings Row */}
          <div className="flex items-start gap-[128px]">
            {/* Column 1: Number of Questions */}
            <div className="flex flex-col">
              {/* Icon and title */}
              <div className="flex items-center mb-[16px]">
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-[#1C0B43]"
                  strokeWidth="2"
                >
                  <path
                    d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14 2V8H20"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M16 13H8"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M16 17H8"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10 9H9H8"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="font-['Archivo'] text-[22px] font-normal text-[#1C0B43] text-left ml-[16px]">
                  Number of Questions
                </p>
              </div>

              {/* Input with +/- buttons */}
              <div className="flex items-center border-2 border-[#A6B5BB] rounded-[16px] p-[16px] w-[216px]">
                <button
                  onClick={() =>
                    setNumberOfQuestions(Math.max(1, numberOfQuestions - 1))
                  }
                  className="text-[#1C0B43] font-bold text-xl"
                >
                  -
                </button>
                <span className="flex-1 text-center font-['Archivo'] text-[22px] font-normal text-[#1C0B43]">
                  {numberOfQuestions}
                </span>
                <button
                  onClick={() => setNumberOfQuestions(numberOfQuestions + 1)}
                  className="text-[#1C0B43] font-bold text-xl"
                >
                  +
                </button>
              </div>
            </div>

            {/* Column 2: Question Types */}
            <div className="flex flex-col">
              {/* Icon and title */}
              <div className="flex items-center mb-[16px]">
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-[#1C0B43]"
                  strokeWidth="2"
                >
                  <path
                    d="M9 12L11 14L15 10"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="font-['Archivo'] text-[22px] font-normal text-[#1C0B43] text-left ml-[16px]">
                  Question Types
                </p>
              </div>

              {/* Question type buttons */}
              <div className="flex gap-[32px]">
                <button
                  onClick={() =>
                    setQuestionTypes({
                      ...questionTypes,
                      multipleChoice: !questionTypes.multipleChoice,
                    })
                  }
                  className={`border-2 rounded-[16px] p-[16px] transition-all duration-200 ${
                    questionTypes.multipleChoice
                      ? "bg-[#EFE9FC] border-[#5F24E0] text-[#5F24E0]"
                      : "bg-transparent border-[#A6B5BB] text-[#1C0B43]"
                  }`}
                >
                  <span className="font-['Archivo'] text-[22px] font-normal whitespace-nowrap">
                    Multiple Choice
                  </span>
                </button>
                <button
                  onClick={() =>
                    setQuestionTypes({
                      ...questionTypes,
                      trueFalse: !questionTypes.trueFalse,
                    })
                  }
                  className={`border-2 rounded-[16px] p-[16px] transition-all duration-200 ${
                    questionTypes.trueFalse
                      ? "bg-[#EFE9FC] border-[#5F24E0] text-[#5F24E0]"
                      : "bg-transparent border-[#A6B5BB] text-[#1C0B43]"
                  }`}
                >
                  <span className="font-['Archivo'] text-[22px] font-normal whitespace-nowrap">
                    True / False
                  </span>
                </button>
              </div>
            </div>

            {/* Column 3: Time Limit */}
            <div className="flex flex-col">
              {/* Icon and title */}
              <div className="flex items-center mb-[16px]">
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-[#1C0B43]"
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
                <p className="font-['Archivo'] text-[22px] font-normal text-[#1C0B43] text-left ml-[16px]">
                  Time Limit (minutes)
                </p>
              </div>

              {/* Input with +/- buttons */}
              <div className="flex items-center border-2 border-[#A6B5BB] rounded-[16px] p-[16px] w-[216px]">
                <button
                  onClick={() => setTimeLimit(Math.max(1, timeLimit - 1))}
                  className="text-[#1C0B43] font-bold text-xl"
                >
                  -
                </button>
                <span className="flex-1 text-center font-['Archivo'] text-[22px] font-normal text-[#1C0B43]">
                  {timeLimit}
                </span>
                <button
                  onClick={() => setTimeLimit(timeLimit + 1)}
                  className="text-[#1C0B43] font-bold text-xl"
                >
                  +
                </button>
              </div>

              {/* Suggested time text */}
              <div className="mt-[16px]">
                <p className="font-['Archivo'] text-[16px] font-normal text-[#A6B5BB] text-left">
                  Suggested time based on question count and difficulty
                </p>
              </div>
            </div>
          </div>

          {/* 32px spacing after question settings */}
          <div className="mb-[32px]" />

          {/* Continue button */}
          <div className="flex justify-center">
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`font-['Archivo'] text-[22px] font-semibold rounded-[24px] py-[27px] px-[134px] transition-all duration-200 ${
                isLoading
                  ? "text-[#ABABAB] bg-[#D6D6D6] cursor-not-allowed"
                  : "text-[#EFE9FC] bg-[#5F24E0] hover:bg-[#9F7CEC]"
              }`}
            >
              {isLoading ? "Generating..." : "Continue"}
            </button>
          </div>
          {error && (
            <div className="text-red-500 text-center mt-4">{error}</div>
          )}
        </div>

        {/* 38px spacing under the block */}
        <div className="mb-[38px]" />
      </div>
      {/* This is where you can access subtopicSuggestions for the next stage */}
      {subtopicSuggestions.length > 0 && (
        <div className="mt-10">
          <h2 className="font-['Archivo'] text-[32px] font-semibold text-[#1C0B43] text-left">
            Suggested Subtopics for Stage 2:
          </h2>
          <ul className="list-disc list-inside">
            {subtopicSuggestions.map((subtopic) => (
              <li
                key={subtopic.id}
                className="font-['Archivo'] text-[20px] text-[#A6B5BB]"
              >
                {subtopic.text}
              </li>
            ))}
          </ul>
        </div>
      )}
    </MainLayout>
  );
}
