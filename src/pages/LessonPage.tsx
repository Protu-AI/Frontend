import { useParams } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";
import React, { useState } from 'react'; // Import useState
import { cn } from "@/lib/utils"; // Import cn for conditional classes
import { MessageCircle, X } from 'lucide-react'; // Import chat icon and X icon
import ReactMarkdown from 'react-markdown'; // Import ReactMarkdown
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { prism } from 'react-syntax-highlighter/dist/esm/styles/prism'; // Import a light mode style
import { useAuth } from "@/contexts/AuthContext"; // Import useAuth
import { LessonChatWindow } from "@/components/LessonChatWindow"; // Import the new component
import { motion, AnimatePresence } from 'framer-motion'; // Import motion and AnimatePresence

// Custom components for react-markdown rendering
const components = {
  h2: ({ node, ...props }) => (
    <h2 className="font-['Archivo'] font-medium text-[32px] text-[#5F24E0] text-left mt-0 mb-[24px]" {...props} />
  ),
  hr: ({ node, ...props }) => (
    <hr className="mt-0 mb-[24px] border-t border-[#D6D6D6]" {...props} />
  ),
  p: ({ node, ...props }) => (
    <p className="font-['Archivo'] font-medium text-[16px] text-[#1C0B43] text-left leading-[1.2] mt-0 mb-[24px]" {...props} />
  ),
  code: ({ node, inline, className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || '');
    const codeContent = String(children).replace(/\n$/, '');
    const { codeOutputs, handleRunCode } = React.useContext(LessonContext);
    const codeKey = codeContent;

    if (!inline && match) {
      return (
        <div className="bg-[#EFE9FC] rounded-[8px] p-[24px] mt-0 mb-[24px]">
          <SyntaxHighlighter
  style={prism}
  language={match[1]}
  PreTag="div"
  className="!bg-[#FFFFFF] border-l-[8px] border-[#5F24E0] px-[32px] py-[12px] !mt-0 !mb-[24px]"
>
  {String(children).replace(/\n$/, '')}
</SyntaxHighlighter>

          {codeOutputs[codeKey] && (
            <div className="bg-[#EFE9FC] rounded-[8px] mt-0 mb-[24px]">
              <div className="!bg-[#FFFFFF] border-l-[8px] border-[#FFBF00] px-[32px] py-[12px] font-['Archivo'] font-medium text-[16px] text-[#1C0B43] text-left leading-[1.2]">
                {codeOutputs[codeKey]}
              </div>
            </div>
          )}

          <button
            className="bg-[#5F24E0] text-[#EFE9FC] font-['Archivo'] text-[18px] font-semibold rounded-[16px] py-[12px] px-[24px] transition-colors duration-200 hover:bg-[#9F7CEC]"
            onClick={() => handleRunCode(codeKey, codeContent)}
          >
            Run
          </button>
        </div>
      );
    } else {
      return (
        <code className={`${className} mt-0 mb-[24px]`} {...props}>
          {children}
        </code>
      );
    }
  }
};

// Create a context to pass codeOutputs and handleRunCode to the components renderer
const LessonContext = React.createContext({
  codeOutputs: {},
  handleRunCode: (key: string, code: string) => {},
});


