import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Chart } from 'react-google-charts';

const ChartComponent = () => {
  const [energyData, setEnergyData] = useState([]);

  const [temperatureData, setTemperatureData] = useState([]);
  // Function to update temperature data
  const updateTemperatureData = (newData) => {
    setTemperatureData(newData);
  };

  // Function to update energy data
  const updateEnergyData = (newData) => {
    setEnergyData(newData);
  };

  useEffect(() => {
    // Make sure only last 5 data points are kept in the array
    if (energyData.length > 8) {
      setEnergyData((prevData) => prevData.slice(1));
    }
  }, [energyData]);

  useEffect(() => {
    if (temperatureData.length > 8) {
      setTemperatureData((prevData) => prevData.slice(1));
    }
  });

  useEffect(() => {
    const socket = io('http://localhost:3001');
    console.log('Connecting socket...');
    socket.on('connect', () => {
      console.log('Connected!');

      socket.on('data', (data) => {
        if (data.hasOwnProperty('energyConsumed')) {
          updateEnergyData((prevData) => [...prevData, data]);
        } else if (data.hasOwnProperty('temperature')) {
          updateTemperatureData((prevData) => [...prevData, data]);
        }
      });

      socket.on('disconnect', () => {
        console.log('Disconnected!');
      });
    });

    // Cleanup function
    return () => {
      socket.disconnect();
    };
  }, []); // Empty dependency array to run the effect only once

  const energyOptions = {
    title: 'Energy Consumption',
    curveType: 'function',
    legend: { position: 'bottom' },
    hAxis: {
      title: 'Time',
    },
    vAxis: {
      title: 'Energy Consumed (kWh)',
    },
  };

  const temperatureOptions = {
    title: 'Temperature',
    curveType: 'function',
    legend: { position: 'bottom' },
    hAxis: {
      title: 'Time',
    },
    vAxis: {
      title: 'Temperature (°C)',
    },
  };

  return (
    <div>
      <Chart
        chartType='ColumnChart'
        width='800px'
        height='400px'
        data={[
          ['Time', 'Temperature (°C)'],
          ...temperatureData.map((datas) => [
            datas.timestamp.split('T')[1].split(':')[0] +
              ':' +
              datas.timestamp.split('T')[1].split(':')[1],
            datas.temperature,
          ]),
        ]}
        options={temperatureOptions}
      />
      <Chart
        chartType='LineChart'
        width='800px'
        height='400px'
        data={[
          ['Time', 'Energy Consumed (kWh)'],
          ...energyData.map((datas) => [
            datas.timestamp.split('T')[1].split(':')[0] +
              ':' +
              datas.timestamp.split('T')[1].split(':')[1],
            datas.energyConsumed,
          ]),
        ]}
        options={energyOptions}
      />
    </div>
  );
};

export default ChartComponent;
