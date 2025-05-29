import React from 'react';
import styled from 'styled-components';

const Switch = () => {
  return (
    <StyledWrapper>
      <div className="cyber-toggle-wrapper">
        <input className="cyber-toggle-checkbox" id="cyber-toggle" type="checkbox" />
        <label className="cyber-toggle" htmlFor="cyber-toggle">
          <div className="cyber-toggle-track">
            <div className="cyber-toggle-track-glow" />
            <div className="cyber-toggle-track-dots">
              <span className="cyber-toggle-track-dot" />
              <span className="cyber-toggle-track-dot" />
              <span className="cyber-toggle-track-dot" />
            </div>
          </div>
          <div className="cyber-toggle-thumb">
            <div className="cyber-toggle-thumb-shadow" />
            <div className="cyber-toggle-thumb-highlight" />
            <div className="cyber-toggle-thumb-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M16.5 12c0-2.48-2.02-4.5-4.5-4.5s-4.5 2.02-4.5 4.5 2.02 4.5 4.5 4.5 4.5-2.02 4.5-4.5zm-4.5 7.5c-4.14 0-7.5-3.36-7.5-7.5s3.36-7.5 7.5-7.5 7.5 3.36 7.5 7.5-3.36 7.5-7.5 7.5zm0-16.5c-4.97 0-9 4.03-9 9h-3l3.89 3.89.07.14 4.04-4.03h-3c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42c1.63 1.63 3.87 2.64 6.36 2.64 4.97 0 9-4.03 9-9s-4.03-9-9-9z" />
              </svg>
            </div>
          </div>
          <div className="cyber-toggle-particles">
            <span className="cyber-toggle-particle" />
            <span className="cyber-toggle-particle" />
            <span className="cyber-toggle-particle" />
            <span className="cyber-toggle-particle" />
          </div>
        </label>
        <div className="cyber-toggle-labels">
          <span className="cyber-toggle-label-off">OFF</span>
          <span className="cyber-toggle-label-on">ON</span>
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .cyber-toggle-wrapper {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    padding: 15px;
  }

  .cyber-toggle-checkbox {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
  }

  .cyber-toggle {
    position: relative;
    display: inline-block;
    width: 64px;
    height: 32px;
    cursor: pointer;
  }

  .cyber-toggle-track {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #111;
    border-radius: 16px;
    overflow: hidden;
    box-shadow:
      0 4px 8px rgba(0, 0, 0, 0.5),
      inset 0 0 4px rgba(0, 0, 0, 0.8);
    transition: all 0.4s cubic-bezier(0.3, 1.5, 0.7, 1);
  }

  .cyber-toggle-track::before {
    content: "";
    position: absolute;
    inset: 2px;
    border-radius: 14px;
    background: #222;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.5);
    z-index: 0;
    transition: all 0.4s ease;
  }

  .cyber-toggle-track-glow {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, #03e9f4, #4a00e0);
    opacity: 0;
    border-radius: 16px;
    z-index: 1;
    transition: all 0.4s ease;
  }

  .cyber-toggle-thumb {
    position: absolute;
    top: 4px;
    left: 4px;
    width: 24px;
    height: 24px;
    background: #151515;
    border-radius: 50%;
    z-index: 2;
    transition: all 0.4s cubic-bezier(0.3, 1.5, 0.7, 1);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.4);
  }

  .cyber-toggle-thumb-shadow {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: radial-gradient(
      circle at 30% 30%,
      rgba(255, 255, 255, 0.1),
      transparent 70%
    );
    z-index: 1;
  }

  .cyber-toggle-thumb-highlight {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: radial-gradient(
      circle at 70% 70%,
      rgba(0, 0, 0, 0.2),
      transparent 70%
    );
    z-index: 1;
  }

  .cyber-toggle-thumb-icon {
    position: absolute;
    inset: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2;
    opacity: 0.7;
    transition:
      opacity 0.4s ease,
      transform 0.4s ease;
  }

  .cyber-toggle-thumb-icon svg {
    width: 14px;
    height: 14px;
    fill: #555;
    transition:
      fill 0.4s ease,
      transform 0.4s ease;
  }

  .cyber-toggle-track-dots {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-right: 10px;
    z-index: 1;
  }

  .cyber-toggle-track-dot {
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: #444;
    margin-left: 3px;
    opacity: 0.5;
    transition: all 0.4s ease;
  }

  .cyber-toggle-particles {
    position: absolute;
    inset: 0;
    z-index: 0;
    overflow: hidden;
    pointer-events: none;
  }

  .cyber-toggle-particle {
    position: absolute;
    width: 3px;
    height: 3px;
    background: #03e9f4;
    border-radius: 50%;
    opacity: 0;
    filter: blur(1px);
    transition: all 0.3s ease;
    box-shadow: 0 0 4px rgba(3, 233, 244, 0.8);
  }

  .cyber-toggle-particle:nth-child(1) {
    top: 15%;
    right: 20%;
  }

  .cyber-toggle-particle:nth-child(2) {
    top: 45%;
    right: 30%;
  }

  .cyber-toggle-particle:nth-child(3) {
    top: 25%;
    right: 40%;
  }

  .cyber-toggle-particle:nth-child(4) {
    top: 60%;
    right: 15%;
  }

  .cyber-toggle-labels {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-top: 8px;
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  }

  .cyber-toggle-label-off {
    color: #555;
    transition: all 0.4s ease;
  }

  .cyber-toggle-label-on {
    color: #555;
    transition: all 0.4s ease;
  }

  /* Stati attivi */
  .cyber-toggle-checkbox:checked + .cyber-toggle .cyber-toggle-track-glow {
    opacity: 0.5;
  }

  .cyber-toggle-checkbox:checked + .cyber-toggle .cyber-toggle-thumb {
    left: calc(100% - 28px);
    background: #222;
  }

  .cyber-toggle-checkbox:checked + .cyber-toggle .cyber-toggle-thumb-icon {
    transform: rotate(360deg);
  }

  .cyber-toggle-checkbox:checked + .cyber-toggle .cyber-toggle-thumb-icon svg {
    fill: #03e9f4;
  }

  .cyber-toggle-checkbox:checked + .cyber-toggle .cyber-toggle-track-dot {
    background: #03e9f4;
    box-shadow: 0 0 4px #03e9f4;
    opacity: 1;
  }

  .cyber-toggle-checkbox:checked ~ .cyber-toggle-labels .cyber-toggle-label-on {
    color: #03e9f4;
    text-shadow: 0 0 5px rgba(3, 233, 244, 0.5);
  }

  .cyber-toggle-checkbox:not(:checked)
    ~ .cyber-toggle-labels
    .cyber-toggle-label-off {
    color: #aaa;
  }

  /* Animazione particelle quando attivo */
  .cyber-toggle-checkbox:checked + .cyber-toggle .cyber-toggle-particle {
    opacity: 1;
    animation: cyber-toggle-float 3s infinite alternate;
  }

  .cyber-toggle-checkbox:checked
    + .cyber-toggle
    .cyber-toggle-particle:nth-child(1) {
    animation-delay: 0s;
  }

  .cyber-toggle-checkbox:checked
    + .cyber-toggle
    .cyber-toggle-particle:nth-child(2) {
    animation-delay: 0.5s;
  }

  .cyber-toggle-checkbox:checked
    + .cyber-toggle
    .cyber-toggle-particle:nth-child(3) {
    animation-delay: 1s;
  }

  .cyber-toggle-checkbox:checked
    + .cyber-toggle
    .cyber-toggle-particle:nth-child(4) {
    animation-delay: 1.5s;
  }

  /* Effetto hover */
  .cyber-toggle:hover .cyber-toggle-track::before {
    background: #272727;
  }

  .cyber-toggle:hover .cyber-toggle-thumb {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
  }

  .cyber-toggle-checkbox:checked + .cyber-toggle:hover .cyber-toggle-track-glow {
    opacity: 0.7;
  }

  /* Effetto focus per accessibilità */
  .cyber-toggle-checkbox:focus + .cyber-toggle {
    outline: none;
  }

  .cyber-toggle-checkbox:focus + .cyber-toggle::after {
    content: "";
    position: absolute;
    inset: -4px;
    border-radius: 20px;
    border: 2px solid rgba(3, 233, 244, 0.5);
    opacity: 0.5;
  }

  @keyframes cyber-toggle-float {
    0% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-4px);
    }
    100% {
      transform: translateY(0);
    }
  }`;

export default Switch;
