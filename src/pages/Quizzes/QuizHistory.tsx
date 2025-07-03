import React, { useState, useEffect, useCallback } from "react";
import { MainLayout } from "../../layouts/MainLayout";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // Assuming you have react-toastify for notifications
import { config } from "../../../config";

// Define interfaces for quiz and draft data (assuming API response structure)
interface Quiz {
  id: string;
  title: string;
  topic: string;
  duration: string; // Or number, depending on API
  dateTaken: string; // ISO string or similar
  score: number;
  status: "passed" | "failed";
}

interface DraftQuiz {
  id: string;
  title: string;
  topic: string;
  createdDate: string; // ISO string or similar
}

interface SummaryData {
  totalQuizzes: number;
  averageScore: number;
  successRate: number;
}

const PAGE_SIZE = 5;

export default function QuizHistory() {
  const navigate = useNavigate();

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [draftQuizzes, setDraftQuizzes] = useState<DraftQuiz[]>([]);
  const [summaryData, setSummaryData] = useState<SummaryData>({
    totalQuizzes: 0,
    averageScore: 0,
    successRate: 0,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // New loading state

  const [activeFilter, setActiveFilter] = useState<"passed" | "failed">(
    "passed"
  );
  const [showDrafts, setShowDrafts] = useState<boolean>(false);

  // Pagination states
  const [quizPage, setQuizPage] = useState<number>(1);
  const [draftPage, setDraftPage] = useState<number>(1);
  const [hasMoreQuizzes, setHasMoreQuizzes] = useState<boolean>(true);
  const [hasMoreDrafts, setHasMoreDrafts] = useState<boolean>(true);

  // Sorting states
  const [sortBy, setSortBy] = useState<"date" | "topic" | "score" | null>(
    "date"
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  function formatDuration(
    dateIsoString: string,
    hoursToAdd: number = 3
  ): string {
    // 1. Create a Date object from the ISO string.
    // When parsing an ISO string with 'Z', the Date object's internal value will be UTC.
    const date = new Date(dateIsoString);

    // 2. Add the specified hours to the UTC hour component of the date.
    // We use getUTCHours() and setUTCHours() to manipulate the UTC components directly,
    // ensuring the addition is consistent regardless of the client's local timezone.
    date.setUTCHours(date.getUTCHours() + hoursToAdd);

    // 3. Extract the hour, minute, and second components from the *adjusted UTC time*.
    // Then format them with leading zeros.
    const hours: number = date.getUTCHours();
    const minutes: number = date.getUTCMinutes();

    const paddedHours: string = String(hours).padStart(2, "0");
    const paddedMinutes: string = String(minutes).padStart(2, "0");

    return `${paddedHours}:${paddedMinutes}`;
  }

  const formatDate = (dateString: string) => {
    // --- DEBUGGING LOGS ---
    console.log("formatDate input:", { dateString, type: typeof dateString });

    if (!dateString) {
      console.warn("formatDate received empty or null string:", dateString);
      return "N/A"; // Or any fallback text
    }

    const date = new Date(dateString);
    console.log("Date object created:", date); // Check if it's "Invalid Date" here

    if (isNaN(date.getTime())) {
      // Check if the date object is invalid
      console.error("Invalid Date object created for string:", dateString);
      return "Invalid Date"; // Return a specific error message for debugging
    }
    // --- END DEBUGGING LOGS ---

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Helper function to get the authorization token
  const getAuthToken = () => {
    return localStorage.getItem("token"); // Assuming token is stored here
  };

  const loadQuizzes = useCallback(
    async (
      filter: "passed" | "failed",
      page: number,
      pageSize: number,
      sortByKey: string | null,
      sortOrder: "asc" | "desc",
      append: boolean = false
    ) => {
      setLoading(true);
      setError(null);
      const token = getAuthToken();
      if (!token) {
        toast.error("Authentication token not found. Please log in.");
        setLoading(false);
        navigate("/login");
        return;
      }

      // Construct URL parameters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pageSize.toString(), // Use 'limit' if your backend expects it for page size
        // Map frontend sort keys to backend keys if different
        sortBy: sortByKey === "date" ? "dateTaken" : sortByKey || "dateTaken",
        sortOrder: sortOrder,
      });

      const url = `${
        config.apiUrl
      }/v1/quizzes/dashboard/${filter}?${params.toString()}`;
      console.log(`Fetching quizzes from: ${url}`); // DEBUG

      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("API Error Response:", errorData); // DEBUG
          throw new Error(errorData.message || "Failed to fetch quizzes");
        }

        const responseBody = await response.json(); // Get the full response body
        console.log(`Full API response body for ${filter}:`, responseBody); // DEBUG

        // --- IMPORTANT CHANGE HERE ---
        // Access the 'data' property from the responseBody
        const apiData = responseBody.data;

        if (!apiData || !Array.isArray(apiData.quizzes)) {
          console.error(
            "API response 'data.quizzes' is not an array or missing 'data':",
            apiData
          ); // DEBUG
          throw new Error(
            "Invalid data format from API: quizzes array missing."
          );
        }

        // Map API response fields to your frontend Quiz interface
        const fetchedQuizzes: Quiz[] = apiData.quizzes.map((q: any) => ({
          id: q.id, // Map 'id'
          title: q.title,
          topic: q.topic,
          score: q.score,
          dateTaken: q.dateTaken ? String(q.dateTaken) : "",
          duration: formatDuration(q.dateTaken), // Convert timeTaken (seconds) to "X min"
          status: q.score >= 70 ? "passed" : "failed", // Assuming 70% is passing
        }));

        // Determine hasMore based on pagination data
        const hasMore =
          apiData.pagination.currentPage < apiData.pagination.totalPages;

        console.log(`Processed quizzes for UI:`, fetchedQuizzes); // DEBUG
        console.log(`hasMore set to:`, hasMore); // DEBUG

        if (append) {
          setQuizzes((prev) => [...prev, ...fetchedQuizzes]);
        } else {
          setQuizzes(fetchedQuizzes);
        }
        setHasMoreQuizzes(hasMore);
      } catch (err: any) {
        console.error("Caught error during quiz fetch:", err); // DEBUG
        setError(
          err.message || "Failed to load quizzes. Please try again later."
        );
        toast.error(err.message || "Failed to load quizzes.");
      } finally {
        setLoading(false);
        console.log("Loading set to false."); // DEBUG
      }
    },
    [navigate]
  );
  const loadDraftQuizzes = useCallback(
    async (
      page: number,
      pageSize: number,
      sortByKey: string | null,
      sortOrder: "asc" | "desc",
      append: boolean = false
    ) => {
      setLoading(true);
      setError(null);
      const token = getAuthToken();
      if (!token) {
        toast.error("Authentication token not found. Please log in.");
        setLoading(false);
        navigate("/login");
        return;
      }

      const actualSortByKey = sortByKey === "date" ? "createdDate" : sortByKey; // Map 'date' to 'createdDate'

      const params = new URLSearchParams({
        page: page.toString(),
        limit: pageSize.toString(),
      });
      if (actualSortByKey) {
        params.append("sortBy", actualSortByKey);
      }
      params.append("sortOrder", sortOrder);

      const url = `${
        config.apiUrl
      }/v1/quizzes/dashboard/drafts?${params.toString()}`;
      console.log(`Fetching draft quizzes from: ${url}`); // DEBUG

      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("API Error Response for drafts:", errorData); // DEBUG
          throw new Error(errorData.message || "Failed to fetch draft quizzes");
        }

        const responseBody = await response.json();
        console.log("Full API response body for drafts:", responseBody); // DEBUG

        // --- IMPORTANT CHANGE HERE FOR DRAFTS (IF APPLICABLE) ---
        const apiData = responseBody.data; // Assuming drafts also have 'data' wrapper

        if (!apiData || !Array.isArray(apiData.quizzes)) {
          // Check for 'drafts' array
          console.error(
            "API response 'data.drafts' is not an array or missing 'data':",
            apiData
          ); // DEBUG
          throw new Error(
            "Invalid data format from API: drafts array missing."
          );
        }

        const fetchedDrafts: DraftQuiz[] = apiData.quizzes.map((d: any) => ({
          id: d.id,
          title: d.title,
          topic: d.topic,
          createdDate: d.createdDate,
        }));

        const hasMore =
          apiData.pagination.currentPage < apiData.pagination.totalPages; // Assuming pagination for drafts too

        console.log("Processed drafts for UI:", fetchedDrafts); // DEBUG
        console.log("hasMoreDrafts set to:", hasMore); // DEBUG

        if (append) {
          setDraftQuizzes((prev) => [...prev, ...fetchedDrafts]);
        } else {
          setDraftQuizzes(fetchedDrafts);
        }
        setHasMoreDrafts(hasMore);
      } catch (err: any) {
        console.error("Caught error during draft fetch:", err); // DEBUG
        setError(
          err.message || "Failed to load draft quizzes. Please try again later."
        );
        toast.error(err.message || "Failed to load draft quizzes.");
      } finally {
        setLoading(false);
        console.log("Loading set to false for drafts."); // DEBUG
      }
    },
    [navigate]
  );
  const getSummaryData = useCallback(async () => {
    const token = getAuthToken();
    if (!token) {
      toast.error("Authentication token not found. Please log in.");
      navigate("/login");
      return;
    }

    const url = `${config.apiUrl}/v1/quizzes/dashboard/summary`; // Assuming a summary endpoint

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch summary data");
      }

      const data = await response.json();
      setSummaryData(data.data); // Assuming data directly matches SummaryData interface
    } catch (err: any) {
      console.error("Failed to fetch summary data:", err);
      setError(
        err.message || "Failed to load dashboard data. Please try again later."
      );
      toast.error(err.message || "Failed to load dashboard data.");
    }
  }, [navigate]);

  // Load initial quizzes and summary data on component mount or filter/sort change
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        await getSummaryData();
        // Load quizzes for the initial active filter
        setQuizPage(1); // Reset page to 1 when filter/sort changes
        setHasMoreQuizzes(true); // Assume more until proven otherwise
        loadQuizzes(activeFilter, 1, PAGE_SIZE, sortBy, sortDirection, false);
      } catch (err) {
        // Error handling already in getSummaryData and loadQuizzes
      } finally {
        setLoading(false); // Set loading to false after all initial fetches
      }
    };
    fetchData();
  }, [activeFilter, sortBy, sortDirection, loadQuizzes, getSummaryData]);

  // Load draft quizzes when showDrafts changes or draft sorting changes
  useEffect(() => {
    if (showDrafts) {
      setDraftPage(1); // Reset page to 1 when showing drafts or draft sort changes
      setHasMoreDrafts(true); // Assume more until proven otherwise
      // For drafts, 'date' sortBy maps to 'createdDate'
      const draftSortBy =
        sortBy === "score" ? null : sortBy === "date" ? "createdDate" : sortBy;
      loadDraftQuizzes(1, PAGE_SIZE, draftSortBy, sortDirection, false);
    } else {
      setDraftQuizzes([]); // Clear drafts when not shown
    }
  }, [showDrafts, sortBy, sortDirection, loadDraftQuizzes]);

  const handleLoadMoreQuizzes = () => {
    setQuizPage((prev) => prev + 1);
    loadQuizzes(
      activeFilter,
      quizPage + 1,
      PAGE_SIZE,
      sortBy,
      sortDirection,
      true
    );
  };

  const handleLoadMoreDrafts = () => {
    setDraftPage((prev) => prev + 1);
    // For drafts, 'date' sortBy maps to 'createdDate'
    const draftSortBy =
      sortBy === "score" ? null : sortBy === "date" ? "createdDate" : sortBy;
    loadDraftQuizzes(
      draftPage + 1,
      PAGE_SIZE,
      draftSortBy,
      sortDirection,
      true
    );
  };

  const handleFilterChange = (filter: "passed" | "failed") => {
    setActiveFilter(filter);
    setShowDrafts(false); // Hide drafts when changing main filter
    setQuizPage(1); // Reset page for quizzes
    setHasMoreQuizzes(true);
    // Data will be reloaded by useEffect
  };

  const handleToggleDrafts = () => {
    setShowDrafts((prev) => !prev);
    // Data will be reloaded by useEffect if drafts are shown
  };

  const handleSort = (key: "date" | "topic" | "score") => {
    if (sortBy === key) {
      // Toggle sort direction if clicking the same sort key
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      // Set new sort key and default to descending
      setSortBy(key);
      setSortDirection("desc");
    }
    setQuizPage(1); // Reset page for quizzes
    setDraftPage(1); // Reset page for drafts
    setHasMoreQuizzes(true);
    setHasMoreDrafts(true);
    // Data will be reloaded by useEffect
  };

  const handleStartQuiz = (id: string) => {
    navigate(`/quizzes/take/${id}`);
  };

  const handleDeleteDraft = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete draft "${title}"?`)) {
      const token = getAuthToken();
      if (!token) {
        toast.error("Authentication token not found. Please log in.");
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(
          `${config.apiUrl}/v1/quizzes/drafts/${id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to delete draft");
        }

        toast.success(`Draft "${title}" deleted successfully!`);
        // Re-fetch drafts to update the list and handle pagination correctly
        const draftSortBy =
          sortBy === "score"
            ? null
            : sortBy === "date"
            ? "createdDate"
            : sortBy;
        loadDraftQuizzes(
          draftPage,
          PAGE_SIZE,
          draftSortBy,
          sortDirection,
          false
        );
      } catch (err: any) {
        console.error("Failed to delete draft:", err);
        toast.error(err.message || "Failed to delete draft.");
      }
    }
  };

  if (error) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-full">
          <p className="text-red-500">{error}</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex flex-col w-full overflow-y-auto h-full pt-[64px] px-[128px]">
        {/* Header Section with Button */}
        <div className="flex justify-between items-start mb-[68px]">
          {/* Header Texts */}
          <div className="text-left">
            <h1 className="font-['Archivo'] text-[64px] font-semibold text-[#5F24E0] mb-[6px] text-left">
              Your Quiz Dashboard
            </h1>
            <p className="font-['Archivo'] text-[22px] font-normal text-[#A6B5BB] text-left">
              Track your progress, review past quizzes, and keep improving your
              skills
            </p>
          </div>

          {/* Generate New Quiz Button */}
          <button
            onClick={() => navigate("/quizzes/generate")}
            className="text-[#EFE9FC] font-['Archivo'] text-[28px] font-semibold rounded-[24px] py-[24px] px-[64px] transition-all duration-200 flex items-center gap-[16px] group hover:shadow-[inset_0px_0px_9px_#FFFFFF,_0px_6px_38px_#FFBF0036,_0_0_0_3px_#FFBF0080]"
            style={{
              background: "radial-gradient(circle, #BFA7F3 0%, #5F24E0 100%)",
              boxShadow: "inset 0px 0px 9px #FFFFFF, 0px 42px 38px #BFA7F336",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow =
                "inset 0px 0px 9px #FFFFFF, 0px 6px 38px #FFBF0036, 0 0 0 3px #FFBF0080";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow =
                "inset 0px 0px 9px #FFFFFF, 0px 42px 38px #BFA7F336";
            }}
          >
            <svg
              width="45"
              height="45"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-[#EFE9FC] group-hover:text-[#FFBF00] transition-colors duration-200"
              strokeWidth="2"
            >
              <path
                d="M12 5V19"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5 12H19"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Generate New Quiz
          </button>
        </div>

        {/* Stats Cards Section */}
        <div className="flex gap-[48px] mb-[64px]">
          {/* Total Quizzes Card */}
          <div
            className="rounded-[24px] p-[24px] flex-1 text-left"
            style={{
              background:
                "linear-gradient(60deg, #D3C2F680 0%, #EFE9FC80 100%)",
            }}
          >
            <div className="bg-[#FFFFFF] rounded-[12px] w-[56px] h-[56px] flex items-center justify-center mb-[24px]">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-[#5F24E0]"
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
            </div>
            <h3 className="font-['Archivo'] text-[24px] font-semibold text-left mb-[16px]">
              Total Quizzes
            </h3>
            <p className="font-['Archivo'] text-[48px] font-semibold text-[#5F24E0] text-left">
              {summaryData.totalQuizzes}
            </p>
          </div>

          {/* Average Score Card */}
          <div
            className="rounded-[24px] p-[24px] flex-1 text-left"
            style={{
              background:
                "linear-gradient(241deg, #FFE8A280 0%, #FFF9E680 100%)",
            }}
          >
            <div className="bg-[#FFFFFF] rounded-[12px] w-[56px] h-[56px] flex items-center justify-center mb-[24px]">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-[#FFBF00]"
                strokeWidth="2"
              >
                <path
                  d="M3 3V21H21"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7 12L12 7L16 11L21 6"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M17 6H21V10"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3 className="font-['Archivo'] text-[24px] font-semibold text-left mb-[16px]">
              Average Score
            </h3>
            <p className="font-['Archivo'] text-[48px] font-semibold text-[#FFBF00] text-left">
              {summaryData.averageScore.toFixed(2)}%
            </p>
          </div>

          {/* Success Rate Card */}
          <div
            className="rounded-[24px] p-[24px] flex-1 text-left"
            style={{
              background:
                "linear-gradient(60deg, #C0F1DA80 0%, #EEFBF580 100%)",
            }}
          >
            <div className="bg-[#FFFFFF] rounded-[12px] w-[56px] h-[56px] flex items-center justify-center mb-[24px]">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-[#52D999]"
                strokeWidth="2"
              >
                <path
                  d="M6 9L12 15L18 9"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 3V15"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3 21H21"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3 className="font-['Archivo'] text-[24px] font-semibold text-left mb-[16px]">
              Success Rate
            </h3>
            <p className="font-['Archivo'] text-[48px] font-semibold text-[#52D999] text-left">
              {summaryData.successRate.toFixed(2)}%
            </p>
          </div>
        </div>

        {/* Quiz History Section */}
        <div
          className="w-full p-[35px] bg-[#FFFFFF] rounded-[32px]"
          style={{
            boxShadow: "0px 2px 6px #00000014",
          }}
        >
          {/* Header with Filter Buttons */}
          <div className="flex justify-between items-center mb-[24px]">
            {/* Quiz History Title */}
            <h2 className="font-['Archivo'] text-[32px] font-semibold text-[#1C0B43] text-left">
              Quiz History
            </h2>

            {/* Filter Buttons */}
            <div className="flex items-center gap-[24px]">
              {/* Passed/Failed Toggle Group */}
              <div className="flex">
                <button
                  onClick={() => handleFilterChange("passed")}
                  className={`font-['Archivo'] text-[16px] font-semibold text-center py-[16px] px-[24px] rounded-l-[16px] transition-colors duration-200 ${
                    activeFilter === "passed"
                      ? "bg-[#5F24E0] text-[#EFE9FC]"
                      : "bg-[#EFE9FC] text-[#1C0B43]"
                  }`}
                >
                  Passed
                </button>
                <button
                  onClick={() => handleFilterChange("failed")}
                  className={`font-['Archivo'] text-[16px] font-semibold text-center py-[16px] px-[24px] rounded-r-[16px] transition-colors duration-200 ${
                    activeFilter === "failed"
                      ? "bg-[#5F24E0] text-[#EFE9FC]"
                      : "bg-[#EFE9FC] text-[#1C0B43]"
                  }`}
                >
                  Failed
                </button>
              </div>

              {/* Drafts Button */}
              <button
                onClick={handleToggleDrafts}
                className={`font-['Archivo'] text-[16px] font-semibold text-center py-[16px] px-[24px] rounded-[16px] transition-colors duration-200 ${
                  showDrafts
                    ? "bg-[#5F24E0] text-[#EFE9FC]"
                    : "bg-[#EFE9FC] text-[#1C0B43]"
                }`}
              >
                Drafts
              </button>
            </div>
          </div>

          {/* Sort By Section */}
          <div className="flex justify-end mb-[24px]">
            <div className="flex items-center gap-[8px]">
              <span className="font-['Archivo'] text-[20px] font-medium text-[#A6B5BB]">
                Sort By:
              </span>

              {/* Date Sort */}
              <button
                onClick={() => handleSort("date")}
                className={`font-['Archivo'] text-[20px] font-medium text-left flex items-center gap-[4px] transition-colors duration-200 ${
                  sortBy === "date" ? "text-[#5F24E0]" : "text-[#A6B5BB]"
                }`}
              >
                Date
                {sortBy === "date" && (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-[#5F24E0]"
                    strokeWidth="2"
                  >
                    {sortDirection === "asc" ? (
                      <path
                        d="M7 14L12 9L17 14"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    ) : (
                      <path
                        d="M7 10L12 15L17 10"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    )}
                  </svg>
                )}
              </button>

              {/* Topic Sort */}
              <button
                onClick={() => handleSort("topic")}
                className={`font-['Archivo'] text-[20px] font-medium text-left flex items-center gap-[4px] transition-colors duration-200 ${
                  sortBy === "topic" ? "text-[#5F24E0]" : "text-[#A6B5BB]"
                }`}
              >
                Topic
                {sortBy === "topic" && (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-[#5F24E0]"
                    strokeWidth="2"
                  >
                    {sortDirection === "asc" ? (
                      <path
                        d="M7 14L12 9L17 14"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    ) : (
                      <path
                        d="M7 10L12 15L17 10"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    )}
                  </svg>
                )}
              </button>

              {/* Score Sort (only applicable for completed quizzes) */}
              {!showDrafts && (
                <button
                  onClick={() => handleSort("score")}
                  className={`font-['Archivo'] text-[20px] font-medium text-left flex items-center gap-[4px] transition-colors duration-200 ${
                    sortBy === "score" ? "text-[#5F24E0]" : "text-[#A6B5BB]"
                  }`}
                >
                  Score
                  {sortBy === "score" && (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-[#5F24E0]"
                      strokeWidth="2"
                    >
                      {sortDirection === "asc" ? (
                        <path
                          d="M7 14L12 9L17 14"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      ) : (
                        <path
                          d="M7 10L12 15L17 10"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      )}
                    </svg>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Quiz List (Passed/Failed) */}
          {!showDrafts && (
            <div className="space-y-[16px]">
              {loading && quizzes.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Loading quizzes...
                </div>
              ) : quizzes && quizzes.length > 0 ? (
                quizzes.map((quiz) => (
                  <div
                    key={quiz.id}
                    className="w-full p-[24px] rounded-[16px] border border-[#A6B5BB] flex justify-between items-center"
                  >
                    {/* Left Side - Title and Tags */}
                    <div className="flex flex-col">
                      {/* Quiz Title */}
                      <h3 className="font-['Archivo'] text-[32px] font-medium text-[#1C0B43] text-left mb-[20px]">
                        {quiz.title}
                      </h3>

                      {/* Tags */}
                      <div className="flex items-center gap-[20px]">
                        {/* Topic Tag */}
                        <div className="flex items-center gap-[8px] bg-[#EFE9FC] rounded-[16px] py-[4px] px-[12px]">
                          <svg
                            width="18"
                            height="18"
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
                          <span className="font-['Archivo'] text-[18px] font-medium text-[#1C0B43] text-left">
                            {quiz.topic}
                          </span>
                        </div>

                        {/* Duration Tag */}
                        <div className="flex items-center gap-[8px] bg-[#EFE9FC] rounded-[16px] py-[4px] px-[12px]">
                          <svg
                            width="18"
                            height="18"
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
                          <span className="font-['Archivo'] text-[18px] font-medium text-[#1C0B43] text-left">
                            {quiz.duration}
                          </span>
                        </div>

                        {/* Date Tag */}
                        <div className="flex items-center gap-[8px] bg-[#EFE9FC] rounded-[16px] py-[4px] px-[12px]">
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="text-[#1C0B43]"
                            strokeWidth="2"
                          >
                            <rect
                              x="3"
                              y="4"
                              width="18"
                              height="18"
                              rx="2"
                              ry="2"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <line
                              x1="16"
                              y1="2"
                              x2="16"
                              y2="6"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <line
                              x1="8"
                              y1="2"
                              x2="8"
                              y2="6"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <line
                              x1="3"
                              y1="10"
                              x2="21"
                              y2="10"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <span className="font-['Archivo'] text-[18px] font-medium text-[#1C0B43] text-left">
                            {formatDate(quiz.dateTaken)}
                            {/* Format date */}
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* Right Side - Buttons and Grade */}
                    <div className="flex items-center gap-[24px]">
                      {/* Grade */}
                      <div className="flex flex-col items-center">
                        <p
                          className={`font-['Archivo'] text-[32px] font-semibold text-center mb-[2px] ${
                            quiz.status === "passed"
                              ? "text-[#52D999]"
                              : "text-[#870056]"
                          }`}
                        >
                          {quiz.score.toFixed(1)}%
                        </p>
                        <p
                          className={`font-['Archivo'] text-[22px] font-semibold text-center ${
                            quiz.status === "passed"
                              ? "text-[#52D999]"
                              : "text-[#870056]"
                          }`}
                        >
                          {quiz.status === "passed" ? "Passed" : "Failed"}
                        </p>
                      </div>

                      {/* Preview Button */}
                      <button className="p-[12px] rounded-[16px] bg-[#EFE9FC] hover:bg-[#9F7CEC] transition-colors duration-200 group">
                        <svg
                          width="22"
                          height="22"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="text-[#5F24E0] group-hover:text-[#EFE9FC]"
                          strokeWidth="2"
                        >
                          <path
                            d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <circle
                            cx="12"
                            cy="12"
                            r="3"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>

                      {/* Retry Button */}
                      <button
                        onClick={() => navigate(`/quizzes/take/${quiz.id}`)} // Use _id for navigation
                        className="p-[12px] rounded-[16px] bg-[#EFE9FC] hover:bg-[#9F7CEC] transition-colors duration-200 group"
                      >
                        <svg
                          width="22"
                          height="22"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="text-[#5F24E0] group-hover:text-[#EFE9FC]"
                          strokeWidth="2"
                        >
                          <path
                            d="M1 4V10H7"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M3.51 15A9 9 0 1 0 6 5L1 10"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No quizzes found for {activeFilter} quizzes
                </div>
              )}
              {hasMoreQuizzes && (
                <div className="flex justify-center mt-4">
                  <button
                    onClick={handleLoadMoreQuizzes}
                    disabled={loading}
                    className="py-[12px] px-[24px] rounded-[16px] bg-[#EFE9FC] hover:bg-[#9F7CEC] transition-colors duration-200 font-['Archivo'] text-[16px] font-semibold text-center text-[#5F24E0] hover:text-[#EFE9FC] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Loading..." : "Load More Quizzes"}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Draft Quizzes Section - Show when showDrafts is true */}
          {showDrafts && (
            <>
              {/* Spacing */}
              <div className="mb-[24px]"></div>

              {/* Horizontal Line */}
              <div className="w-full h-[1px] bg-[#A6B5BB] mb-[24px]"></div>

              {/* Draft Quizzes Header */}
              <h3 className="font-['Archivo'] text-[32px] font-semibold text-[#1C0B43] text-left mb-[24px]">
                Draft Quizzes
              </h3>

              {/* Draft Quiz List */}
              <div className="space-y-[16px]">
                {loading && draftQuizzes.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Loading draft quizzes...
                  </div>
                ) : draftQuizzes && draftQuizzes.length > 0 ? (
                  draftQuizzes.map((draft) => (
                    <div
                      key={draft.id} // Use _id from API
                      className="w-full p-[24px] rounded-[16px] border border-[#A6B5BB] flex justify-between items-center"
                    >
                      {/* Left Side - Title and Tags */}
                      <div className="flex flex-col">
                        {/* Quiz Title */}
                        <h3 className="font-['Archivo'] text-[32px] font-medium text-[#1C0B43] text-left mb-[20px]">
                          {draft.title}
                        </h3>

                        {/* Tags - Only Topic and Date */}
                        <div className="flex items-center gap-[20px]">
                          {/* Topic Tag */}
                          <div className="flex items-center gap-[8px] bg-[#EFE9FC] rounded-[16px] py-[4px] px-[12px]">
                            <svg
                              width="18"
                              height="18"
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
                            <span className="font-['Archivo'] text-[18px] font-medium text-[#1C0B43] text-left">
                              {draft.topic}
                            </span>
                          </div>

                          {/* Date Tag */}
                          <div className="flex items-center gap-[8px] bg-[#EFE9FC] rounded-[16px] py-[4px] px-[12px]">
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="text-[#1C0B43]"
                              strokeWidth="2"
                            >
                              <rect
                                x="3"
                                y="4"
                                width="18"
                                height="18"
                                rx="2"
                                ry="2"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <line
                                x1="16"
                                y1="2"
                                x2="16"
                                y2="6"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <line
                                x1="8"
                                y1="2"
                                x2="8"
                                y2="6"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <line
                                x1="3"
                                y1="10"
                                x2="21"
                                y2="10"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            <span className="font-['Archivo'] text-[18px] font-medium text-[#1C0B43] text-left">
                              Created: {formatDate(draft.createdDate)}
                              {/* Format date */}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right Side - Start and Delete Buttons */}
                      <div className="flex items-center gap-[24px]">
                        {/* Start Button */}
                        <button
                          onClick={() => navigate(`/quizzes/take/${draft.id}`)} // Use _id for navigation
                          className="py-[12px] px-[24px] rounded-[16px] bg-[#EFE9FC] hover:bg-[#9F7CEC] transition-colors duration-200 group"
                        >
                          <span className="font-['Archivo'] text-[16px] font-semibold text-center text-[#5F24E0] group-hover:text-[#EFE9FC]">
                            Start
                          </span>
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() =>
                            handleDeleteDraft(draft.id, draft.title)
                          }
                          className="p-[12px] rounded-[16px] bg-[#EFE9FC] hover:bg-[#9F7CEC] transition-colors duration-200 group"
                        >
                          <svg
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="text-[#5F24E0] group-hover:text-[#EFE9FC]"
                            strokeWidth="2"
                          >
                            <path
                              d="M3 6H5H21"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No draft quizzes found
                  </div>
                )}
                {hasMoreDrafts && (
                  <div className="flex justify-center mt-4">
                    <button
                      onClick={handleLoadMoreDrafts}
                      disabled={loading}
                      className="py-[12px] px-[24px] rounded-[16px] bg-[#EFE9FC] hover:bg-[#9F7CEC] transition-colors duration-200 font-['Archivo'] text-[16px] font-semibold text-center text-[#5F24E0] hover:text-[#EFE9FC] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? "Loading..." : "Load More Drafts"}
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <div className="pb-[64px]"></div>
      </div>
    </MainLayout>
  );
}
