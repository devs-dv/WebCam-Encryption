import React, { useState, useRef } from "react";
import Webcam from "react-webcam";
import { saveAs } from "file-saver";
import CryptoJS from "crypto-js";
import axios from "axios";

const WebCam = () => {
  const encryptFile = (fileData, password) => {
    const encryptedData = CryptoJS.AES.encrypt(fileData, password).toString();
    return encryptedData;
  };

  const webcamRef = useRef(null);
  const [encrypt, setEncrypt] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [capturingVideo, setCapturingVideo] = useState(false);
  const [capturedVideoUrl, setCapturedVideoUrl] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [isRecorderPaused, setIsRecorderPaused] = useState(false);
  const [recordedVideoBlob, setRecordedVideoBlob] = useState(null);

  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
  };

  const startCaptureVideo = async () => {
    setCapturingVideo(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true, // Add audio constraint for microphone access
      });
      const newMediaRecorder = new MediaRecorder(stream, {
        mimeType: "video/webm; codecs=vp9,opus",
      });
      setMediaRecorder(newMediaRecorder);
      const chunks = [];
      newMediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      newMediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        const videoUrl = URL.createObjectURL(blob);
        setCapturedVideoUrl(videoUrl);
        setRecordedVideoBlob(blob);
      };
      newMediaRecorder.start();
    } catch (error) {
      console.error("Error accessing camera and microphone:", error);
    }
  };

  const pauseCaptureVideo = () => {
    if (mediaRecorder && !isRecorderPaused) {
      mediaRecorder.pause();
      setIsRecorderPaused(true);
    }
  };

  const resumeCaptureVideo = () => {
    if (mediaRecorder && isRecorderPaused) {
      mediaRecorder.resume();
      setIsRecorderPaused(false);
    }
  };

  const stopCaptureVideo = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setCapturingVideo(false);
      setMediaRecorder(null);
      setIsRecorderPaused(false);
    }
  };

  const downloadImage = () => {
    if (capturedImage) {
      fetch(capturedImage)
        .then((res) => res.blob())
        .then((blob) => {
          saveAs(blob, "capturedImage.jpeg");
        })
        .catch((error) => console.error("Error downloading image:", error));
    }
  };

  const downloadVideo = () => {
    if (recordedVideoBlob) {
      const reader = new FileReader();
      reader.readAsDataURL(recordedVideoBlob);
      reader.onload = () => {
        const fileData = reader.result.substring(
          reader.result.indexOf(",") + 1
        );

        const password = "your-secret-password";
        const encryptedData = encryptFile(fileData, password);

        console.log(encryptedData);
        // Save the encrypted data as a file
        const encryptedBlob = new Blob([encryptedData], {
          type: "application/octet-stream",
        });
        saveAs(encryptedBlob, "encryptedVideo.txt");
      };
      reader.onerror = () => {
        console.error("Error reading file");
      };

      setRecordedVideoBlob(null);
      setCapturedVideoUrl(null);
    }
  };

  const downloadOriginalVideo = () => {
    if (recordedVideoBlob) {
      saveAs(recordedVideoBlob, "capturedVideo.webm");

      setRecordedVideoBlob(null);
      setCapturedVideoUrl(null);
    }
  };

  const saveImage = () => {
    if (capturedImage) {
      const picture = capturedImage;
      console.log("Picture........", picture);
      axios
        .post("http://localhost:8000/api/v1/picture", {
          picture: capturedImage,
        })
        .then((response) => {
          console.log("Image saved successfully:", response.data);
        })
        .catch((error) => {
          console.error("Error saving image:", error);
        });
    }
  };

  const saveVideo = () => {
    if (recordedVideoBlob) {
      const videoElement = document.createElement("video");
      videoElement.src = URL.createObjectURL(recordedVideoBlob);
      videoElement.onloadedmetadata = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const videoWidth = videoElement.videoWidth;
        const videoHeight = videoElement.videoHeight;

        // Set the canvas size to half of the video's size
        canvas.width = videoWidth / 2;
        canvas.height = videoHeight / 2;

        // Draw the video frame on the canvas
        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

        // Convert the canvas content to base64 string
        const base64String = canvas.toDataURL("image/jpeg", 0.5).split(",")[1];

        // Post the compressed base64 string to the server
        axios
          .post("http://localhost:8000/api/v1/video", { video: base64String })
          .then((response) => {
            console.log("Video saved successfully:", response.data);
          })
          .catch((error) => {
            console.error("Error saving video:", error);
          });
      };
    }
  };


  return (
    <div className="flex flex-row justify-center h-full gap-10">
      <div className=" ">
        <p className=" text-center font-bold text-3xl">Webcam Here ↓</p>
        <div className="">
          <Webcam
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="rounded-lg"
            videoConstraints={{ facingMode: "user" }}
          />
        </div>

        <div className="mt-4 flex justify-center">
          {capturingVideo ? (
            <>
              <button
                onClick={pauseCaptureVideo}
                className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 mr-2"
                disabled={isRecorderPaused}
              >
                Pause
              </button>
              <button
                onClick={resumeCaptureVideo}
                className="text-gray-900 bg-gradient-to-r from-lime-200 via-lime-400 to-lime-500 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-lime-300 dark:focus:ring-lime-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 mr-2"
                disabled={!isRecorderPaused}
              >
                Resume
              </button>
              <button
                onClick={stopCaptureVideo}
                className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
              >
                Stop
              </button>
              <button
                onClick={captureImage}
                className="bg-black rounded-xl text-white font-medium px-4 py-3 sm:mt-10 mt-8 hover:bg-black/80"
              >
                Capture Image
              </button>
            </>
          ) : (
            <div className="flex gap-5">
              <button
                onClick={startCaptureVideo}
                className="bg-black rounded-xl text-white font-medium px-4 py-3 sm:mt-10 mt-8 hover:bg-black/80"
              >
                Start Recording
              </button>
              <button
                onClick={captureImage}
                className="bg-black rounded-xl text-white font-medium px-4 py-3 sm:mt-10 mt-8 hover:bg-black/80"
              >
                Capture Image
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="">
        {capturedImage || capturedVideoUrl ? (
          <p className=" text-center font-bold text-3xl">
            Preview your Capture ↓
          </p>
        ) : (
          <p className=" text-center font-bold text-3xl">Nothing to Preview</p>
        )}
        <div className=" ">
          {capturedImage && (
            <img src={capturedImage} alt="captured" className="rounded-lg" />
          )}
          <div className="flex gap-5">
            {capturedImage && (
              <div className="mt-4 flex justify-center">
                <button
                  onClick={downloadImage}
                  className="bg-black rounded-xl text-white font-medium px-4 py-3  hover:bg-black/80"
                >
                  Download Image
                </button>
              </div>
            )}
            {capturedImage ? (
              <>
                {" "}
                <div className="mt-4 flex justify-center">
                  <button
                    onClick={saveImage}
                    className="bg-black rounded-xl text-white font-medium px-4 py-3  hover:bg-black/80"
                  >
                    Save Image
                  </button>
                </div>
              </>
            ) : (
              <div></div>
            )}
          </div>
        </div>
        {capturedVideoUrl && (
          <div className="">
            <video controls className="rounded-lg" style={{ maxWidth: "100%" }}>
              <source src={capturedVideoUrl} type="video/webm" />
              Your browser does not support the video tag.
            </video>
            <div className="flex gap-5 justify-center">
              <button
                onClick={downloadVideo}
                className="bg-black rounded-xl text-white font-medium px-4 py-3 sm:mt-10 mt-8 hover:bg-black/80"
              >
                Download Encrypted Video
              </button>
              <button
                onClick={downloadOriginalVideo}
                className="bg-black rounded-xl text-white font-medium px-4 py-3 sm:mt-10 mt-8 hover:bg-black/80"
              >
                Download Original Video
              </button>
              <button
                onClick={saveVideo}
                className="bg-black rounded-xl text-white font-medium px-4 py-3 sm:mt-10 mt-8 hover:bg-black/80"
              >
                Save Video
              </button>
            </div>
          </div>
        )}
        <div className=""></div>
      </div>
    </div>
    //new changed from DV
  );
};
export default WebCam;
