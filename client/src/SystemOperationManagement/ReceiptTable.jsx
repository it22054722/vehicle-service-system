import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { FaTrash } from 'react-icons/fa';
import { Pie, Bar } from 'react-chartjs-2';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import 'bootstrap/dist/css/bootstrap.min.css';

const ReceiptTable = () => {
    const [receipts, setReceipts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showCharts, setShowCharts] = useState(false);

    useEffect(() => {
        const storedReceipts = JSON.parse(localStorage.getItem('receipts')) || [];
        setReceipts(storedReceipts);
    }, []);

    const handleDelete = (index) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "This action cannot be undone!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        }).then((result) => {
            if (result.isConfirmed) {
                const updatedReceipts = receipts.filter((_, i) => i !== index);
                setReceipts(updatedReceipts);
                localStorage.setItem('receipts', JSON.stringify(updatedReceipts));
                Swal.fire('Deleted!', 'Your receipt has been deleted.', 'success');
            }
        });
    };

    const filteredReceipts = receipts.filter(receipt =>
        receipt.packageName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        receipt.receiptId.toString().includes(searchQuery)
    );

    const totalPrice = filteredReceipts.reduce((sum, receipt) => sum + parseFloat(receipt.totalPrice || 0), 0);
    const totalPackages = filteredReceipts.length;

    // Get all unique package names
    const allPackages = [...new Set(receipts.map(receipt => receipt.packageName))];

    // Prepare data for pie chart to show distribution of packages by count
    const packageCounts = allPackages.map(packageName => {
        const count = filteredReceipts.filter(receipt => receipt.packageName === packageName).length;
        return {
            packageName,
            count
        };
    });

    const availabilityData = {
        labels: packageCounts.map(item => item.packageName),
        datasets: [{
            data: packageCounts.map(item => item.count),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
            hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
        }]
    };

    const minMaxPriceData = {
        labels: packageCounts.map(item => item.packageName),
        datasets: [{
            label: 'Price Range',
            data: packageCounts.map(item => parseFloat(item.count)), // This could be adjusted depending on what you want to show
            backgroundColor: '#36A2EB',
            borderColor: '#36A2EB',
            borderWidth: 1,
        }]
    };

    const generateReport = () => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text('Levaiggo Booking Report', 14, 20);
        doc.setFontSize(12);
        doc.text(`Total Packages: ${totalPackages}`, 14, 30);
        doc.text(`Total Revenue: $${totalPrice.toFixed(2)}`, 14, 36);
        doc.setFontSize(14);
        doc.text('Booking Details:', 14, 46);

        const rows = filteredReceipts.map(receipt => ([
            receipt.packageName,
            `$${receipt.originalPrice}`,
            `${receipt.discount}%`,
            `$${receipt.totalPrice}`,
            receipt.bookingDate,
            receipt.paymentMethod,
        ]));

        doc.autoTable({
            head: [['Package Name', 'Original Price', 'Discount', 'Total Price', 'Booking Date', 'Payment Method']],
            body: rows,
            startY: 52,
            theme: 'striped',
            styles: {
                lineColor: [0, 0, 0],
                lineWidth: 0.2
            },
        });

        doc.save('Booking_Report.pdf');
    };

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <div className="card shadow-lg p-4" style={{ backgroundColor: 'white', borderRadius: '10px', maxWidth: '90%' }}>
                <h2 className="text-center mb-4" style={{ color: '#4CAF50' }}>Booking Table</h2>

                <div className="d-flex justify-content-between mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by Receipt ID or Package Name"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ maxWidth: '300px' }}
                    />
                    <div>
                        <p><strong>Total Packages:</strong> {totalPackages}</p>
                        <p><strong>Total Revenue:</strong> ${totalPrice.toFixed(2)}</p>
                    </div>
                </div>

                <div className="mb-3">
                    <button onClick={() => setShowCharts(true)} className="btn btn-success me-2">
                        Show Charts
                    </button>
                    <button onClick={generateReport} className="btn btn-primary">Generate Report</button>
                </div>

                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    <table className="table table-striped table-hover table-bordered">
                        <thead className="table-dark">
                            <tr>
                                <th className="text-end">Receipt ID</th>
                                <th>Package Name</th>
                                <th className="text-end">Original Price</th>
                                <th className="text-end">Discount</th>
                                <th className="text-end">Total Price</th>
                                <th className="text-end">Date of Booking</th>
                                <th className="text-end">Payment Method</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredReceipts.map((receipt, index) => (
                                <tr key={index}>
                                    <td className="text-end">{receipt.receiptId}</td>
                                    <td>{receipt.packageName}</td>
                                    <td className="text-end">${receipt.originalPrice}</td>
                                    <td className="text-end">{receipt.discount}% (-${receipt.discountAmount})</td>
                                    <td className="text-end">${receipt.totalPrice}</td>
                                    <td className="text-end">{receipt.bookingDate}</td>
                                    <td className="text-end">{receipt.paymentMethod}</td>
                                    <td className="text-center">
                                        <button
                                            onClick={() => handleDelete(index)}
                                            className="btn btn-danger btn-sm"
                                        >
                                            <FaTrash /> Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal for displaying charts */}
            <Modal show={showCharts} onHide={() => setShowCharts(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Package Analysis</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
                        <div style={{ width: '35%' }}>
                            <h5>Package Availability</h5>
                            <Pie data={availabilityData} />
                        </div>
                        <div style={{ width: '35%' }}>
                            <h5>Overall Distribution</h5>
                            <Pie data={availabilityData} /> {/* Updated to show counts of packages */}
                        </div>
                        <div style={{ width: '45%', marginTop: '20px' }}>
                            <h5>Price Range</h5>
                            <Bar data={minMaxPriceData} options={{
                                responsive: true, 
                                scales: {
                                    x: { beginAtZero: true },
                                    y: { beginAtZero: true }
                                }
                            }} />
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default ReceiptTable;
