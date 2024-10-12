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
    
    // Add creative header
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Set red bold font for the header title
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 0, 0); // Red color
    doc.setFontSize(20);
    doc.text('Levaggio Vehicle Service Center', pageWidth / 2, 15, { align: 'center' });
    
    // Add a thin underline beneath the title
    doc.setDrawColor(255, 0, 0); // Red underline
    doc.line(20, 18, pageWidth - 20, 18); // Horizontal line
  
    // Add a creative subtitle with a different font style and size
    doc.setFontSize(16);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(0, 0, 0);  // Black color for the subtitle
    doc.text('Salary Summary Report', pageWidth / 2, 30, { align: 'center' });
  
    // Reset to normal font and color for body text
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);  // Black color
    doc.setFontSize(12);
  
    // Add an image (logo) to the body (you need Base64 data or image URL)
    const imgData = 'data:image/png;base64,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'
    doc.addImage(imgData, 'JPEG', 70,245, 80, 30, 80);  // Adjust size and position as needed
  
    let y = 50; // Adjusted starting point for the text content
    salarySummary.forEach((summary) => {
      doc.text(`Employee Name: ${summary.name}`, 10, y);
      doc.text(`Employee NIC: ${summary.nic}`, 10, y + 10);
      doc.text(`Work Days: ${summary.workDays}`, 10, y + 20);
      doc.text(`Overtime Hours: ${summary.overtimeHours}`, 10, y + 30);
      doc.text(`Total Salary: ${summary.totalSalary}`, 10, y + 40);
      
      // Add a dashed line separator between employees for more clarity
      doc.setLineDash([3, 3], 0);  // Dash pattern: 3mm dash, 3mm space
      doc.line(10, y + 50, pageWidth - 10, y + 50); // Horizontal dashed line
      
      y += 60;
    });
  
    doc.text(`Total Salary for All Employees: ${totalSalary} Rupees`, 10, y);
  
    // Add footer with page number and company name
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      
      // Page number in the footer
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);  // Black footer text
      doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
  
      // Company footer with red color
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0); 
      doc.text('levaggio@gmail.com', pageWidth / 2, pageHeight - 20, { align: 'center' });
      
    }
  
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
      <br/>
      <br/>
      <br/>
      <h2 style={styles.title}><b>Attendance Records - Payment View</b></h2>
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

<br/>
<br/>

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
      <br/>
      <br/>
        <h4 style={styles.summaryTitle}>Summary</h4>
        <br/>
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
          <br/>
          <h2 style={styles.summaryTitle}>Salary Summary</h2>
          <br/>
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
      <br/>
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
