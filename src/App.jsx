import React, { useEffect, useState } from "react";
import "./styles.css";
import ParkingSpot from "./Components/ParkingSpot";

const App = () => {
  const generateInitialSpots = () => [
    ...Array(5)
      .fill(null)
      .map((_, i) => ({
        id: i + 1,
        vehicleType: "car",
        occupied: false,
        intime: null,
        outTime: null,
        rate: 10, // ₹10 per minute
        totalEarned: 0,
        vehicleHistory: [],
      })),
    ...Array(5)
      .fill(null)
      .map((_, i) => ({
        id: i + 6,
        vehicleType: "bike",
        occupied: false,
        intime: null,
        outTime: null,
        rate: 10, // ₹10 per minute
        totalEarned: 0,
        vehicleHistory: [],
      })),
  ];

  const [spots, setSpots] = useState(() => {
    const stored = localStorage.getItem("parkingSpots");
    return stored ? JSON.parse(stored) : generateInitialSpots();
  });

  useEffect(() => {
    localStorage.setItem("parkingSpots", JSON.stringify(spots));
  }, [spots]);

  const handlePark = (id) => {
    setSpots((prev) =>
      prev.map((spot) =>
        spot.id === id && !spot.occupied
          ? {
              ...spot,
              occupied: true,
              intime: new Date().toISOString(), // store full date-time for duration calc
              vehicleHistory: [
                ...spot.vehicleHistory,
                {
                  vehicleId: `${spot.vehicleType.toUpperCase()}_${Date.now()}`,
                  intime: new Date().toISOString(),
                  outTime: null,
                  duration: null,
                  cost: 0,
                },
              ],
            }
          : spot
      )
    );
  };

  const handleExit = (id) => {
    setSpots((prev) =>
      prev.map((spot) => {
        if (spot.id === id && spot.occupied) {
          const outTime = new Date();
          const lastVehicle = spot.vehicleHistory[spot.vehicleHistory.length - 1];

          // calculate duration (in minutes)
          const inTimeObj = new Date(lastVehicle.intime);
          const durationInMinutes = Math.ceil(
            (outTime - inTimeObj) / 60000 // convert ms → minutes
          );

          const cost = durationInMinutes * spot.rate;

          return {
            ...spot,
            occupied: false,
            intime: null,
            outTime: outTime.toISOString(),
            totalEarned: spot.totalEarned + cost,
            vehicleHistory: [
              ...spot.vehicleHistory.slice(0, -1),
              {
                ...lastVehicle,
                outTime: outTime.toISOString(),
                duration: durationInMinutes,
                cost,
              },
            ],
          };
        }
        return spot;
      })
    );
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all parking data?")) {
      const resetSpots = generateInitialSpots();
      setSpots(resetSpots);
      localStorage.setItem("parkingSpots", JSON.stringify(resetSpots));
    }
  };

  const totalEarnings = spots.reduce((sum, s) => sum + s.totalEarned, 0);

  return (
    <div className="app">
      <h2 style={{ color: "blue" }}>Car Parking Spots</h2>
      <div className="parking-container">
        {spots
          .filter((s) => s.vehicleType === "car")
          .map((spot) => (
            <ParkingSpot
              key={spot.id}
              spot={spot}
              handlePark={handlePark}
              handleExit={handleExit}
            />
          ))}
      </div>

      <h2 style={{ color: "blue" }}>Bike Parking Spots</h2>
      <div className="parking-container">
        {spots
          .filter((s) => s.vehicleType === "bike")
          .map((spot) => (
            <ParkingSpot
              key={spot.id}
              spot={spot}
              handlePark={handlePark}
              handleExit={handleExit}
            />
          ))}
      </div>

      <div className="summary">
        <h3>Total Earnings: ₹{totalEarnings}</h3>
        <button onClick={handleReset}>Reset All</button>
      </div>
    </div>
  );
};

export default App;
