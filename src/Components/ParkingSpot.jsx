import React from "react";

const ParkingSpot = ({ spot, handlePark, handleExit }) => {
  const { id, vehicleType, occupied, totalEarned, vehicleHistory } = spot;
  const color = occupied ? "#ff4d4d" : "#4CAF50"; 

  return (
    <div className="parking-spot" style={{ backgroundColor: color }}>
      <h3>Spot #{id}</h3>
      <p>Type: <strong>{vehicleType}</strong></p>
      <p>Status: {occupied ? "Occupied" : "Available"}</p>
      <p>Total Earned: ₹{totalEarned}</p>

      {occupied ? (
        <button onClick={() => handleExit(id)}>Vehicle Exit</button>
      ) : (
        <button onClick={() => handlePark(id)}>Park Vehicle</button>
      )}

      <details>
        <summary>History</summary>
        {vehicleHistory.length === 0 ? (
          <p>No records yet</p>
        ) : (
          <ul>
            {vehicleHistory.map((v, i) => (
              <li key={i}>
                <strong>{v.vehicleId}</strong> — In: {v.intime}, Out:{" "}
                {v.outTime || "Running"}, Duration: {v.duration || "–"} min, Cost: ₹{v.cost}
              </li>
            ))}
          </ul>
        )}
      </details>
    </div>
  );
};

export default ParkingSpot;
