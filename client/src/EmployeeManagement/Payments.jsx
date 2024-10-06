import React, { useState, useEffect } from 'react'; 
import axios from 'axios';
import { Link } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Payments() {
  const [records, setRecords] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [searchNic, setSearchNic] = useState('');
  const [attendanceStatus, setAttendanceStatus] = useState('All'); // New state for attendance filter
  const [selectedYear, setSelectedYear] = useState(''); // New state for year filter
  const [selectedMonth, setSelectedMonth] = useState(''); // New state for month filter
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [salarySummary, setSalarySummary] = useState([]);
  const [totalSalary, setTotalSalary] = useState(0);
  const [report, setReport] = useState('');

  // Years and months for the dropdowns
  const years = Array.from(new Array(10), (val, index) => new Date().getFullYear() - index);
  const months = [
    { value: '', label: 'All' },
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

  useEffect(() => {
    const fetchAttendanceRecords = async () => {
      try {
        const attendanceResponse = await axios.get('http://localhost:3001/attendanceRecords');
        setRecords(attendanceResponse.data);
      } catch (error) {
        console.log('Error fetching attendance records:', error);
      }
    };

    const fetchEmployees = async () => {
      try {
        const employeesResponse = await axios.get('http://localhost:3001');
        setEmployees(employeesResponse.data);
      } catch (error) {
        console.log('Error fetching employees:', error);
      }
    };

    fetchAttendanceRecords();
    fetchEmployees();
  }, []);

  useEffect(() => {
    const filterRecords = () => {
      let filtered = records.filter(record => {
        const employee = employees.find(emp => emp._id === record.employeeId);
        return employee && employee.nic.toLowerCase().includes(searchNic.toLowerCase());
      });

      // Filter by attendance status
      if (attendanceStatus !== 'All') {
        filtered = filtered.filter(record => record.status === attendanceStatus);
      }

      // Filter by selected year
      if (selectedYear) {
        filtered = filtered.filter(record => new Date(record.date).getFullYear().toString() === selectedYear);
      }

      // Filter by selected month
      if (selectedMonth) {
        filtered = filtered.filter(record => {
          const recordMonth = new Date(record.date).getMonth() + 1; // getMonth returns 0-11
          return recordMonth.toString().padStart(2, '0') === selectedMonth;
        });
      }

      setFilteredRecords(filtered);
    };

    filterRecords();
  }, [searchNic, attendanceStatus, selectedYear, selectedMonth, records, employees]);

  const getEmployeeDetails = (employeeId) => {
    const employee = employees.find(emp => emp._id === employeeId);
    return employee ? { name: employee.name, nic: employee.nic } : { name: 'Unknown', nic: 'Unknown' };
  };

  const totalRecords = filteredRecords.length;
  const totalOvertimeHours = filteredRecords.reduce((sum, record) => sum + record.overtimeHours, 0);
  const totalPresent = filteredRecords.filter(record => record.status === 'Present').length;
  const totalAbsent = filteredRecords.filter(record => record.status === 'Absent').length;

  const calculateSalary = () => {
    const dailySalary = 1500.0;
    const overtimeRate = 150.0;

    const salaryData = filteredRecords.reduce((acc, record) => {
      const employee = getEmployeeDetails(record.employeeId);

      // Check if employee already exists in the salaryData
      const existingEmployee = acc.find(item => item.nic === employee.nic);
      
      if (existingEmployee) {
        // Update overtime hours and work days for existing employee
        if (record.status === 'Present') {
          existingEmployee.workDays += 1;
        }
        existingEmployee.overtimeHours += record.overtimeHours;
      } else {
        // Add a new employee with initial values
        acc.push({
          name: employee.name,
          nic: employee.nic,
          workDays: record.status === 'Present' ? 1 : 0,
          overtimeHours: record.overtimeHours,
          totalSalary: 0, // Will be calculated later
        });
      }

      return acc;
    }, []);

    // Calculate total salary for each employee
    salaryData.forEach(item => {
      item.totalSalary = (item.workDays * dailySalary + item.overtimeHours * overtimeRate).toFixed(2);
    });

    setSalarySummary(salaryData);

    const total = salaryData.reduce((sum, item) => sum + parseFloat(item.totalSalary), 0);
    setTotalSalary(total.toFixed(2));
  };

  const generateReport = () => {
    const reportData = salarySummary
      .map(
        (summary) =>
          `Employee Name: ${summary.name}\n` +
          `Employee NIC: ${summary.nic}\n` +
          `Work Days: ${summary.workDays}\n` +
          `Overtime Hours: ${summary.overtimeHours}\n` +
          `Total Salary: ${summary.totalSalary}\n` +
          `----------------------------\n`
      )
      .join('');

    const totalReport = `Total Salary for All Employees: ${totalSalary} Rupees\n`;

    setReport(`${reportData}${totalReport}`);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text('Salary Summary Report', 10, 10);
    doc.setFontSize(12);

    let y = 20;
    salarySummary.forEach((summary) => {
      doc.text(`Employee Name: ${summary.name}`, 10, y);
      doc.text(`Employee NIC: ${summary.nic}`, 10, y + 10);
      doc.text(`Work Days: ${summary.workDays}`, 10, y + 20);
      doc.text(`Overtime Hours: ${summary.overtimeHours}`, 10, y + 30);
      doc.text(`Total Salary: ${summary.totalSalary}`, 10, y + 40);
      doc.text('----------------------------', 10, y + 50);
      y += 60;
    });

    doc.text(`Total Salary for All Employees: ${totalSalary} Rupees`, 10, y);
    doc.save('salary_summary_report.pdf');
  };

  // Bar Chart Data
  const barChartData = {
    labels: filteredRecords.map(record => getEmployeeDetails(record.employeeId).name),
    datasets: [
      {
        label: 'Overtime Hours',
        data: filteredRecords.map(record => record.overtimeHours),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: true,
        text: 'Employee Overtime Hours',
      },
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Attendance Records - Payment View</h2>
      <br/>

      <div style={styles.filterContainer}>
        <label htmlFor="nicFilter" style={styles.label}>
          Filter by Employee NIC
          <br/>
        </label>
        <input
          type="text"
          id="nicFilter"
          style={styles.input}
          value={searchNic}
          onChange={(e) => setSearchNic(e.target.value)}
          placeholder="Enter NIC to filter"
        />
      </div>

      <div style={styles.filterContainer}>
        <label htmlFor="attendanceFilter" style={styles.label}>Filter by Attendance Status:</label>
        <select
          id="attendanceFilter"
          value={attendanceStatus}
          onChange={(e) => setAttendanceStatus(e.target.value)}
          style={styles.input}
        >
          <option value="All">All</option>
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
        </select>
      </div>

      <div style={styles.filterContainer}>
        <label htmlFor="yearFilter" style={styles.label}>Filter by Year:</label>
        <select
          id="yearFilter"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          style={styles.input}
        >
          <option value="">All</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <div style={styles.filterContainer}>
        <label htmlFor="monthFilter" style={styles.label}>Filter by Month:</label>
        <select
          id="monthFilter"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          style={styles.input}
        >
          {months.map((month) => (
            <option key={month.value} value={month.value}>
              {month.label}
            </option>
          ))}
        </select>
      </div>

      <div style={styles.buttonContainer}>
        <Link to="/dashboard" style={styles.linkButton}>
          Go to Dashboard
        </Link>
        <button onClick={calculateSalary} style={styles.calculateButton}>
          Calculate Salary
        </button>
        <button onClick={generateReport} style={styles.reportButton}>
          Generate Report
        </button>
        <button onClick={generatePDF} style={styles.pdfButton}>
          Download PDF
        </button>
      </div>

      {salarySummary.length > 0 && (
        <div style={styles.salarySummary}>
          <h2 style={styles.summaryTitle}>Salary Summary</h2>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th>Employee Name</th>
                <th>Employee NIC</th>
                <th>Work Days</th>
                <th>Overtime Hours</th>
                <th>Total Salary</th>
              </tr>
            </thead>
            <tbody>
              {salarySummary.map((summary, index) => (
                <tr key={index} style={styles.tableRow}>
                  <td>{summary.name}</td>
                  <td>{summary.nic}</td>
                  <td>{summary.workDays}</td>
                  <td>{summary.overtimeHours}</td>
                  <td>{summary.totalSalary}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h3 style={styles.totalSalary}>Total Salary for All Employees: {totalSalary} Rupees</h3>
        </div>
      )}

      <div style={styles.reportSection}>
        <h4 style={styles.reportTitle}>Generated Report:</h4>
        <pre style={styles.reportContent}>{report}</pre>
      </div>

      {/* Render Bar Chart */}
      <div style={styles.chartContainer}>
        <Bar data={barChartData} options={barChartOptions} />
      </div>
    </div>
  );
}

// Styles
const styles = {
  container: {
    width: '80%',
    margin: '0 auto',
    padding: '20px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
    color: '#000',
  },
  title: {
    fontSize: '34px',
    marginBottom: '20px',
    color: '#000000',
  },
  filterContainer: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    color: '#000',
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #dc3545',
    backgroundColor: '#fff',
    color: '#000',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '20px',
  },
  tableHeader: {
    backgroundColor: '#a1192d',
    color: '#fff',
    textAlign: 'left',
  },
  tableRow: {
    borderBottom: '1px solid #000000',
  },
  summaryContainer: {
    marginBottom: '20px',
  },
  summaryTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#dc3545',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '20px',
  },
  linkButton: {
    textDecoration: 'none',
    backgroundColor: '#a1192d',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '5px',
  },
  calculateButton: {
    backgroundColor: '#a1192d',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '5px',
  },
  reportButton: {
    backgroundColor: '#a1192d',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '5px',
  },
  pdfButton: {
    backgroundColor: '#a1192d',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '5px',
  },
  salarySummary: {
    marginTop: '30px',
    color: '#000',
  },
  totalSalaryContainer: {
    marginTop: '20px',
    color: '#000000',
  },
  reportSummary: {
    marginTop: '20px',
    whiteSpace: 'pre-wrap',
    color: '#000',
  },
};

export default Payments;
