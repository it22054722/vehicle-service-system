// InventoryManagement/Summary.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const InventorySummary = () => {
  const [summary, setSummary] = useState({
    totalItems: 0,
    outOfStockItems: 0,
    mostUsedItems: [],
  });

  useEffect(() => {
    // Fetch inventory data for summary
    axios.get('http://localhost:3001/inventory')
      .then((response) => {
        const items = response.data;
        const totalItems = items.length;
        const outOfStockItems = items.filter(item => item.Quantity === 0).length;

        // Sort items by usage (assuming you have a 'usage' field in your model)
        const mostUsedItems = items.sort((a, b) => b.Quantity - a.Quantity).slice(0, 5); // Get top 5 most used items

        setSummary({ totalItems, outOfStockItems, mostUsedItems });
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="text-center">Inventory Summary</h2>
      <div className="row mt-4">
        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Total Items</h5>
              <p className="card-text">{summary.totalItems}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Out of Stock</h5>
              <p className="card-text">{summary.outOfStockItems}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Most Used Items</h5>
              <ul className="list-group">
                {summary.mostUsedItems.map(item => (
                  <li key={item.ItemId} className="list-group-item">
                    {item.ItemName} - {item.Quantity}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventorySummary;
