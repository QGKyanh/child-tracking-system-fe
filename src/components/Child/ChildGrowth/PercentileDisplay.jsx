import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  VStack,
  Badge,
  Tooltip,
} from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';

const PercentileDisplay = ({ childData, latestGrowthData }) => {
  // Map the level to a color scheme
  const getLevelColor = level => {
    switch (level) {
      case 'Low':
        return 'orange';
      case 'High':
        return 'blue';
      case 'Average':
        return 'green';
      case 'Obese':
        return 'red';
      default:
        return 'gray';
    }
  };

  // Check if we have required data
  if (!childData || !latestGrowthData || !latestGrowthData.growthResult) {
    return (
      <Box p={4} borderWidth='1px' borderRadius='lg'>
        <Text>No growth data available to calculate percentiles.</Text>
      </Box>
    );
  }

  const results = latestGrowthData.growthResult;

  return (
    <Box p={4} borderWidth='1px' borderRadius='lg' bg='white' shadow='sm'>
      <VStack spacing={4} align='stretch'>
        <Heading size='md'>Growth Percentiles</Heading>
        <Text fontSize='sm' color='gray.600'>
          Based on WHO Child Growth Standards for{' '}
          {childData.gender === 0 ? 'boys' : 'girls'}
        </Text>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
          <Stat>
            <StatLabel>Height</StatLabel>
            <StatNumber>{latestGrowthData.height} cm</StatNumber>
            <StatHelpText>
              {results.height?.percentile >= 0 && (
                <>
                  <Tooltip label={results.height.description} placement='top'>
                    <Badge
                      colorScheme={getLevelColor(results.height.level)}
                      cursor='help'
                    >
                      {results.height.percentile}th
                      <InfoIcon ml={1} boxSize={3} />
                    </Badge>
                  </Tooltip>
                  <Text fontSize='sm' mt={1}>
                    {results.height.level}
                  </Text>
                </>
              )}
            </StatHelpText>
          </Stat>

          <Stat>
            <StatLabel>Weight</StatLabel>
            <StatNumber>{latestGrowthData.weight} kg</StatNumber>
            <StatHelpText>
              {results.weight?.percentile >= 0 && (
                <>
                  <Tooltip label={results.weight.description} placement='top'>
                    <Badge
                      colorScheme={getLevelColor(results.weight.level)}
                      cursor='help'
                    >
                      {results.weight.percentile}th
                      <InfoIcon ml={1} boxSize={3} />
                    </Badge>
                  </Tooltip>
                  <Text fontSize='sm' mt={1}>
                    {results.weight.level}
                  </Text>
                </>
              )}
            </StatHelpText>
          </Stat>

          {latestGrowthData.headCircumference && (
            <Stat>
              <StatLabel>Head Circumference</StatLabel>
              <StatNumber>{latestGrowthData.headCircumference} cm</StatNumber>
              <StatHelpText>
                {results.headCircumference?.percentile >= 0 && (
                  <>
                    <Tooltip
                      label={results.headCircumference.description}
                      placement='top'
                    >
                      <Badge
                        colorScheme={getLevelColor(
                          results.headCircumference.level
                        )}
                        cursor='help'
                      >
                        {results.headCircumference.percentile}th
                        <InfoIcon ml={1} boxSize={3} />
                      </Badge>
                    </Tooltip>
                    <Text fontSize='sm' mt={1}>
                      {results.headCircumference.level}
                    </Text>
                  </>
                )}
              </StatHelpText>
            </Stat>
          )}
        </SimpleGrid>

        <Box pt={2} borderTopWidth='1px' borderTopColor='gray.200'>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            <Stat>
              <StatLabel>BMI (Body Mass Index)</StatLabel>
              <StatNumber>
                {(
                  latestGrowthData.weight /
                  (latestGrowthData.height / 100) ** 2
                ).toFixed(1)}
              </StatNumber>
              <StatHelpText>
                {results.bmi?.percentile >= 0 && (
                  <>
                    <Tooltip label={results.bmi.description} placement='top'>
                      <Badge
                        colorScheme={getLevelColor(results.bmi.level)}
                        cursor='help'
                      >
                        {results.bmi.percentile}th
                        <InfoIcon ml={1} boxSize={3} />
                      </Badge>
                    </Tooltip>
                    <Text fontSize='sm' mt={1}>
                      {results.bmi.level}
                    </Text>
                  </>
                )}
              </StatHelpText>
            </Stat>

            {latestGrowthData.armCircumference && (
              <Stat>
                <StatLabel>Arm Circumference</StatLabel>
                <StatNumber>{latestGrowthData.armCircumference} cm</StatNumber>
                <StatHelpText>
                  {results.armCircumference?.percentile >= 0 && (
                    <>
                      <Tooltip
                        label={results.armCircumference.description}
                        placement='top'
                      >
                        <Badge
                          colorScheme={getLevelColor(
                            results.armCircumference.level
                          )}
                          cursor='help'
                        >
                          {results.armCircumference.percentile}th
                          <InfoIcon ml={1} boxSize={3} />
                        </Badge>
                      </Tooltip>
                      <Text fontSize='sm' mt={1}>
                        {results.armCircumference.level}
                      </Text>
                    </>
                  )}
                </StatHelpText>
              </Stat>
            )}
          </SimpleGrid>
        </Box>

        <Text fontSize='xs' color='gray.500' mt={2}>
          Note: Percentiles are calculated based on WHO growth standards. Hover
          over percentiles to see more details. Always consult with a healthcare
          provider for professional assessment.
        </Text>
      </VStack>
    </Box>
  );
};

export default PercentileDisplay;