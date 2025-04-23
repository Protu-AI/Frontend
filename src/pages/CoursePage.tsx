import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import { MainLayout } from "@/layouts/MainLayout";
import React from 'react';
import { cn } from "@/lib/utils"; // Import cn for conditional classes
// Removed import for Button component

// Define a type for a lesson
interface Lesson {
  id: string;
  title: string;
  isFinished: boolean;
}

// Generate mock lessons with meaningful names (7 finished, 11 not finished)
const generateMockLessons = (): Lesson[] => {
  const lessonTitles = [
    "Introduction to Programming Concepts",
    "Setting Up Your Development Environment",
    "Understanding Variables and Data Types",
    "Control Flow: Conditionals and Loops",
    "Functions: Building Reusable Code",
    "Introduction to Object-Oriented Programming",
    "Working with Arrays and Collections",
    "Error Handling and Debugging",
    "File Input and Output",
    "Introduction to Algorithms",
    "Data Structures: Lists and Dictionaries",
    "Version Control with Git",
    "Introduction to Web Development",
    "Building Simple User Interfaces",
    "Working with APIs",
    "Database Fundamentals",
    "Testing Your Code",
    "Deployment Basics",
  ];

  const lessons: Lesson[] = [];
  for (let i = 0; i < lessonTitles.length; i++) {
    lessons.push({
      id: `lesson-${i + 1}`,
      title: lessonTitles[i],
      isFinished: i < 7, // First 7 are finished (index 0 to 6)
    });
  }
  return lessons;
};

const mockLessons = generateMockLessons();

