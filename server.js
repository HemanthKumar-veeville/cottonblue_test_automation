const express = require("express");
const { exec } = require("child_process");
const path = require("path");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Serve the test reports directory statically
app.use("/test-reports", express.static(path.join(__dirname, "test-reports")));

// Endpoint to trigger tests
app.post("/api/run-tests", (req, res) => {
  console.log("Received request to run tests...");

  exec("npm run test:report", (error, stdout, stderr) => {
    if (error) {
      console.error("Error running tests:", error);
      return res.status(500).json({
        success: false,
        error: error.message,
        stdout,
        stderr,
      });
    }

    // Get the report file path
    const reportPath = path.join(__dirname, "test-reports", "test-report.html");
    const reportUrl = `http://localhost:${port}/test-reports/test-report.html`;

    res.json({
      success: true,
      message: "Tests completed successfully",
      reportUrl,
      stdout,
      stderr,
    });
  });
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy" });
});

app.listen(port, () => {
  console.log(`Test server listening at http://localhost:${port}`);
});
