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
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [salarySummary, setSalarySummary] = useState([]);
  const [totalSalary, setTotalSalary] = useState(0);
  const [report, setReport] = useState('');
  const [statusFilter, setStatusFilter] = useState(''); // New state for status filter
  const [monthFilter, setMonthFilter] = useState(''); // New state for month filter
  const [yearFilter, setYearFilter] = useState(''); // New state for year filter

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
      let filtered = records;
  
      if (searchNic) {
        filtered = filtered.filter(record => {
          const employee = employees.find(emp => emp._id === record.employeeId);
          return employee && employee.nic.toLowerCase().includes(searchNic.toLowerCase());
        });
      }
  
      if (statusFilter) {
        filtered = filtered.filter(record => record.status === statusFilter);
      }
  
      if (monthFilter) {
        filtered = filtered.filter(record => {
          const recordDate = new Date(record.date);
          const recordMonth = recordDate.getMonth() + 1;
          return recordMonth === parseInt(monthFilter);
        });
      }
  
      if (yearFilter) {
        filtered = filtered.filter(record => {
          const recordDate = new Date(record.date);
          const recordYear = recordDate.getFullYear(); // Get the full year
          return recordYear === parseInt(yearFilter);
        });
      }
  
      setFilteredRecords(filtered);
    };
  
    filterRecords();
  }, [searchNic, records, employees, statusFilter, monthFilter, yearFilter]); // Add yearFilter to dependencies
  


  useEffect(() => {
    const filterRecords = () => {
      let filtered = records;
  
      if (searchNic) {
        filtered = filtered.filter(record => {
          const employee = employees.find(emp => emp._id === record.employeeId);
          return employee && employee.nic.toLowerCase().includes(searchNic.toLowerCase());
        });
      }
  
      if (statusFilter) {
        filtered = filtered.filter(record => record.status === statusFilter);
      }
  
      if (monthFilter) {
        filtered = filtered.filter(record => {
          const recordDate = new Date(record.date);
          const recordMonth = recordDate.getMonth() + 1; // getMonth() returns 0-based index
          return recordMonth === parseInt(monthFilter);
        });
      }
  
      setFilteredRecords(filtered);
    };
  
    filterRecords();
  }, [searchNic, records, employees, statusFilter, monthFilter]); // Add monthFilter to dependencies
  

  useEffect(() => {
    const filterRecords = () => {
      let filtered = records;

      if (searchNic) {
        filtered = filtered.filter(record => {
          const employee = employees.find(emp => emp._id === record.employeeId);
          return employee && employee.nic.toLowerCase().includes(searchNic.toLowerCase());
        });
      }

      if (statusFilter) {
        filtered = filtered.filter(record => record.status === statusFilter);
      }

      setFilteredRecords(filtered);
    };

    filterRecords();
  }, [searchNic, records, employees, statusFilter]); // Add statusFilter to dependencies

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

      const existingEmployee = acc.find(item => item.nic === employee.nic);
      
      if (existingEmployee) {
        if (record.status === 'Present') {
          existingEmployee.workDays += 1;
        }
        existingEmployee.overtimeHours += record.overtimeHours;
      } else {
        acc.push({
          name: employee.name,
          nic: employee.nic,
          workDays: record.status === 'Present' ? 1 : 0,
          overtimeHours: record.overtimeHours,
          totalSalary: 0,
        });
      }

      return acc;
    }, []);

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
        <label htmlFor="statusFilter" style={styles.label}>
          Filter by Status
        </label>
        <select
          id="statusFilter"
          style={styles.input}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All</option>
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
        </select>
      </div>

      <div style={styles.filterContainer}>
  <label htmlFor="monthFilter" style={styles.label}>
    Filter by Month
  </label>
  <select
    id="monthFilter"
    style={styles.input}
    value={monthFilter}
    onChange={(e) => setMonthFilter(e.target.value)}
  >
    <option value="">All</option>
    <option value="1">January</option>
    <option value="2">February</option>
    <option value="3">March</option>
    <option value="4">April</option>
    <option value="5">May</option>
    <option value="6">June</option>
    <option value="7">July</option>
    <option value="8">August</option>
    <option value="9">September</option>
    <option value="10">October</option>
    <option value="11">November</option>
    <option value="12">December</option>
  </select>
</div>


<div style={styles.filterContainer}>
  <label htmlFor="yearFilter" style={styles.label}>
    Filter by Year
  </label>
  <select
    id="yearFilter"
    style={styles.input}
    value={yearFilter}
    onChange={(e) => setYearFilter(e.target.value)}
  >
    <option value="">All</option>
    <option value="2020">2020</option>
    <option value="2021">2021</option>
    <option value="2022">2022</option>
    <option value="2023">2023</option>
    <option value="2024">2024</option>
    {/* Add more years as necessary */}
  </select>
</div>



      <table style={styles.table}>
        <thead>
          <tr style={styles.tableHeader}>
            <th>Employee Name</th>
            <th>Employee NIC</th>
            <th>Date</th>
            <th>Status</th>
            <th>Overtime Hours</th>
          </tr>
        </thead>
        <tbody>
          {filteredRecords.map((record) => {
            const { name, nic } = getEmployeeDetails(record.employeeId);
            return (
              <tr key={record._id} style={styles.tableRow}>
                <td>{name}</td>
                <td>{nic}</td>
                <td>{record.date}</td>
                <td>{record.status}</td>
                <td>{record.overtimeHours}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div style={styles.summaryContainer}>
        <h4 style={styles.summaryTitle}>Summary</h4>
        <p>Total Records: {totalRecords}</p>
        <p>Total Overtime Hours: {totalOvertimeHours}</p>
        <p>Total Present: {totalPresent}</p>
        <p>Total Absent: {totalAbsent}</p>
        <br/>
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
          <br />
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
          <br/>
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
  totalSalary: {
    marginTop: '20px',
    color: '#000000',
  },
  reportSection: {
    marginTop: '20px',
    whiteSpace: 'pre-wrap',
    color: '#000',
  },
  chartContainer: {
    marginTop: '30px',
  },
};

export default Payments;
