const express = require("express");
const { exec } = require("child_process");
const path = require("path");
const cors = require("cors");
const jest = require("jest");

const app = express();
const port = process.env.PORT || 3000;

// CORS Configuration
const corsOptions = {
  origin: ["http://localhost:5173", "https://dev.cottonblue.ddnsfree.com"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOptions));
app.use(express.json());

// Custom test result processor
class TestResultProcessor {
  constructor() {
    this.testResults = [];
    this.startTime = null;
    this.endTime = null;
  }

  processResults(results) {
    return {
      success: results.success,
      startTime: results.startTime,
      endTime: results.endTime,
      duration: results.endTime - results.startTime,
      numTotalTests: results.numTotalTests,
      numPassedTests: results.numPassedTests,
      numFailedTests: results.numFailedTests,
      numPendingTests: results.numPendingTests,
      testResults: results.testResults.map((testFile) => ({
        testFilePath: testFile.testFilePath,
        numFailingTests: testFile.numFailingTests,
        numPassingTests: testFile.numPassingTests,
        numPendingTests: testFile.numPendingTests,
        testResults: testFile.testResults.map((test) => ({
          title: test.title,
          status: test.status,
          duration: test.duration,
          failureMessages: test.failureMessages,
          ancestorTitles: test.ancestorTitles,
        })),
      })),
    };
  }
}

// Endpoint to trigger tests
app.post("/api/run-tests", async (req, res) => {
  console.log("Received request to run tests...");

  try {
    const results = await jest.runCLI(
      {
        config: path.join(process.cwd(), "jest.config.js"),
        json: true,
        silent: true,
      },
      [process.cwd()]
    );

    const processor = new TestResultProcessor();
    const processedResults = processor.processResults(results.results);

    res.json({
      success: processedResults.success,
      message: processedResults.success
        ? "Tests completed successfully"
        : "Some tests failed",
      data: processedResults,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error running tests",
      data: {
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack,
        },
      },
    });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy" });
});

app.listen(port, () => {
  console.log(`Test server listening at http://localhost:${port}`);
});