const CoursePage = () => {
  const { courseName } = useParams();
  const navigate = useNavigate(); // Initialize useNavigate

  // Function to format the course name slug back to a readable title
  const formatCourseName = (courseName: string) => {
    return courseName
      .replace(/-/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const courseTitle = formatCourseName(courseName || '');

  const handleLessonClick = (lesson: Lesson) => {
    console.log(`Lesson clicked: ${lesson.title}`);
    // Navigate to the lesson page using the lesson ID
    navigate(`/lesson/${lesson.id}`);
  };

  // Find the first not finished lesson
  const nextNotFinishedLesson = mockLessons.find(lesson => !lesson.isFinished);

  // Calculate finished and total lessons
  const finishedLessonsCount = mockLessons.filter(lesson => lesson.isFinished).length;
  const totalLessonsCount = mockLessons.length;
  const completionPercentage = totalLessonsCount > 0 ? Math.floor((finishedLessonsCount / totalLessonsCount) * 100) : 0;


  return (
    <MainLayout>
      {/* Main container: scrollable, top margin */}
      <div className="flex flex-col items-center justify-start w-full overflow-y-auto h-full mt-[128px]">
        {/* Content container with horizontal margins */}
        <div className="w-full px-[170px]">
          {/* First Rectangle */}
          <div className="bg-[#5F24E0] rounded-[32px] p-[64px] flex flex-col"> {/* Changed to flex-col */}
            {/* First Row */}
            <div className="flex items-center"> {/* Added flex and items-center */}
              {/* First Column: Icon */}
              <div className="flex items-center mr-[32px]"> {/* Added mr-[32px] */}
                <img
                  src="https://img.icons8.com/ios-filled/100/EFE9FC/html-5.png" // Example icon, color changed to EFE9FC
                  alt="Course Icon"
                  className="w-[110px] h-auto" // Set width to 110px
                />
              </div>

              {/* Second Column: Course Info */}
              <div className="flex-1 flex flex-col justify-center"> {/* flex-1 to take remaining space */}
                <span className="font-['Archivo'] text-[32px] font-normal text-[#EFE9FC] text-left mb-[16px]"> {/* Changed font-weight to normal, added mb-[16px], text-left */}
                  Course
                </span>
                <h2 className="font-['Archivo'] text-[42px] font-semibold text-[#EFE9FC] text-left"> {/* Changed font-size to 42px */}
                  {courseTitle}
                </h2>
              </div>

              {/* Third Column: Lesson Count */}
              <div className="flex items-center ml-[32px]"> {/* Added ml-[32px] */}
                <img
                  src="https://img.icons8.com/ios-filled/26/EFE9FC/open-book.png" // Changed to open book icon
                  alt="Book Icon"
                  className="w-[26px] h-auto mr-[8px]" // Set width to 26px, added mr-[8px]
                />
                <span className="font-['Archivo'] text-[22px] font-semibold text-[#EFE9FC]"> {/* Adjusted font-size and color */}
                  {finishedLessonsCount}/{totalLessonsCount} Lessons
                </span>
              </div>
            </div>

            {/* Spacing below the first row */}
            <div className="h-[64px]"></div>

            {/* Second Row: Description */}
            <div className="w-[1000px] font-['Archivo'] text-[24px] font-normal text-[#EFE9FC] text-left"> {/* Set width, font, color, and alignment */}
              Start your web development journey by mastering the fundamentals of HTML and CSS. Learn how to structure pages, apply styles, and create responsive layouts using Flexbox and Grid.
            </div>

            {/* Spacing below the description */}
            <div className="h-[32px]"></div>

            {/* Third Row: Continue Button */}
            <div className="flex justify-start"> {/* Align button to the left */}
              {/* Manually created Continue button for the first rectangle */}
              <button
                className="bg-[#EFE9FC] text-[#5F24E0] font-['Archivo'] text-[22px] font-semibold rounded-[16px] py-[12px] px-[48px] transition-colors duration-200 hover:bg-[#FFBF00]"
                onClick={() => {
                  // Handle continue action for the overall course
                  // Find the first not finished lesson and navigate to it
                  const firstNotFinished = mockLessons.find(lesson => !lesson.isFinished);
                  if (firstNotFinished) {
                    handleLessonClick(firstNotFinished);
                  } else {
                    console.log("All lessons finished!");
                    // Optionally navigate to a completion page or first lesson
                  }
                }}
              >
                Continue
              </button>
            </div>

            {/* Spacing below the first rectangle button */}
            <div className="h-[32px]"></div>

            {/* Progress Bar and Percentage */}
            <div className="flex items-center w-full">
              {/* Progress Bar Container */}
              <div className="flex-1 relative">
                 {/* Percentage Text */}
                <div className="absolute right-0 bottom-[calc(100%+8px)] font-['Archivo'] text-[32px] font-semibold text-[#EFE9FC]">
                  {completionPercentage}%
                </div>
                {/* Progress Bar */}
                <div className="w-full h-[11px] rounded-[9px] bg-[#EFE9FC] overflow-hidden">
                  <div
                    className="h-full bg-[#FFBF00] transition-all duration-500 ease-in-out"
                    style={{ width: `${completionPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Second Rectangle */}
          <div className="mt-[64px] rounded-[32px] shadow-[0px_2px_6px_rgba(0,0,0,0.2)] p-[32px] bg-[#FFFFFF]"> {/* Added bg-[#FFFFFF] */}
            {/* Course Title */}
            <h2 className="font-['Archivo'] text-[32px] font-semibold text-[#5F24E0] text-left mb-[32px]">
              {courseTitle}
            </h2>

            {/* Lessons List */}
            <div className="space-y-[16px]"> {/* Spacing between lessons */}
              {mockLessons.map(lesson => (
                <div
                  key={lesson.id}
                  className={cn(
                    "flex items-center rounded-[12px] cursor-pointer transition-colors duration-200",
                    lesson.isFinished ? "bg-[#FFFFFF] hover:bg-[#EFE9FC]" : "bg-[#FFFFFF] hover:bg-[#EFE9FC]", // Base background white, hover #EFE9FC
                    nextNotFinishedLesson && lesson.id === nextNotFinishedLesson.id
                      ? "bg-[#EFE9FC] hover:bg-[#EAE1FE] py-[7px] px-[32px]" // Next not finished: #EFE9FC background, different hover, 7px top/bottom, 32px left/right padding
                      : "py-[24px] px-[32px]" // Other lessons: 24px top/bottom, 32px left/right padding
                  )}
                  onClick={() => handleLessonClick(lesson)}
                >
                  {/* Lesson Status Circle */}
                  <div
                    className={cn(
                      "w-[14px] h-[14px] rounded-full shrink-0",
                      lesson.isFinished
                        ? "bg-[#5F24E0]" // Finished: solid color
                        : "bg-white border border-[#5F24E0]" // Not finished: white with border
                    )}
                  ></div>

                  {/* Lesson Title */}
                  <span className="ml-[16px] font-['Archivo'] text-[24px] font-semibold text-[#1C0B43] text-left">
                    {lesson.title}
                  </span>

                  {/* Continue Button for the next not finished lesson */}
                  {nextNotFinishedLesson && lesson.id === nextNotFinishedLesson.id && (
                    // Manually created Continue button for lesson item
                    <button
                      className="ml-auto bg-[#5F24E0] text-[#EFE9FC] font-['Archivo'] text-[22px] font-semibold rounded-[16px] p-[17px] transition-colors duration-200 hover:bg-[#FFBF00] hover:text-[#5F24E0]" // Corrected padding to p-[17px]
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent lesson click when button is clicked
                        handleLessonClick(lesson); // Handle continue action
                      }}
                    >
                      Continue
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CoursePage;
