const express = require("express");
const connection = require("./config/db");
const AppointmentModel = require("./models/appoinments.model");
const DoctorModel = require("./models/doctors.model");
const PatientModel = require("./models/patients.model");
require("dotenv").config();
const app = express();
app.use(express.json());

app.post("/appointment", async (req, res) => {
  try {
    const scheduled = await AppointmentModel.create(req.body);
    await scheduled.save();
    res.status(201).json({ message: "created appointment", scheduled });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
});
app.post("/doctor", async (req, res) => {
  try {
    const scheduled = await DoctorModel.create(req.body);
    res.status(201).json({ message: "doctor is created", scheduled });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
});
app.post("/patient", async (req, res) => {
  try {
    const scheduled = await PatientModel.create(req.body);
    res.status(201).json({ message: "Patient data created", scheduled });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
});
app.get("/analytics/doctors-with-appointments", async (req, res) => {
  try {
    const doctors = await DoctorModel.aggregate([
      {
        $lookup: {
          from: "doctors",
          localField: "doctorId",
          foreignField: "_id",
          as: "doctor",
        },
      },
      {
        $unwind: "$doctor",
      },
      {
        $group: {
          _id: "$doctor._id",
          name: { $first: "$doctor.name" },
          specialization: { $first: "$doctor.specialization" },
          totalAppointments: { $sum: 1 },
        },
      },
    ]);
    res.json(doctors);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal serer error" });
  }
});
app.get("/analytics/top-specialties", async (req, res) => {
  try {
    const result = await AppointmentModel.aggregate([
      {
        $lookup: {
          from: "doctors",
          localField: "doctorId",
          foreignField: "_id",
          as: "doctor",
        },
      },
      { $unwind: "$doctor" },
      {
        $group: {
          _id: "$doctor.specialization",
          totalAppointments: { $sum: 1 },
        },
      },
      { $sort: { totalAppointments: -1 } },
      { $limit: 3 },
    ]);
    res.json(result);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal serer error" });
  }
});
app.get("/analytics/cancelled-appointments", async (req, res) => {
  try {
    const result = await AppointmentModel.aggregate([
      {
        $group: {
          _id: "$doctorId",
          totalAppointments: { $sum: 1 },
          cancelledAppointments: {
            $sum: {
              $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          totalAppointments: 1,
          cancelledAppointments: 1,
          cancellationRate: {
            $cond: [
              { $eq: ["$totalAppointments", 0] },
              0,
              {
                $multiply: [
                  { $divide: ["$cancelledAppointments", "$totalAppointments"] },
                  100,
                ],
              },
            ],
          },
        },
      },
    ]);
    res.json(result);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal serer error" });
  }
});
app.get("/analytics/doctor-availability/:day", async (req, res) => {
  const day = req.params.day;
  try {
    const result = await DoctorModel.aggregate([
      {
        $unwind: "$availability",
      },
      { $match: { availability: { $eq: day } } },
      { $project: { name: 1, specialization: 1, availability: 1 } },
    ]);
    res.json(result);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal serer error" });
  }
});
app.listen(6070, () => {
  connection();
  console.log("server running at 6070");
});
