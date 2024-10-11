import React from "react";
import { Bar } from "react-chartjs-2";

const AppointmentChart = ({ users }) => {
  // Count appointments by service type
  const serviceCounts = users.reduce((acc, user) => {
    const services = Array.isArray(user.serviceType) ? user.serviceType : [user.serviceType];
    services.forEach(service => {
      acc[service] = (acc[service] || 0) + 1;
    });
    return acc;
  }, {});

  const data = {
    labels: Object.keys(serviceCounts),
    datasets: [
      {
        label: "Number of Appointments",
        data: Object.values(serviceCounts),
        backgroundColor: "rgba(139, 0, 0, 0.6)",
        borderColor: "rgba(139, 0, 0, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="chart-container mb-4">
      <Bar data={data} />
    </div>
  );
};

export default AppointmentChart;
