const { copy } = require("fs-extra");
const { join } = require("path");

copy(
  join(__dirname, "source"),
  join(__dirname, "target")
);
