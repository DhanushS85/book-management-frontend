import { useState } from "react";
import { Form, Button, Card, Row, Col } from "react-bootstrap";
import axios from "axios";

const BookForm = () => {
    const [book, setBook] = useState({
        title: "",
        author: "",
        publicationDate: "",
        isbn: "",
        genre: "",
        rating: 1
    });
    const apiUrl=import.meta.env.VITE_API_URL
    const [image, setImage] = useState(null);

    const handleChange = (e) => {
        setBook({ ...book, [e.target.name]: e.target.value });
    };

    const validate = () => {
        return (
            book.title.length <= 100 &&
            book.author.length <= 50 &&
            /^\d{13}$/.test(book.isbn) &&
            book.rating >= 1 &&
            book.rating <= 5
            // image is optional, no validation here
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) {
            alert("Please fill all fields correctly.");
            return;
        }

        try {
            const formData = new FormData();

            // Always append book JSON
            formData.append(
                "book",
                new Blob([JSON.stringify(book)], { type: "application/json" })
            );

            // Append image only if user selected one
            if (image) {
                formData.append("image", image);
            }

            await axios.post(
                `${apiUrl}/api/books`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            alert("Book Added Successfully");

            setBook({
                title: "",
                author: "",
                publicationDate: "",
                isbn: "",
                genre: "",
                rating: 1
            });
            setImage(null);
        } catch (error) {
            console.error(error);
            alert("Failed to add book. Please try again.");
        }
    };

    return (
        <Card className="shadow-sm mx-auto my-4" style={{ maxWidth: "600px", borderRadius: "12px" }}>
            <Card.Body>
                <Card.Title className="mb-4 text-center fw-bold" style={{ fontSize: "1.8rem" }}>
                    Add New Book
                </Card.Title>

                <Form onSubmit={handleSubmit} encType="multipart/form-data">

                    {/* Title */}
                    <Form.Group className="mb-3">
                        <Form.Label>Book Title</Form.Label>
                        <Form.Control
                            required
                            name="title"
                            placeholder="Enter book title"
                            value={book.title}
                            onChange={handleChange}
                            className="form-control-lg"
                        />
                    </Form.Group>

                    {/* Author */}
                    <Form.Group className="mb-3">
                        <Form.Label>Author</Form.Label>
                        <Form.Control
                            required
                            name="author"
                            placeholder="Enter author name"
                            value={book.author}
                            onChange={handleChange}
                            className="form-control-lg"
                        />
                    </Form.Group>

                    {/* Publication Date & ISBN */}
                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Publication Date</Form.Label>
                                <Form.Control
                                    required
                                    type="date"
                                    name="publicationDate"
                                    value={book.publicationDate}
                                    onChange={handleChange}
                                    className="form-control-lg"
                                />
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>ISBN (13 digits)</Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    placeholder="XXXXXXXXXXXXX"
                                    value={book.isbn}
                                    maxLength={13}
                                    inputMode="numeric"
                                    onChange={(e) =>
                                        setBook({ ...book, isbn: e.target.value.replace(/\D/g, "") })
                                    }
                                    className="form-control-lg"
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    {/* Genre & Rating */}
                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Genre</Form.Label>
                                <Form.Select
                                    required
                                    name="genre"
                                    value={book.genre}
                                    onChange={handleChange}
                                    className="form-select-lg"
                                >
                                    <option value="">Select Genre</option>
                                    <option>Fiction</option>
                                    <option>Non-Fiction</option>
                                    <option>Mystery</option>
                                    <option>Fantasy</option>
                                    <option>Romance</option>
                                    <option>Sci-Fi</option>
                                    <option>Others</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Rating (1–5)</Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    value={book.rating}
                                    maxLength={1}
                                    inputMode="numeric"
                                    onChange={(e) =>
                                        setBook({
                                            ...book,
                                            rating: e.target.value.replace(/[^1-5]/g, "")
                                        })
                                    }
                                    className="form-control-lg"
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    {/* Cover Image */}
                    <Form.Group className="mb-4">
                        <Form.Label>Book Cover Image (Optional)</Form.Label>
                        <Form.Control
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImage(e.target.files[0])}
                            className="form-control-lg"
                        />
                    </Form.Group>

                    <div className="d-grid">
                        <Button type="submit" size="lg" style={{ backgroundColor: "#343a40", border: "none" }}>
                            Save Book
                        </Button>
                    </div>

                </Form>
            </Card.Body>
        </Card>
    );
};

export default BookForm;
