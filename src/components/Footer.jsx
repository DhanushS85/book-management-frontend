import React from "react";
import { Container } from "react-bootstrap";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-light py-3 mt-auto">
      <Container
        fluid
        className="d-flex flex-column flex-md-row justify-content-between align-items-center"
      >
        <div className="fw-semibold text-warning fs-5 ms-3">
          📚 Book Management
        </div>

        <div className="text-light fs-6 me-3">
          © {currentYear} All Rights Reserved
        </div>
      </Container>
    </footer>
  );
};
