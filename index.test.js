const expect = require("chai").expect;
const app = require("./index");

describe("JUnit XML loader", function () {
  it("fails if no JUnit XML report file exists", function () {
    expect(function () {
      app.load_report("does_not_exist.xml");
    }).to.throw("Cannot open JUnit XML report: does_not_exist.xml");
  });
});
