const path = require("path");
const fs = require("fs");

class CustomReporter {
  constructor(globalConfig, options) {
    this._globalConfig = globalConfig;
    this._options = options;
    this.testResults = [];
    this.startTime = null;
    this.endTime = null;
  }

  onRunStart() {
    this.startTime = new Date();
  }

  onTestResult(test, testResult) {
    this.testResults.push({
      testFilePath: testResult.testFilePath,
      testResults: testResult.testResults,
      numFailingTests: testResult.numFailingTests,
      numPassingTests: testResult.numPassingTests,
      numPendingTests: testResult.numPendingTests,
    });
  }

  onRunComplete(contexts, results) {
    this.endTime = new Date();
    const duration = this.endTime - this.startTime;

    const reportData = {
      startTime: this.startTime,
      endTime: this.endTime,
      duration,
      numTotalTests: results.numTotalTests,
      numPassedTests: results.numPassedTests,
      numFailedTests: results.numFailedTests,
      numPendingTests: results.numPendingTests,
      testResults: this.testResults,
    };

    const reportDir = path.join(process.cwd(), "test-reports");
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }

    const reportPath = path.join(reportDir, "test-report.html");
    const htmlReport = this.generateHtmlReport(reportData);
    fs.writeFileSync(reportPath, htmlReport);
  }

  generateHtmlReport(data) {
    const passRate = ((data.numPassedTests / data.numTotalTests) * 100).toFixed(
      2
    );
    const failRate = ((data.numFailedTests / data.numTotalTests) * 100).toFixed(
      2
    );

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Report - Cotton Blue SaaS Admin</title>
    <style>
        :root {
            --primary-color: #32486B;
            --success-color: #4CAF50;
            --warning-color: #ff9800;
            --danger-color: #f44336;
            --background-color: #f5f5f5;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            background-color: var(--background-color);
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid var(--primary-color);
        }
        
        .summary {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .summary-card {
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            color: white;
        }
        
        .total { background-color: var(--primary-color); }
        .passed { background-color: var(--success-color); }
        .failed { background-color: var(--danger-color); }
        .pending { background-color: var(--warning-color); }
        
        .test-results {
            margin-top: 30px;
        }
        
        .test-file {
            margin-bottom: 20px;
            border: 1px solid #ddd;
            border-radius: 8px;
            overflow: hidden;
        }
        
        .test-file-header {
            background-color: var(--primary-color);
            color: white;
            padding: 10px 20px;
        }
        
        .test-case {
            padding: 15px 20px;
            border-bottom: 1px solid #eee;
        }
        
        .test-case:last-child {
            border-bottom: none;
        }
        
        .test-case.passed {
            border-left: 4px solid var(--success-color);
        }
        
        .test-case.failed {
            border-left: 4px solid var(--danger-color);
        }
        
        .test-case.pending {
            border-left: 4px solid var(--warning-color);
        }
        
        .duration {
            color: #666;
            font-size: 0.9em;
        }
        
        .error-message {
            margin-top: 10px;
            padding: 10px;
            background-color: #ffebee;
            border-radius: 4px;
            color: var(--danger-color);
            font-family: monospace;
            white-space: pre-wrap;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Test Report - Cotton Blue SaaS Admin</h1>
            <p>Run on ${data.startTime.toLocaleString()}</p>
            <p>Duration: ${(data.duration / 1000).toFixed(2)}s</p>
        </div>
        
        <div class="summary">
            <div class="summary-card total">
                <h3>Total Tests</h3>
                <p>${data.numTotalTests}</p>
            </div>
            <div class="summary-card passed">
                <h3>Passed</h3>
                <p>${data.numPassedTests} (${passRate}%)</p>
            </div>
            <div class="summary-card failed">
                <h3>Failed</h3>
                <p>${data.numFailedTests} (${failRate}%)</p>
            </div>
            <div class="summary-card pending">
                <h3>Pending</h3>
                <p>${data.numPendingTests}</p>
            </div>
        </div>
        
        <div class="test-results">
            ${data.testResults
              .map(
                (file) => `
                <div class="test-file">
                    <div class="test-file-header">
                        <h3>${path.relative(
                          process.cwd(),
                          file.testFilePath
                        )}</h3>
                        <p>
                            Passed: ${file.numPassingTests} | 
                            Failed: ${file.numFailingTests} | 
                            Pending: ${file.numPendingTests}
                        </p>
                    </div>
                    ${file.testResults
                      .map(
                        (test) => `
                        <div class="test-case ${test.status}">
                            <h4>${test.title}</h4>
                            <p class="duration">Duration: ${test.duration}ms</p>
                            ${
                              test.status === "failed"
                                ? `
                                <div class="error-message">
                                    ${test.failureMessages.join("\n")}
                                </div>
                            `
                                : ""
                            }
                        </div>
                    `
                      )
                      .join("")}
                </div>
            `
              )
              .join("")}
        </div>
    </div>
</body>
</html>`;
  }
}

// Export a factory function instead of the class directly
module.exports = function (globalConfig, options) {
  return new CustomReporter(globalConfig, options);
};
