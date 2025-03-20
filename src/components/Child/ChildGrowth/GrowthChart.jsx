import {
  Box,
  Heading,
  Select,
  Text,
  VStack,
  Spinner,
  Center,
  Alert,
  AlertIcon,
  HStack,
  Badge,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { format } from 'date-fns';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const GrowthChart = ({ growthData, childGender, birthDate }) => {
  // Changed default chart type to 'bmi'
  const [chartType, setChartType] = useState('bmi');
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (!growthData || growthData.length === 0) return;

    try {
      // Sort data by date
      const sortedData = [...growthData].sort(
        (a, b) => new Date(a.inputDate) - new Date(b.inputDate)
      );

      // Prepare chart data based on selected type
      const labels = sortedData.map(item => {
        const date = item.inputDate ? new Date(item.inputDate) : null;
        return date ? format(date, 'MMM d, yyyy') : 'Unknown date';
      });

      let dataPoints;

      switch (chartType) {
        case 'weight':
          dataPoints = sortedData.map(item => item.weight);
          break;
        case 'headCircumference':
          dataPoints = sortedData.map(item => item.headCircumference);
          break;
        case 'armCircumference':
          dataPoints = sortedData.map(item => item.armCircumference);
          break;
        case 'height':
          dataPoints = sortedData.map(item => item.height);
          break;
        case 'bmi':
        default:
          // Calculate BMI if it's not already available
          dataPoints = sortedData.map(item => {
            // If API already provides BMI value
            if (item.bmi) return item.bmi;

            // Calculate BMI = weight(kg) / height(m)²
            if (item.height && item.weight) {
              const heightInMeters = item.height / 100;
              return parseFloat(
                (item.weight / (heightInMeters * heightInMeters)).toFixed(1)
              );
            }
            return null;
          });
          break;
      }

      // Map colors for percentile indicators
      const getPercentileColor = (percentile, level) => {
        if (level === 'Low') return 'rgba(245, 158, 11, 1)'; // orange
        if (level === 'High') return 'rgba(59, 130, 246, 1)'; // blue
        if (level === 'Average') return 'rgba(16, 185, 129, 1)'; // green
        if (level === 'Obese') return 'rgba(239, 68, 68, 1)'; // red
        return 'rgba(107, 114, 128, 1)'; // gray
      };

      const chartConfig = {
        labels,
        datasets: [
          {
            label: `Child's ${
              chartType === 'height'
                ? 'Height'
                : chartType === 'weight'
                ? 'Weight'
                : chartType === 'headCircumference'
                ? 'Head Circumference'
                : chartType === 'armCircumference'
                ? 'Arm Circumference'
                : 'BMI'
            }`,
            data: dataPoints,
            borderColor:
              childGender === 0
                ? 'rgba(54, 162, 235, 1)'
                : 'rgba(255, 99, 132, 1)',
            backgroundColor:
              childGender === 0
                ? 'rgba(54, 162, 235, 0.2)'
                : 'rgba(255, 99, 132, 0.2)',
            borderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 7,
            // Set point colors based on percentile levels if available
            pointBackgroundColor: sortedData.map(item => {
              if (item.growthResult && item.growthResult[chartType]) {
                return getPercentileColor(
                  item.growthResult[chartType].percentile,
                  item.growthResult[chartType].level
                );
              }
              return childGender === 0
                ? 'rgba(54, 162, 235, 1)'
                : 'rgba(255, 99, 132, 1)';
            }),
          },
        ],
      };

      setChartData(chartConfig);
    } catch (error) {
      console.error('Error generating chart data:', error);
    }
  }, [growthData, chartType, childGender]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `${
          chartType === 'height'
            ? 'Height'
            : chartType === 'weight'
            ? 'Weight'
            : chartType === 'headCircumference'
            ? 'Head Circumference'
            : chartType === 'armCircumference'
            ? 'Arm Circumference'
            : 'BMI'
        } Over Time`,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            try {
              const dataIndex = context.dataIndex;
              // Make sure dataPoint is defined by checking array bounds
              if (dataIndex < 0 || dataIndex >= growthData.length) {
                return [`${context.dataset.label}: ${context.parsed.y}`];
              }

              const dataPoint = growthData[dataIndex];
              let labels = [];

              // Add the main measurement with appropriate units
              const unit =
                chartType === 'weight' ? 'kg' : chartType === 'bmi' ? '' : 'cm';

              labels.push(
                `${context.dataset.label}: ${context.parsed.y} ${unit}`
              );

              // Add percentile information if available
              if (
                dataPoint?.growthResult &&
                dataPoint.growthResult[chartType] &&
                dataPoint.growthResult[chartType].percentile >= 0
              ) {
                const result = dataPoint.growthResult[chartType];
                labels.push(
                  `Percentile: ${result.percentile}th (${result.level})`
                );

                // Add description for context only if not too long
                if (result.description && result.description.length < 100) {
                  labels.push(result.description);
                }
              }

              return labels;
            } catch (error) {
              console.error('Error in tooltip callback:', error);
              return [`Value: ${context.parsed.y}`];
            }
          },
        },
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text:
            chartType === 'weight'
              ? 'Weight (kg)'
              : chartType === 'bmi'
              ? 'BMI'
              : 'Measurement (cm)',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
    },
  };

  if (!growthData || growthData.length === 0) {
    return (
      <Alert status='info'>
        <AlertIcon />
        No growth data available. Add measurements to see the growth chart.
      </Alert>
    );
  }

  return (
    <Box p={4} borderWidth='1px' borderRadius='lg' bg='white' shadow='sm'>
      <VStack spacing={4} align='stretch'>
        <Heading size='md'>Growth Chart</Heading>

        <Select value={chartType} onChange={e => setChartType(e.target.value)}>
          <option value='bmi'>BMI</option>
          <option value='height'>Height</option>
          <option value='weight'>Weight</option>
          <option value='headCircumference'>Head Circumference</option>
          <option value='armCircumference'>Arm Circumference</option>
        </Select>

        {/* Point color legend */}
        <HStack spacing={4} wrap='wrap'>
          <Text fontSize='sm'>Status:</Text>
          <Badge colorScheme='green' borderRadius='full' px={2}>
            Average
          </Badge>
          <Badge colorScheme='blue' borderRadius='full' px={2}>
            High
          </Badge>
          <Badge colorScheme='orange' borderRadius='full' px={2}>
            Low
          </Badge>
          <Badge colorScheme='red' borderRadius='full' px={2}>
            Obese
          </Badge>
        </HStack>

        {chartData ? (
          <Box height='400px'>
            <Line data={chartData} options={chartOptions} />
          </Box>
        ) : (
          <Center p={10}>
            <Spinner />
          </Center>
        )}
      </VStack>
    </Box>
  );
};

export default GrowthChart;
