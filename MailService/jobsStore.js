const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const newJobs = (datetime, title, email, name) => {
  const Id = uuidv4();
  const data = [
    {
      id: Id,
      DataTime: datetime,
      Title: title,
      email: email,
      UserName: name,
    },
  ];

  let existingData = [];

  try {
    existingData = JSON.parse(fs.readFileSync("data.json"));
  } catch (error) {
    // File or data does not exist
  }

  existingData.push(...data);

  fs.writeFile("Jobs.json", JSON.stringify(existingData, null, 2), (err) => {
    if (err) {
      console.error("Error writing to JSON file:", err);
    } else {
      console.log("Data has been written to the JSON file.");
    }
  });
};

module.exports = newJobs;
