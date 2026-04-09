"use client";

import { useState, useCallback } from "react";

export default function VideoSection() {
  const [modalOpen, setModalOpen] = useState(false);
  const [iframeSrc, setIframeSrc] = useState("");

  const openVideoModal = useCallback(() => {
    setIframeSrc("https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1");
    setModalOpen(true);
  }, []);

  const closeVideoModal = useCallback(() => {
    setModalOpen(false);
    setIframeSrc("");
  }, []);

  return (
    <>
      <section className="video-section">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://picsum.photos/seed/videobg/1600/900"
          alt="Video Background"
        />
        <div className="video-overlay">
          <h2>Sound. Sculpted.</h2>
          <button className="pill-cta">Experience Now</button>
        </div>
        <button className="play-btn" onClick={openVideoModal}>
          <div className="play-triangle"></div>
        </button>
      </section>

      <div
        className={`video-modal${modalOpen ? " active" : ""}`}
        id="videoModal"
        onClick={(e) => {
          if (e.target === e.currentTarget) closeVideoModal();
        }}
      >
        <div className="video-modal-content">
          <span className="video-modal-close" onClick={closeVideoModal}>
            &#10005;
          </span>
          <iframe
            src={iframeSrc}
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        </div>
      </div>
    </>
  );
}
