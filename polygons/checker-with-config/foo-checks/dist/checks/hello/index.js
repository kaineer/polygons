// dist/checks/hello/index.js

const {
  CommonHtmlCheck,
  QueryMethods
} = require("@htmlacademy/autochecks-skeleton");

export default class HelloCheck extends CommonHtmlCheck {
  getMessages() {
    return {
      title: "index.html should have charset meta",
      success: "charset meta found",
      failure: "charset meta is not found"
    };
  }

  getHtmlChecks() {
    const { createNotFoundCheck } = CommonHtmlCheck;

    return [
      createNotFoundCheck("meta[charset]", async () => ({
        success: false,
        title: "Отсутствует тег с кодировкой"
      }))
    ];
  }
}
