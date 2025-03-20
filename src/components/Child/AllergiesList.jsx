import { Box, VStack, Checkbox } from '@chakra-ui/react';

const allergiesList = [
  'NONE',
  'N/A',
  'DRUG_ALLERGY',
  'FOOD_ALLERGY',
  'LATEX_ALLERGY',
  'MOLD_ALLERGY',
  'PET_ALLERGY',
  'POLLEN_ALLERGY',
];

const AllergiesList = ({ values, onChange }) => {
  // Handle individual checkbox changes
  const handleCheckboxChange = (allergy, isChecked) => {
    // Make a copy of the current values
    let newValues = [...values];

    if (allergy === 'NONE' || allergy === 'N/A') {
      // If checking NONE or N/A, make it the only selection
      if (isChecked) {
        newValues = [allergy];
      } else {
        // If unchecking NONE or N/A, remove it
        newValues = newValues.filter(a => a !== allergy);
        // Default to NONE if nothing is selected
        if (newValues.length === 0) {
          newValues = ['NONE'];
        }
      }
    } else {
      if (isChecked) {
        // Add this allergy and remove NONE/N/A if present
        newValues = newValues.filter(a => a !== 'NONE' && a !== 'N/A');
        newValues.push(allergy);
      } else {
        // Remove this allergy
        newValues = newValues.filter(a => a !== allergy);
        // Default to NONE if nothing is selected
        if (newValues.length === 0) {
          newValues = ['NONE'];
        }
      }
    }

    onChange(newValues);
  };

  return (
    <Box maxH='150px' overflowY='auto' p={2} borderWidth={1} borderRadius='md'>
      <VStack align='start' spacing={2}>
        {allergiesList.map(allergy => (
          <Checkbox
            key={allergy}
            isChecked={values.includes(allergy)}
            onChange={e => handleCheckboxChange(allergy, e.target.checked)}
            colorScheme='red'
          >
            {allergy}
          </Checkbox>
        ))}
      </VStack>
    </Box>
  );
};

export default AllergiesList;
