/**
 * Footer — Shared app footer with project name and team info.
 */

import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <span className="footer__logo">GIU Nexus</span>
          <p className="footer__tagline">AI-Powered Career & Talent Platform</p>
        </div>

        <div className="footer__links">
          <Link to="/jobs" className="footer__link">Jobs</Link>
          <Link to="/login" className="footer__link">Login</Link>
          <Link to="/register" className="footer__link">Register</Link>
        </div>

        <p className="footer__copy">
          © {new Date().getFullYear()} GIU Nexus — German International University
        </p>
      </div>
    </footer>
  );
};

export default Footer;