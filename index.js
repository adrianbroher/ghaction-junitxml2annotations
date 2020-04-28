const fs = require("fs");
const path = require("path");
const xml_parser = require("fast-xml-parser");
const core = require("@actions/core");
const github = require("@actions/github");

function load_report(report_path) {
  if (!fs.existsSync(report_path)) {
    throw new Error(`Cannot open JUnit XML report: ${report_path}`);
  }
  const report_data = fs.readFileSync(report_path).toString();
  return xml_parser.parse(report_data, { arrayMode: true, ignoreAttributes: false });
}

module.exports = {
  load_report,
};

try {
  const report_file = path.join(
    core.getInput("junit-report-file") || "./junit.xml"
  );
  report_document = load_report(report_file);
  console.log(report_document);
} catch (error) {
  core.setFailed(error.message);
}
