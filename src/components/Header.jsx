import { Container, Nav, Navbar } from "react-bootstrap";
import { NavLink } from "react-router-dom";

export const Header = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container fluid>
        <Navbar.Brand className="fw-bold text-warning ms-3">
          📚 Book Management
        </Navbar.Brand>

        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="ms-auto me-3">
            <Nav.Link as={NavLink} to="/" className="nav-link-custom">
              Home
            </Nav.Link>

            <Nav.Link as={NavLink} to="/add-book" className="nav-link-custom">
              Add Book
            </Nav.Link>

            <Nav.Link as={NavLink} to="/books" className="nav-link-custom">
              Book List
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
