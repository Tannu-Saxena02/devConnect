const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "DevConnect API",
      version: "1.0.0",
      description: "API documentation for DevConnect - Tinder for Developers",
    },
    servers: [{ url: "http://localhost:3000" }],
    components: {
      securitySchemes: {
        cookieAuth: { type: "apiKey", in: "cookie", name: "token" },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            _id: { type: "string" },
            firstName: { type: "string" },
            lastName: { type: "string" },
            emailId: { type: "string", format: "email" },
            age: { type: "integer" },
            gender: { type: "string", enum: ["male", "female", "other"] },
            about: { type: "string" },
            photoUrl: { type: "string" },
            skills: { type: "array", items: { type: "string" } },
            isPremium: { type: "boolean" },
            membershipType: { type: "string" },
            isOnline: { type: "boolean" },
            lastSeen: { type: "string", format: "date-time" },
          },
        },
        SuccessResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string" },
            data: { type: "object" },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            error: { type: "string" },
          },
        },
      },
    },
    paths: {
      // ─── AUTH ────────────────────────────────────────────────────────────
      "/signup": {
        post: {
          tags: ["Auth"],
          summary: "Register a new user",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["firstName", "emailId", "password"],
                  properties: {
                    firstName: { type: "string" },
                    lastName: { type: "string" },
                    emailId: { type: "string", format: "email" },
                    password: { type: "string", format: "password" },
                    age: { type: "integer" },
                    gender: { type: "string", enum: ["male", "female", "other"] },
                    photoUrl: { type: "string" },
                    skills: { type: "array", items: { type: "string" } },
                  },
                  example: {
                    firstName: "John",
                    lastName: "Doe",
                    emailId: "john.doe@example.com",
                    password: "Test@1234",
                    age: 25,
                    gender: "male",
                    photoUrl: "https://avatar.iran.liara.run/public/boy",
                    skills: ["JavaScript", "React", "Node.js"],
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "User registered successfully", content: { "application/json": { schema: { $ref: "#/components/schemas/SuccessResponse" } } } },
            400: { description: "Validation error", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          },
        },
      },
      "/login": {
        post: {
          tags: ["Auth"],
          summary: "Login user",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["emailId", "password"],
                  properties: {
                    emailId: { type: "string", format: "email" },
                    password: { type: "string", format: "password" },
                  },
                   example: {
                    emailId: "john.doe@example.com",
                    password: "Test@1234",
                },
                },
              },
            },
          },
          responses: {
            200: { description: "Login successful" },
            400: { description: "Invalid credentials" },
          },
        },
      },
      "/logout": {
        post: {
          tags: ["Auth"],
          summary: "Logout user",
          responses: { 200: { description: "Logged out successfully" } },
        },
      },
      "/google-auth": {
        post: {
          tags: ["Auth"],
          summary: "Google OAuth login/signup",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["credential", "client_id"],
                  properties: {
                    credential: { type: "string", description: "Google ID token" },
                    client_id: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Authentication successful" },
            400: { description: "Authentication failed" },
          },
        },
      },

      // ─── PROFILE ─────────────────────────────────────────────────────────
      "/profile/view": {
        get: {
          tags: ["Profile"],
          summary: "View logged-in user profile",
          security: [{ cookieAuth: [] }],
          responses: {
            200: { description: "Profile fetched", content: { "application/json": { schema: { $ref: "#/components/schemas/SuccessResponse" } } } },
            400: { description: "Error" },
          },
        },
      },
      "/profile/edit": {
        patch: {
          tags: ["Profile"],
          summary: "Edit logged-in user profile",
          security: [{ cookieAuth: [] }],
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    firstName: { type: "string", example: "John" },
                    lastName: { type: "string", example: "Doe" },
                    age: { type: "integer", example: 25 },
                    gender: { type: "string", example: "male" },
                    about: { type: "string", example: "Full-stack developer with 5 years of experience" },
                    photoUrl: { type: "string", example: "https://avatar.iran.liara.run/public/boy" },
                    skills: { type: "array", items: { type: "string" }, example: ["JavaScript", "React", "Node.js"] },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Profile updated" },
            400: { description: "Update not allowed" },
          },
        },
      },
      "/resetpassword": {
        post: {
          tags: ["Profile"],
          summary: "Reset password (authenticated)",
          security: [{ cookieAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["password", "newPassword"],
                  properties: {
                    password: { type: "string", format: "password", example: "Test@1234" },
                    newPassword: { type: "string", format: "password", example: "NewPass@456" },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Password updated" },
            400: { description: "Invalid password" },
          },
        },
      },
      "/forgot-password": {
        post: {
          tags: ["Profile"],
          summary: "Forgot password (unauthenticated)",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "newpassword"],
                  properties: {
                    email: { type: "string", format: "email", example: "john.doe@example.com" },
                    newpassword: { type: "string", format: "password", example: "NewPass@456" },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Password reset successfully" },
            400: { description: "Error" },
          },
        },
      },

      // ─── OTP ─────────────────────────────────────────────────────────────
      "/sendOTP": {
        post: {
          tags: ["OTP"],
          summary: "Send OTP to email",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "purpose"],
                  properties: {
                    email: { type: "string", format: "email", example: "john.doe@example.com" },
                    purpose: { type: "string", enum: ["signup", "forgot"], example: "signup" },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "OTP sent successfully" },
            400: { description: "User not found / already exists" },
            500: { description: "Internal server error" },
          },
        },
      },
      "/verifyOTP": {
        post: {
          tags: ["OTP"],
          summary: "Verify OTP",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "otp"],
                  properties: {
                    email: { type: "string", format: "email", example: "john.doe@example.com" },
                    otp: { type: "string", minLength: 6, maxLength: 6, example: "123456" },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "OTP verified" },
            400: { description: "Invalid OTP" },
          },
        },
      },

      // ─── REQUESTS ────────────────────────────────────────────────────────
      "/request/send/{status}/{toUserId}": {
        post: {
          tags: ["Connection Requests"],
          summary: "Send a connection request",
          security: [{ cookieAuth: [] }],
          parameters: [
            { name: "status", in: "path", required: true, schema: { type: "string", enum: ["interested", "ignored"] } },
            { name: "toUserId", in: "path", required: true, schema: { type: "string" } },
          ],
          responses: {
            200: { description: "Request sent" },
            400: { description: "Invalid status or request already exists" },
            404: { description: "User not found" },
          },
        },
      },
      "/request/review/{status}/{requestId}": {
        post: {
          tags: ["Connection Requests"],
          summary: "Review (accept/reject) a connection request",
          security: [{ cookieAuth: [] }],
          parameters: [
            { name: "status", in: "path", required: true, schema: { type: "string", enum: ["accepted", "rejected"] } },
            { name: "requestId", in: "path", required: true, schema: { type: "string" } },
          ],
          responses: {
            200: { description: "Request reviewed" },
            400: { description: "Invalid status" },
            404: { description: "Request not found" },
          },
        },
      },

      // ─── USER ─────────────────────────────────────────────────────────────
      "/user/requests/received": {
        get: {
          tags: ["User"],
          summary: "Get all pending connection requests received",
          security: [{ cookieAuth: [] }],
          responses: {
            200: { description: "Requests fetched" },
            400: { description: "Error" },
          },
        },
      },
      "/user/connections": {
        get: {
          tags: ["User"],
          summary: "Get all accepted connections",
          security: [{ cookieAuth: [] }],
          responses: {
            200: { description: "Connections fetched" },
            400: { description: "Error" },
          },
        },
      },
      "/feed": {
        get: {
          tags: ["User"],
          summary: "Get user feed (paginated)",
          security: [{ cookieAuth: [] }],
          parameters: [
            { name: "page", in: "query", schema: { type: "integer", default: 1 } },
            { name: "limit", in: "query", schema: { type: "integer", default: 10, maximum: 50 } },
          ],
          responses: {
            200: { description: "Feed fetched" },
            400: { description: "Error" },
          },
        },
      },

      // ─── CHAT ─────────────────────────────────────────────────────────────
      "/chat/{targetUserId}": {
        get: {
          tags: ["Chat"],
          summary: "Get or create chat with a user",
          security: [{ cookieAuth: [] }],
          parameters: [
            { name: "targetUserId", in: "path", required: true, schema: { type: "string" } },
          ],
          responses: {
            200: { description: "Chat fetched" },
            400: { description: "Error" },
          },
        },
      },
      "/status/{userId}": {
        get: {
          tags: ["Chat"],
          summary: "Get user online status",
          security: [{ cookieAuth: [] }],
          parameters: [
            { name: "userId", in: "path", required: true, schema: { type: "string" } },
          ],
          responses: {
            200: { description: "Status fetched" },
            400: { description: "User not found" },
          },
        },
      },
      "/upload": {
        post: {
          tags: ["Chat"],
          summary: "Upload a file (image/media) for chat",
          security: [{ cookieAuth: [] }],
          requestBody: {
            content: {
              "multipart/form-data": {
                schema: {
                  type: "object",
                  properties: {
                    file: { type: "string", format: "binary" },
                    targetUserId: { type: "string", description: "Target user's _id" },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "File uploaded", content: { "application/json": { schema: { type: "object", properties: { fileUrl: { type: "string" } } } } } },
          },
        },
      },

      // ─── PAYMENT ──────────────────────────────────────────────────────────
      "/payment/create": {
        post: {
          tags: ["Payment"],
          summary: "Create a Razorpay order for membership",
          security: [{ cookieAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["membershipType"],
                  properties: {
                    membershipType: { type: "string", enum: ["silver", "gold"] },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Order created", content: { "application/json": { schema: { type: "object", properties: { success: { type: "boolean" }, data: { type: "object" }, keyId: { type: "string" } } } } } },
            500: { description: "Server error" },
          },
        },
      },
      "/payment/webhook": {
        post: {
          tags: ["Payment"],
          summary: "Razorpay webhook handler",
          parameters: [
            { name: "X-Razorpay-Signature", in: "header", required: true, schema: { type: "string" } },
          ],
          requestBody: {
            content: { "application/json": { schema: { type: "object" } } },
          },
          responses: {
            200: { description: "Webhook processed" },
            400: { description: "Invalid signature" },
            500: { description: "Server error" },
          },
        },
      },
      "/premium/verify": {
        get: {
          tags: ["Payment"],
          summary: "Verify if logged-in user is premium",
          security: [{ cookieAuth: [] }],
          responses: {
            200: { description: "Premium status returned" },
          },
        },
      },
    },
  },
  apis: [],
};

module.exports = swaggerJsdoc(options);
