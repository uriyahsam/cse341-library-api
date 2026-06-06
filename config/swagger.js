const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Library Management API",
      version: "1.0.0",
      description:
        "A comprehensive REST API for managing a library system. Supports books, authors, members, and loans with full CRUD operations, OAuth authentication, and data validation.",
      contact: {
        name: "Library API Support",
        email: "support@libraryapi.com",
      },
    },
    servers: [
      {
        url: "https://cse341-library-api-jyqo.onrender.com",
        description: "Production server",
      },
      {
        url: "http://localhost:3000",
        description: "Local development",
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "connect.sid",
          description:
            "Session cookie obtained after GitHub OAuth login. Visit /auth/github to authenticate.",
        },
      },
      schemas: {
        Book: {
          type: "object",
          required: [
            "title",
            "authorId",
            "isbn",
            "genre",
            "publishedYear",
            "totalCopies",
          ],
          properties: {
            _id: { type: "string", example: "665f1a2b3c4d5e6f7a8b9c0d" },
            title: { type: "string", example: "The Great Gatsby" },
            authorId: { type: "string", example: "665f1a2b3c4d5e6f7a8b9c0e" },
            isbn: { type: "string", example: "978-0-7432-7356-5" },
            genre: { type: "string", example: "Fiction" },
            publishedYear: { type: "integer", example: 1925 },
            totalCopies: { type: "integer", example: 5 },
            availableCopies: { type: "integer", example: 3 },
            description: {
              type: "string",
              example: "A classic novel set in the Jazz Age.",
            },
            coverImageUrl: {
              type: "string",
              example: "https://example.com/cover.jpg",
            },
          },
        },
        Author: {
          type: "object",
          required: [
            "firstName",
            "lastName",
            "nationality",
            "birthYear",
            "genres",
            "biography",
            "email",
          ],
          properties: {
            _id: { type: "string", example: "665f1a2b3c4d5e6f7a8b9c0e" },
            firstName: { type: "string", example: "F. Scott" },
            lastName: { type: "string", example: "Fitzgerald" },
            nationality: { type: "string", example: "American" },
            birthYear: { type: "integer", example: 1896 },
            deathYear: { type: "integer", example: 1940 },
            genres: {
              type: "array",
              items: { type: "string" },
              example: ["Fiction", "Literary Fiction"],
            },
            biography: {
              type: "string",
              example:
                "Francis Scott Key Fitzgerald was an American novelist...",
            },
            email: { type: "string", example: "fitzgerald@library.com" },
            website: { type: "string", example: "https://fitzgerald.com" },
          },
        },
        Member: {
          type: "object",
          required: [
            "firstName",
            "lastName",
            "email",
            "phone",
            "address",
            "membershipType",
          ],
          properties: {
            _id: { type: "string", example: "665f1a2b3c4d5e6f7a8b9c0f" },
            firstName: { type: "string", example: "John" },
            lastName: { type: "string", example: "Doe" },
            email: { type: "string", example: "john.doe@email.com" },
            phone: { type: "string", example: "+1-555-0100" },
            address: {
              type: "string",
              example: "123 Main St, Springfield, IL",
            },
            membershipType: {
              type: "string",
              enum: ["basic", "premium", "student"],
              example: "basic",
            },
            joinDate: { type: "string", format: "date", example: "2024-01-15" },
            isActive: { type: "boolean", example: true },
          },
        },
        Loan: {
          type: "object",
          required: ["bookId", "memberId", "dueDate"],
          properties: {
            _id: { type: "string", example: "665f1a2b3c4d5e6f7a8b9c10" },
            bookId: { type: "string", example: "665f1a2b3c4d5e6f7a8b9c0d" },
            memberId: { type: "string", example: "665f1a2b3c4d5e6f7a8b9c0f" },
            loanDate: { type: "string", format: "date", example: "2024-06-01" },
            dueDate: { type: "string", format: "date", example: "2024-06-15" },
            returnDate: {
              type: "string",
              format: "date",
              example: "2024-06-10",
            },
            status: {
              type: "string",
              enum: ["active", "returned", "overdue"],
              example: "active",
            },
            notes: { type: "string", example: "Borrowed for summer reading." },
          },
        },
        Error: {
          type: "object",
          properties: {
            error: { type: "string", example: "Validation error message" },
          },
        },
      },
    },
  },
  apis: ["./routes/*.js"],
};

module.exports = swaggerJsdoc(options);
