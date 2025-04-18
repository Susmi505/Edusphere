import React, { useEffect, useState } from "react";
import {
  BsFillArchiveFill,
  BsFillGrid3X3GapFill,
  BsPeopleFill,
} from "react-icons/bs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

function Home() {
  const [stats, setStats] = useState({
    courses: 0,
    users: 0,
    categories: 0,
  });
  const [userPaymentsData, setUserPaymentsData] = useState([]);
  const [enrollmentData, setEnrollmentData] = useState([]);
  const [interval, setInterval] = useState("day");
  const API_BASE = process.env.REACT_APP_API_URL;

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/getCourses`).then((res) => res.json()).catch((err) => {
        console.error("Error fetching courses:", err);
        return { count: 0 };
      }),
      fetch(`${API_BASE}/getUsers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }).then((res) => res.json()).catch((err) => {
        console.error("Error fetching users:", err);
        return { count: 0 };
      }),
      fetch(`${API_BASE}/getCategory`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }).then((res) => res.json()).catch((err) => {
        console.error("Error fetching categories:", err);
        return { categories: [] };
      }),
      fetch(`${API_BASE}/getAllPayments`)
        .then((res) => res.json())
        .catch((err) => {
          console.error("Error fetching user payments:", err);
          return [];
        }),
    ])
      .then(([courses, users, categories, allPayments]) => {
        setStats({
          courses: courses?.courses.count ?? (Array.isArray(courses.courses) ? courses?.courses.length : 0),
          users: users?.filteredUsers.count ?? (Array.isArray(users?.filteredUsers) ? users?.filteredUsers.length : 0),
          categories: Array.isArray(categories.categories) ? categories.categories.length : 0,
        });

        // ✅ Get latest 10 payments by createdAt
        const latestPayments = [...allPayments.formattedPayments]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 10);

        setUserPaymentsData(latestPayments);
      })
      .catch((error) => console.error("Error in API requests:", error));
  }, []);

  // Fetch enrollment chart data
  useEffect(() => {
    fetch(`${API_BASE}/enrollments/summary?interval=${interval}`)
      .then((res) => res.json())
      .then((data) => setEnrollmentData(data))
      .catch((err) => console.error("Error fetching enrollment summary:", err));
  }, [interval]);

  return (
    <main className="main-container">
      <div className="main-title mt-4">
        <h3>DASHBOARD</h3>
      </div>

      <div className="main-cards">
        <div className="card">
          <div className="card-inner">
            <h3>Courses</h3>
            <BsFillArchiveFill className="card_icon" />
          </div>
          <h1>{stats.courses}</h1>
        </div>
        <div className="card">
          <div className="card-inner">
            <h3>Users</h3>
            <BsPeopleFill className="card_icon" />
          </div>
          <h1>{stats.users}</h1>
        </div>
        <div className="card">
          <div className="card-inner">
            <h3>Categories</h3>
            <BsFillGrid3X3GapFill className="card_icon" />
          </div>
          <h1>{stats.categories}</h1>
        </div>
      </div>

      <div className="charts">
        {userPaymentsData.length > 0 && (
          <div className="chart-item">
            <h3>Latest 10 User Payments</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={userPaymentsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="email"
                  tickFormatter={(email) => email?.split("@")[0]}
                />
                <YAxis tickFormatter={(value) => value*100} />
                <Tooltip formatter={(value) => `$${(value*100)}`} />
                <Bar dataKey="amount" fill="#00C49F" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}


        {/*  Enrollments Over Time Chart */}
        <div className="chart-item">
          <div className="flex items-center justify-between mb-2">
            <h3>Total Enrollments Over Time</h3>
            <select
              value={interval}
              onChange={(e) => setInterval(e.target.value)}
              className=" drop border px-2 py-1 rounded"
            >
              <option value="day">Daily</option>
              <option value="week">Weekly</option>
              <option value="month">Monthly</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={enrollmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#007bff" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </main>
  );
}

export default Home;
