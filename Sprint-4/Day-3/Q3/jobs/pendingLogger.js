const corn = require("node-cron");
const TodoModel = require("../models/todo.model");
corn.schedule("*/2 * * * *", async () => {
  try {
    const pendingTOdos = await TodoModel.find({ status: "pending" });
    console.log(`[corn] ${pendingTOdos.length} pending todos found`);
    pendingTOdos.forEach((todo) => console.log(`-${todo.title}`));
  } catch (error) {
    console.log(error.message, ["corn Error"]);
  }
});
