import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WebCam from "./WebCam";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/webcam" element={<WebCam />} />
      </Routes>
    </Router>
  );
}

function Home() {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const navigate = useNavigate();

  const handleAccessRequest = () => {
    // Check for browser support for getUserMedia
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      setShowConfirmationModal(true);
    } else {
      // If getUserMedia is not supported, show error modal
      setShowErrorModal(true);
    }
  };

  const handleGrantAccess = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then(() => {
        setShowConfirmationModal(false);
        alert("Access granted. Redirecting to WebCam page.");
        navigate("/webcam"); // Navigate to the WebCam page
      })
      .catch(() => {
        setShowConfirmationModal(false);
        setShowErrorModal(true);
      });
  };

  const handleDenyAccess = () => {
    setShowConfirmationModal(false);
    setShowErrorModal(true);
  };

  return (
    <>
      <main className="flex w-full flex-col items-center justify-center text-center px-4 h-screen">
        <a
          href="#"
          target="_blank"
          rel="noreferrer"
          className="border rounded-2xl py-1 px-4 text-slate-500 text-sm mb-5 hover:scale-105 transition duration-300 ease-in-out"
        >
          Task 1:
          <span className="font-semibold"> Photo/Video Store </span> using
          WebCam
        </a>
        <h1 className="mx-auto max-w-4xl font-display text-5xl font-bold tracking-normal text-slate-900 sm:text-7xl">
          Store your photos /Videos
          <span className="relative whitespace-nowrap text-orange-400">
            <svg
              aria-hidden="true"
              viewBox="0 0 418 42"
              className="absolute top-2/3 left-0 h-[0.58em] w-full fill-orange-300/70"
              preserveAspectRatio="none"
            >
              <path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z" />
            </svg>
            <span className="relative">Pop</span>
          </span>
        </h1>
        <p className="mx-auto mt-12 max-w-xl text-lg text-slate-700 leading-7">
          Store Your Encrypted Video In Database...
        </p>
        <br></br>
        <div className="Home">
          <button
            onClick={handleAccessRequest}
            className="text-gray-900 bg-gradient-to-r from-red-200 via-red-400 to-red-500 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          >
            Start Your WebCame By hitting Me!
          </button>

          {showConfirmationModal && (
            <div className="modal">
              <div className="modal-content center">
                <p>
                  Do you really want to grant access to camera and microphone?
                </p>
                <div className="button-container">
                  <button
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
                    onClick={handleGrantAccess}
                  >
                    Yes
                  </button>
                  <span> </span>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full"
                    onClick={handleDenyAccess}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          )}

          {showErrorModal && (
            <div className="modal">
              <div className="modal-content">
                <p>You denied access.</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

export default App;
