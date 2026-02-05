import { useEffect, useState } from "react";
import { Table, Button, Row, Col, ButtonGroup, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(0); 
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  const [sortBy, setSortBy] = useState("id");
  const [direction, setDirection] = useState("asc");

  const perPage = 10;
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  const fetchBooks = () => {
    setLoading(true);
    axios
      .get(`${apiUrl}/api/books`, {
        params: {
          page,
          size: perPage,
          sortBy,
          direction,
        },
      })
      .then((res) => {
        setBooks(res.data.content);
        setTotalPages(res.data.totalPages);
      })
      .catch((err) => console.error("Fetch error:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBooks();
  }, [page, sortBy, direction]);


  const deleteBook = (id) => {
    axios
      .delete(`${apiUrl}/api/books/${id}`)
      .then(() => fetchBooks())
      .catch((err) => console.error("Delete failed:", err));
  };


  const sortRatingLowToHigh = () => {
    setSortBy("rating");
    setDirection("asc");
  };

  const sortRatingHighToLow = () => {
    setSortBy("rating");
    setDirection("desc");
  };

  return (
    <div className="p-4 bg-light rounded shadow-sm">
      <h3 className="mb-4 text-center text-primary">Book List</h3>

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading books...</p>
        </div>
      ) : (
        <>
      
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
                <th>Title</th>
                <th>Author</th>
                <th>Genre</th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {books.map((book, index) => (
                <tr
                  key={book.id}
                  onClick={() => navigate(`/books/${book.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <td>{page * perPage + index + 1}</td>
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

              {books.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-muted">
                    No books available
                  </td>
                </tr>
              )}
            </tbody>
          </Table>

          
          {totalPages > 1 && (
            <Row className="mt-3">
              <Col className="d-flex justify-content-between align-items-center">
                <Button
                  variant="outline-primary"
                  disabled={page === 0}
                  onClick={() => setPage(page - 1)}
                >
                  Prev
                </Button>

                <span>
                  Page {page + 1} of {totalPages}
                </span>

                <Button
                  variant="outline-primary"
                  disabled={page + 1 === totalPages}
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
