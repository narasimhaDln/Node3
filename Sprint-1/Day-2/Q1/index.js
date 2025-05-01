const boxen = require("boxen");
const customBorder = {
  topLeft: "+",
  topRight: "+",
  bottomLeft: "+",
  bottomRight: "+",
  horizontal: "-",
  vertical: "|",
};
const fancyBorder = {
  topLeft: "╓",
  topRight: "╖",
  bottomLeft: "╙",
  bottomRight: "╜",
  horizontal: "─",
  vertical: "║",
};
const roundedBorder = {
  topLeft: "╭",
  topRight: "╮",
  bottomLeft: "╰",
  bottomRight: "╯",
  horizontal: "─",
  vertical: "│",
};

console.log(
  boxen("I am using my first external module", {
    title: "Hurry!!!",
    titleAlignment: "center",
    borderStyle: customBorder,
  })
);
console.log(
  boxen("I am using my first external module", {
    title: "Hurry!!",
    titleAlignment: "center",
    borderStyle: fancyBorder,
  })
);
console.log(
  boxen("I am using my first external module", {
    title: "Hurry!!",
    titleAlignment: "center",
    borderStyle: roundedBorder,
  })
);
