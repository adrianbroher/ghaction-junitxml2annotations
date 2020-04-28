const expect = require("chai").expect;
const mock = require("mock-fs");
const app = require("./index");

describe("JUnit XML loader", function () {
  before(async () => {
    mock({
      "./sample_report.xml": `
<?xml version="1.0" encoding="UTF-8" ?>
<testsuites id="20200428_230419" name="Sample JUnit report (2020-04-28 23:05:19)" tests="2" failures="1" time="0.002">
  <testsuite id="sample.test.testsuite" name="Sample Test Suite" tests="2" failures="1" time="0.002">
    <testcase id="sample.test.success-testcase" name="Sample succeeding test case" time="0.001" />
    <testcase id="sample.test.failing-testcase" name="Sample failing test case" time="0.001" file="program.cpp" line="42">
      <failure message="program.cpp:42  error: expected \`,' or \`;' before '{' token" type="ERROR">
program.cpp:42: error: expected \`,' or \`;' before '{' token
note:  this is an example failure message
      </failure>
    </testcase>
  </testsuite>
</testsuites>
`,
    });
  });

  after(async () => {
    mock.restore();
  });

  it("fails if no JUnit XML report file exists", function () {
    expect(function () {
      app.load_report("does_not_exist.xml");
    }).to.throw("Cannot open JUnit XML report: does_not_exist.xml");
  });

  it("loads a JUnit XML report into a JSON structure", function () {
    doc = app.load_report("./sample_report.xml");

    expect(doc).to.have.own.property("testsuites").to.be.an("array").to.have.lengthOf(1);

    testsuites = doc.testsuites[0];

    expect(testsuites).to.have.own.property("@_id", "20200428_230419");
    expect(testsuites).to.have.own.property("@_name", "Sample JUnit report (2020-04-28 23:05:19)");
    expect(testsuites).to.have.own.property("@_tests", "2");
    expect(testsuites).to.have.own.property("@_failures", "1");
    expect(testsuites).to.have.own.property("@_time", "0.002");
    expect(testsuites).to.have.own.property("testsuite").to.be.an("array").to.have.lengthOf(1);

    testsuite = doc.testsuites[0].testsuite[0]

    expect(testsuite).to.have.own.property("@_id", "sample.test.testsuite");
    expect(testsuite).to.have.own.property("@_name", "Sample Test Suite");
    expect(testsuite).to.have.own.property("@_tests", "2");
    expect(testsuite).to.have.own.property("@_failures", "1");
    expect(testsuite).to.have.own.property("@_time", "0.002");
    expect(testsuite).to.have.own.property("testcase").to.be.an("array").to.have.lengthOf(2);

    testcases = doc.testsuites[0].testsuite[0].testcase;

    expect(testcases[0]).to.have.own.property("@_id", "sample.test.success-testcase");
    expect(testcases[0]).to.have.own.property("@_name", "Sample succeeding test case");
    expect(testcases[0]).to.have.own.property("@_time", "0.001");
    expect(testcases[0]).to.not.have.own.property("failure");

    expect(testcases[1]).to.have.own.property("@_id", "sample.test.failing-testcase");
    expect(testcases[1]).to.have.own.property("@_name", "Sample failing test case");
    expect(testcases[1]).to.have.own.property("@_time", "0.001");
    expect(testcases[1]).to.have.own.property("@_file", "program.cpp");
    expect(testcases[1]).to.have.own.property("@_line", "42");
    expect(testcases[1]).to.have.own.property("failure").to.be.an("array").to.have.lengthOf(1);

    testcase1failure = testcases[1].failure[0];

    expect(testcase1failure).to.have.own.property("@_type", "ERROR");
    expect(testcase1failure).to.have.own.property("@_message", "program.cpp:42  error: expected `,' or `;' before '{' token");
    expect(testcase1failure).to.have.own.property("#text", "program.cpp:42: error: expected `,' or `;' before '{' token\nnote:  this is an example failure message");
  });
});
