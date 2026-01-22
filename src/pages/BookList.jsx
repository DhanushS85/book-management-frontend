import { useEffect, useState } from "react";
import { Table, Button, Row, Col, ButtonGroup, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate();

  const perPage = 10;
  const apiUrl = import.meta.env.VITE_API_URL;

  // Sort by any field
  const sortBy = (field) => {
    const sorted = [...books].sort((a, b) =>
      a[field] > b[field] ? 1 : -1
    );
    setBooks(sorted);
  };
  // Sort rating low to high
  const sortRatingLowToHigh = () => {
    const sorted = [...books].sort((a, b) => a.rating - b.rating);
    setBooks(sorted);
  };
  // Sort rating high to low
  const sortRatingHighToLow = () => {
    const sorted = [...books].sort((a, b) => b.rating - a.rating);
    setBooks(sorted);
  };

  // Fetch books
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${apiUrl}/api/books`)
      .then((res) => setBooks(res.data))
      .catch((err) => console.error("Fetch error:", err))
      .finally(() => setLoading(false)); 
  }, []);

  // Delete book
  const deleteBook = (id) => {
    axios
      .delete(`${apiUrl}/api/books/${id}`)
      .then(() => {
        setBooks(books.filter((b) => b.id !== id));
      })
      .catch((err) => console.error("Delete failed:", err));
  };

  const paginated = books.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="p-4 bg-light rounded shadow-sm">
      <h3 className="mb-4 text-center text-primary">Book List</h3>

      {/* Loading State */}
      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading books...</p>
        </div>
      ) : (
        <>
          {/* Rating Sort Buttons */}
          <div className="mb-3 d-flex justify-content-center">
            <ButtonGroup>
              <Button variant="outline-secondary" onClick={sortRatingLowToHigh}>
                Rating: Low to High
              </Button>
              <Button variant="outline-secondary" onClick={sortRatingHighToLow}>
                Rating: High to Low
              </Button>
            </ButtonGroup>
          </div>

          <Table striped bordered hover responsive className="align-middle text-center">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th onClick={() => sortBy("title")} style={{ cursor: "pointer" }}>
                  Title
                </th>
                <th>Author</th>
                <th>Genre</th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginated.map((book, index) => (
                <tr
                  key={book.id}
                  onClick={() => navigate(`/books/${book.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <td>{(page - 1) * perPage + index + 1}</td>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.genre}</td>
                  <td>{book.rating}</td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteBook(book.id);
                      }}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}

              {paginated.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-muted">
                    No books available
                  </td>
                </tr>
              )}
            </tbody>
          </Table>

          {/* Pagination */}
          {books.length > perPage && (
            <Row className="mt-3">
              <Col className="d-flex justify-content-between">
                <Button
                  variant="outline-primary"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  Prev
                </Button>

                <span>
                  Page {page} of {Math.ceil(books.length / perPage)}
                </span>

                <Button
                  variant="outline-primary"
                  disabled={page * perPage >= books.length}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </Button>
              </Col>
            </Row>
          )}
        </>
      )}
    </div>
  );
};

export default BookList;
