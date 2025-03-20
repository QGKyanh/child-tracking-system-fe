import {
  Box,
  Wrap,
  WrapItem,
  Tag,
  TagLabel,
  TagCloseButton,
  Text,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';

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

const AllergiesList = ({ values = ['NONE'], onChange }) => {
  // Keep internal state synchronized with props
  const [selectedAllergies, setSelectedAllergies] = useState(values);

  // Update internal state when external values change
  useEffect(() => {
    setSelectedAllergies(values);
  }, [values]);

  // Handle tag clicks
  const handleTagClick = allergy => {
    console.log(`Tag ${allergy} clicked`);

    let newSelections;
    const isCurrentlySelected = selectedAllergies.includes(allergy);

    if (!isCurrentlySelected) {
      // Adding a new selection
      if (allergy === 'NONE' || allergy === 'N/A') {
        // If selecting NONE or N/A, make it the only selection
        newSelections = [allergy];
      } else {
        // If selecting a regular allergy, remove NONE/N/A if present
        newSelections = [
          ...selectedAllergies.filter(a => a !== 'NONE' && a !== 'N/A'),
          allergy,
        ];
      }
    } else {
      // Removing a selection
      newSelections = selectedAllergies.filter(a => a !== allergy);
      // If nothing is selected, default to NONE
      if (newSelections.length === 0) {
        newSelections = ['NONE'];
      }
    }

    console.log('New selections:', newSelections);

    // Update internal state
    setSelectedAllergies(newSelections);

    // Notify parent component
    onChange(newSelections);
  };

  // Handle close button click
  const handleTagClose = (e, allergy) => {
    e.stopPropagation(); // Prevent the tag click event

    // Only proceed if the allergy is currently selected
    if (selectedAllergies.includes(allergy)) {
      // Remove this allergy
      let newSelections = selectedAllergies.filter(a => a !== allergy);

      // If nothing is selected, default to NONE
      if (newSelections.length === 0) {
        newSelections = ['NONE'];
      }

      // Update state
      setSelectedAllergies(newSelections);

      // Notify parent
      onChange(newSelections);
    }
  };

  return (
    <Box maxH='150px' overflowY='auto' p={2} borderWidth={1} borderRadius='md'>
      <Wrap spacing={2}>
        {allergiesList.map(allergy => {
          const isSelected = selectedAllergies.includes(allergy);
          return (
            <WrapItem key={allergy}>
              <Tag
                size='md'
                borderRadius='full'
                variant={isSelected ? 'solid' : 'outline'}
                colorScheme={isSelected ? 'red' : 'gray'}
                cursor='pointer'
                onClick={() => handleTagClick(allergy)}
              >
                <TagLabel>{allergy}</TagLabel>
                {isSelected && allergy !== 'NONE' && (
                  <TagCloseButton onClick={e => handleTagClose(e, allergy)} />
                )}
              </Tag>
            </WrapItem>
          );
        })}
      </Wrap>
    </Box>
  );
};

export default AllergiesList;