const LessonPage = () => {
  const { lessonId } = useParams(); // Assuming we'll use lessonId in the future
  const [isChatOpen, setIsChatOpen] = useState(false); // State to manage chat window visibility
  const { user } = useAuth(); // Get user from AuthContext
  const [codeOutputs, setCodeOutputs] = useState<{ [key: string]: string }>({}); // State to store code outputs

  // Mock data for the lesson based on lessonId
  const mockLesson = {
    id: lessonId,
    title: "HTML Styles", // Example title
    description: "The HTML style attribute is used to add styles to an element, such as color, font, size, and more.", // Example description
    content: `
## Introduction to HTML Styles

The \`style\` attribute is used to add styles to an element, such as color, font, size, and more. This attribute can be used on almost any HTML element, including \`<p>\`, \`<h1>\`, \`<body>\`, and many others.

---

## CSS Properties

You can add multiple CSS properties, separated by semicolons. This allows you to apply several styles to a single element at once.

\`\`\`html
<h1 style="color:red;margin-left:30px;">This is a heading</h1>
\`\`\`

This demonstrates how to apply both text color and a left margin to an \`<h1>\` element.

---

## Background Color

The \`background-color\` property defines the background color for an HTML element. This can be applied to elements like \`<body>\`, \`<div>\`, or \`<p>\`.

\`\`\`html
<body style="background-color:powderblue;">
  <h1>This is a heading</h1>
  <p>This is a paragraph.</p>
</body>
\`\`\`

---

## Text Color

The \`color\` property defines the text color for an HTML element.

\`\`\`html
<h1 style="color:blue;">This is a heading</h1>
<p style="color:red;">This is a paragraph.</p>
\`\`\`

---

## Fonts

The \`font-family\` property defines the font to be used for an HTML element. You can specify multiple font families as a fallback.

\`\`\`html
<h1 style="font-family:verdana;">This is a heading</h1>
<p style="font-family:courier;">This is a paragraph.</p>
\`\`\`

---

## Text Size

The \`font-size\` property defines the text size for an HTML element. You can use various units like pixels (\`px\`), ems (\`em\`), or percentages (\`%\`).

\`\`\`html
<h1 style="font-size:300%;">This is a heading</h1>
<p style="font-size:160%;">This is a paragraph.</p>
\`\`\`

---

## Text Alignment

The \`text-align\` property defines the horizontal text alignment for an HTML element. Common values are \`left\`, \`right\`, and \`center\`.

\`\`\`html
<h1 style="text-align:center;">This is a heading</h1>
<p>This is a paragraph.</p>
\`\`\`

---

## Example Code Block with Run Button

Here is an example of a code block that might include an internal heading and a "Run" button.

\`\`\`javascript
// Example: Simple JavaScript function
function greet(name) {
  console.log("Hello, " + name + "!");
}

greet("World");
\`\`\`

This code block demonstrates a basic JavaScript function. In a real interactive lesson, there would be a "Run" button below this block to execute the code.

---

This concludes the basic introduction to HTML styles. Practice using these attributes to change the appearance of your web pages!
    `, // Example content (using markdown for now)
  };

  const handleViewCourseClick = () => {
    console.log("View Course button clicked");
    // Implement navigation to the course page later
  };

  const handleNextLessonClick = () => {
    console.log("Next Lesson button clicked");
    // Implement navigation to the next lesson later
  };

  // Placeholder function to simulate running code and getting output
  const handleRunCode = (key: string, code: string) => {
    console.log("Running code:", code);
    // Simulate fetching output from backend
    setTimeout(() => {
      const simulatedOutput = `Simulated output for:\n${code.substring(0, 50)}...`;
      setCodeOutputs(prev => ({ ...prev, [key]: simulatedOutput }));
    }, 1000); // Simulate network delay
  };

  // Positions for the animated button relative to the viewport
  const closedPosition = { right: '128px', top: '144px' }; // Position when chat is closed
  const openPosition = { right: '160px', top: '96px' }; // Position when chat is open

  return (
    <MainLayout>
      {/* Main container: scrollable, top margin */}
      <div className="flex justify-start w-full overflow-y-auto h-full mt-[64px]"> {/* Adjusted top margin and removed items-center */}
        {/* Content container with horizontal margins and dynamic width */}
        <div className={cn("flex flex-col items-center w-full transition-all duration-300 ease-in-out pl-[128px]", isChatOpen ? "w-[calc(100%-592px)] pr-[32px]" : "w-full pr-[128px]")}> {/* Adjusted horizontal margins and added dynamic width */}
          {/* First Row */}
          <div className="flex items-center justify-between w-full"> {/* Flex container for the first row, added w-full */}
            {/* Left side: Border, Title, and Description */}
            <div className="flex items-start"> {/* Flex container for border and text */}
              {/* Border */}
              <div className="w-[6px] h-[80px] bg-[#5F24E0] rounded-md shrink-0"></div> {/* Adjusted border height */}
              {/* Spacing */}
              <div className="w-[8px] shrink-0"></div> {/* Added spacing */}
              {/* Title and Description */}
              <div className="flex flex-col items-start"> {/* Flex column for texts */}
                <h1 className="font-['Archivo'] text-[42px] font-semibold text-[#5F24E0] text-left mb-[8px]"> {/* Title style */}
                  {mockLesson.title}
                </h1>
                <p className="font-['Archivo'] text-[18px] font-semibold text-[#A6B5BB] text-left"> {/* Description style */}
                  {mockLesson.description}
                </p>
              </div>
            </div>
          </div>

          {/* Spacing after the first row */}
          <div className="h-[64px] shrink-0"></div> {/* Added spacing and shrink-0 */}

          {/* Lesson Content Block */}
          <div className="rounded-[32px] shadow-[0px_2px_6px_rgba(0,0,0,0.2)] p-[32px] bg-[#FFFFFF] w-full"> {/* Added styling and w-full */}
            {/* Lesson content goes here */}
            <LessonContext.Provider value={{ codeOutputs, handleRunCode }}>
              <ReactMarkdown components={components}>
                {mockLesson.content}
              </ReactMarkdown>
            </LessonContext.Provider>

            {/* End of Lesson Buttons */}
            <div className="flex justify-between mt-[64px]"> {/* Added spacing above buttons */}
              {/* View Course Button */}
              <button
                className="font-['Archivo'] text-[18px] font-semibold text-center rounded-[16px] py-[16px] px-[18px] border-[3px] border-[#5F24E0] text-[#5F24E0] transition-colors duration-200 hover:bg-[#5F24E0] hover:text-[#EFE9FC]"
                onClick={handleViewCourseClick}
              >
                View Course
              </button>

              {/* Next Lesson Button */}
              <button
                className="font-['Archivo'] text-[18px] font-semibold text-center rounded-[16px] py-[16px] px-[18px] border-[3px] border-[#5F24E0] text-[#EFE9FC] bg-[#5F24E0] transition-colors duration-200 hover:bg-[#9F7CEC]"
                onClick={handleNextLessonClick}
              >
                Next Lesson
              </button>
            </div>
          </div>
        </div>

        {/* Chat Window */}
        <LessonChatWindow
          isOpen={isChatOpen}
          setIsOpen={setIsChatOpen} // Pass the state setter
          userName={user?.userName || "Guest"} // Pass user name
        />
      </div>

      {/* Animated Chat Toggle Button (Single Circle) - Positioned OUTSIDE when chat is closed */}
      <motion.button
        className={cn(
          "fixed z-50 rounded-full flex items-center justify-center cursor-pointer transition-colors duration-200",
          isChatOpen ? "bg-transparent text-[#5F24E0] dark:text-[#FFBF00] w-[20px] h-[20px]" : "bg-[#5F24E0] hover:bg-[#9F7CEC] w-[80px] h-[80px]"
        )}
        initial={closedPosition}
        animate={isChatOpen ? openPosition : closedPosition}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        onClick={() => setIsChatOpen(!isChatOpen)}
        style={{
           right: isChatOpen ? '160px' : '128px',
           top: isChatOpen ? '96px' : '144px',
        }}
      >
        <AnimatePresence mode="wait">
          {isChatOpen ? (
            // X icon when chat is open
            <motion.div
              key="close-icon"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
            >
              <X className="w-[20px] h-[20px] stroke-[4px]" /> {/* X icon */}
            </motion.div>
          ) : (
            // Chat icon when chat is closed
            <motion.div
              key="chat-icon"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
            >
              <MessageCircle className="w-[40px] h-[40px] text-[#FFBF00]" /> {/* Chat icon */}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </MainLayout>
  );
};

export default LessonPage;
