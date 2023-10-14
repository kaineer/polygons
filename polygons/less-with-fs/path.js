//

const join = (base, suffix) => {
  if (suffix.startsWith("/")) { // is absolute path
    return suffix;
  }
  const baseParts = base.split("/");
  const suffixParts = suffix.split("/");

  for (; suffix.length && suffixParts[0] === "..";) {
    suffixParts.shift();
    if (baseParts.length) {
      baseParts.pop();
    }
  }

  if (suffixParts[0] === ".") {
    suffixParts.shift();
  }

  return [...baseParts, ...suffixParts].filter((s) => !!s).join("/");
}

module.exports = { join };
