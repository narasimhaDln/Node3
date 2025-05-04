function validateRequestBody(req, res, next) {
  const { ID, Name, Description, Rating, Genre, Cast } = req.body;
  if (typeof ID !== " number") {
    return res.status(400).json({ message: "need the Id Number" });
  }
  if (typeof Description !== "string") {
    return res.status(400).json({ message: "need the description" });
  }
  if (typeof Name !== "string") {
    return res.status(400).json({ message: "required the Name" });
  }
  if (typeof Rating !== " number") {
    return res.status(400).json({ message: "required the Rating" });
  }
  if (typeof Genre !== "string") {
    return res.status(400).json({ message: "required genre" });
  }
  if (!Array.isArray(Cast) || !Cast.every((item) => typeof item === "string")) {
    return res.status(400).json({
      message: "bad request",
      error: "Cast must be an array of strings",
    });
  }
  next();
}
module.exports = validateRequestBody;s
// {
//     "ID": "number",/
//     "Name": "string",/
//     "Rating": "number",/
//     "Description": "string",/
//     "Genre": "string",
//     "Cast": "array of strings"
//   }
