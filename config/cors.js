const corsOptions = {
  origin: "http://localhost:3000", // Allow only this originy specific HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allow only specific headers
  credentials: true, // Allow cookies and authorization headers with the requests
};

module.exports = corsOptions;
