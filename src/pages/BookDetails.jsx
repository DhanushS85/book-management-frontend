import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Tabs, Tab, Button, Card, Spinner, Row, Col } from "react-bootstrap";

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [googleData, setGoogleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_API_URL
  useEffect(() => {
    axios
      .get(`${apiUrl}/api/books/${id}`)
      .then(res => {
        setBook(res.data);
        return axios.get(
          `${apiUrl}/api/external/google-books/${res.data.isbn}`
        );
      })
      .then(res => setGoogleData(res.data?.items?.[0]?.volumeInfo))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);


  useEffect(() => {
  console.log("Cover Image URL:", book?.imgUrl);
}, [book]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (!book) return <p className="text-center mt-5">Book not found</p>;

  return (
    <div className="p-4" style={{ maxWidth: "900px", margin: "auto" }}>
      <Button
        variant="outline-primary"
        onClick={() => navigate("/books")}
        className="mb-4"
        style={{
          borderRadius: "25px",
          fontWeight: "500",
          boxShadow: "0 3px 6px rgba(0,0,0,0.1)",
          transition: "all 0.2s",
        }}
        onMouseEnter={e => (e.target.style.transform = "scale(1.05)")}
        onMouseLeave={e => (e.target.style.transform = "scale(1)")}
      >
        ← Back to Book List
      </Button>

      <Card className="shadow-sm" style={{ borderRadius: "15px" }}>
        <Card.Body>
          <Tabs defaultActiveKey="basic" className="mb-4" fill>

            {/*  BASIC DETAILS */}
            <Tab eventKey="basic" title="Basic Details">
              <Row className="mb-3 align-items-start">
                <Col md={5} className="text-center mb-3">
                  {book.imgUrl ? (
                    <img
                      src={book.imgUrl}
                      alt="Book Cover"
                      className="img-fluid rounded shadow"
                      style={{
                        maxHeight: "420px",
                        width: "100%",
                        objectFit: "contain",
                      }}
                    />
                  ) : (
                    <p className="text-muted">No uploaded cover image</p>
                  )}
                </Col>

                <Col md={7}>
                  <p><b>Title:</b> {book.title}</p>
                  <p><b>Author:</b> {book.author}</p>
                  <p><b>Genre:</b> {book.genre}</p>
                  <p><b>Publication Date:</b> {book.publicationDate}</p>
                  <p><b>ISBN:</b> {book.isbn}</p>
                  <p><b>Rating:</b> ⭐ {book.rating} / 5</p>
                </Col>
              </Row>
            </Tab>

            {/*  MORE DETAILS – Google Books ONLY */}
            <Tab eventKey="more" title="More Details">
              {googleData ? (
                <Row className="align-items-start">
                  {googleData.imageLinks?.thumbnail && (
                    <Col md={5} className="mb-3 text-center">
                      <img
                        src={googleData.imageLinks.thumbnail}
                        alt="Google Book Cover"
                        className="img-fluid rounded shadow"
                        style={{
                          maxHeight: "380px",
                          width: "100%",
                          objectFit: "contain",
                        }}
                      />
                    </Col>
                  )}

                  <Col md={googleData.imageLinks?.thumbnail ? 7 : 12}>
                    <p style={{ textAlign: "justify" }}>
                      {googleData.description || "No description available."}
                    </p>
                    <p><b>Publisher:</b> {googleData.publisher || "N/A"}</p>
                    <p><b>Page Count:</b> {googleData.pageCount || "N/A"}</p>
                  </Col>
                </Row>
              ) : (
                <p>No additional details found.</p>
              )}
            </Tab>

          </Tabs>
        </Card.Body>
      </Card>
    </div>
  );
};

export default BookDetails;
