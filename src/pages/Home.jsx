import React, { useEffect, useState } from "react";
import { Container, Card, Row, Col, Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_API_URL
  useEffect(() => {
    const loadBooks = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/books`);
        const firstFour = res.data.slice(0, 4);

        // Fetch Google Books thumbnails for each book
        const booksWithThumbnails = await Promise.all(
          firstFour.map(async (book) => {
            try {
              const googleRes = await axios.get(
                `${apiUrl}/api/external/google-books/${book.isbn}`
              );
              const googleData = googleRes.data?.items?.[0]?.volumeInfo;
              return {
                ...book,
                thumbnail:
                  googleData?.imageLinks?.thumbnail || book.imgUrl || null,
              };
            } catch (err) {
              // fallback to uploaded image
              return { ...book, thumbnail: book.imgUrl || null };
            }
          })
        );

        setBooks(booksWithThumbnails);
      } catch (err) {
        console.error("Error fetching books", err);
      } finally {
        setLoading(false);
      }
    };

    loadBooks();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <div className="bg-dark text-light py-5 text-center">
        <Container>
          <h1 className="display-5 fw-bold">📚 Book Management System</h1>
          <p className="lead text-secondary mt-3">
            Discover, manage, and explore your personal book collection
          </p>
          <Button
            size="lg"
            variant="warning"
            className="mt-3 fw-bold"
            onClick={() => navigate("/add-book")}
          >
            ➕ Add New Book
          </Button>
        </Container>
      </div>

      {/* Book Gallery */}
      <Container className="my-5">
        <h3 className="fw-bold mb-4 text-center">📖 Featured Books</h3>

        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" />
          </div>
        ) : (
          <>
            <Row className="g-4">
              {books.map((book) => (
                <Col key={book.id} xs={12} sm={6} md={4} lg={3}>
                  <Card
                    className="h-100 shadow-sm book-card border-0"
                    onClick={() => navigate(`/books/${book.id}`)}
                  >
                    <Card.Img
                      variant="top"
                      src={
                        book.thumbnail ||
                        "https://via.placeholder.com/300x400?text=No+Cover"
                      }
                      style={{ height: "280px", objectFit: "cover" }}
                    />
                    <Card.Body>
                      <Card.Title className="fw-bold text-truncate">
                        {book.title}
                      </Card.Title>
                      <Card.Text className="text-muted small">
                        {book.author}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>

            {/* Show More Button */}
            <div className="text-center mt-5">
              <Button
                variant="outline-dark"
                size="lg"
                onClick={() => navigate("/books")}
              >
                Show More →
              </Button>
            </div>
          </>
        )}
      </Container>

      {/* Hover Styling */}
      <style>{`
        .book-card {
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .book-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 25px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </>
  );
};

export default Home;
