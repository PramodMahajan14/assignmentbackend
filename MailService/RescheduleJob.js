const moment = require("moment");

const fs = require("fs");
const schedule = require("node-schedule");

// Function to create and schedule a job
function scheduleJob(job) {
  const { id, cronExpression, emailContent, recipient } = job;

  schedule.scheduleJob(cronExpression, () => {
    console.log(`Sending email to ${recipient}: ${emailContent}`);
  });

  console.log(`Scheduled job with ID ${id}`);
}

// Function to reschedule pending jobs on server startup
function reschedulePendingJobs() {
  try {
    // Load job data from the JSON file
    const jobData = JSON.parse(fs.readFileSync("jobs.json", "utf8"));

    // Loop through the retrieved data and recreate scheduled jobs
    jobData.forEach((jobInfo) => {
      scheduleJob(jobInfo);
    });
  } catch (err) {
    console.error("Error loading job data:", err);
  }
}

// ==============================
// Simulate server startup
console.log("Server is starting...");

// Call the function to reschedule pending jobs on server startup
// reschedulePendingJobs();

console.log("Server is now running.");

// Simulate the server running indefinitely
setInterval(() => {
  // Simulated server activity
}, 1000);
// ==================================================
