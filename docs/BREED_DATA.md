# Dog Breed Data and Attribute Calculations

This document explains how dog breed data is structured and how attributes are calculated in the Dog Breed Identification application.

## Dog Breed Data Structure

Dog breed data is stored in `dog_breeds_attributes1.json` and includes comprehensive information about various dog breeds. This data is used to calculate attributes based on predicted breed matches.

### Example Breed Data Entry

```json
{
  "Breed Name": {
    "size": 4.5,
    "weight": 65,
    "lifespan": 12,
    "trainability": 4.2,
    "energy_level": 3.8,
    "aggression": 2.1,
    "additional_traits": {
      "shedding": 3.5,
      "grooming_needs": 2.8,
      "good_with_children": 4.0,
      "good_with_other_dogs": 3.5,
      "health_issues": 2.3
    },
    "origin": "Germany",
    "primary_purpose": "Herding",
    "coat_type": "Double coat, medium length",
    "temperament": ["Loyal", "Intelligent", "Alert", "Confident"]
  }
}
```

### Primary Attributes

The following primary attributes are used in the application's radar chart and calculations:

1. **Size** (1-5 scale)
   - 1: Very small (toy breeds)
   - 3: Medium-sized
   - 5: Very large

2. **Weight** (in pounds/kg)
   - Actual weight range of the breed

3. **Lifespan** (in years)
   - Average expected lifespan

4. **Trainability** (1-5 scale)
   - 1: Difficult to train
   - 3: Moderately trainable
   - 5: Highly trainable/eager to please

5. **Energy Level** (1-5 scale)
   - 1: Low energy
   - 3: Moderate energy
   - 5: High energy/very active

6. **Aggression** (1-5 scale)
   - 1: Very low aggression
   - 3: Moderate/average
   - 5: Potential for aggression

### Additional Traits

These traits are not included in the radar chart but are used for detailed insights in PDF reports:

- **Shedding** (1-5)
- **Grooming Needs** (1-5)
- **Good with Children** (1-5)
- **Good with Other Dogs** (1-5)
- **Health Issues** (1-5, higher means more potential issues)

## Attribute Calculation

When the application identifies multiple potential breed matches, attributes are calculated using a weighted average approach.

### Calculation Method

The formula for calculating each attribute is:

```
weightedAttribute = Σ(breed[attribute] * breedProbability) / Σ(breedProbability)
```

Where:
- `breed[attribute]` is the attribute value for a specific breed
- `breedProbability` is the confidence score (0-1) for that breed match

### Implementation in Code

The attribute calculation is implemented in `server/breedService.ts`:

```typescript
export async function calculateAttributes(breedPredictions: BreedPrediction[]): Promise<DogAttributes> {
  // Load breed data
  const breedData = await loadBreedData();
  
  // Initialize attribute totals and weight sum
  let attributeTotals = {
    size: 0,
    weight: 0,
    aggression: 0,
    trainability: 0,
    energy_level: 0,
    lifespan: 0
  };
  
  let weightSum = 0;
  
  // Calculate weighted sum for each attribute
  for (const prediction of breedPredictions) {
    const breedName = prediction.name;
    const probability = prediction.probability;
    
    if (breedData[breedName]) {
      Object.keys(attributeTotals).forEach(attr => {
        attributeTotals[attr] += breedData[breedName][attr] * probability;
      });
      
      weightSum += probability;
    }
  }
  
  // Calculate final weighted average
  const attributes: DogAttributes = {
    size: attributeTotals.size / weightSum,
    weight: attributeTotals.weight / weightSum,
    aggression: attributeTotals.aggression / weightSum,
    trainability: attributeTotals.trainability / weightSum,
    energy_level: attributeTotals.energy_level / weightSum,
    lifespan: attributeTotals.lifespan / weightSum
  };
  
  return attributes;
}
```

## Visualization

The calculated attributes are visualized using a radar chart in the `AttributeRadarChart` component.

### Attribute Explanation

Each attribute is displayed with a description in the results:

1. **Size**: Physical size of the dog (small to large)
2. **Weight**: Average weight in pounds/kg
3. **Aggression**: Tendency toward aggressive behavior (low to high)
4. **Trainability**: Ease of training (difficult to easy)
5. **Energy Level**: Activity level and exercise needs (low to high)
6. **Lifespan**: Average expected lifespan in years

## Adding New Breeds or Modifying Attributes

### Adding a New Breed

To add a new breed to the database:

1. Edit `dog_breeds_attributes1.json`
2. Add a new entry following the established format
3. Make sure all required attributes are included

Example of adding a new breed:

```json
"New Breed Name": {
  "size": 3.5,
  "weight": 45,
  "lifespan": 13,
  "trainability": 4.0,
  "energy_level": 3.5,
  "aggression": 2.0,
  "additional_traits": {
    "shedding": 3.0,
    "grooming_needs": 2.5,
    "good_with_children": 4.5,
    "good_with_other_dogs": 4.0,
    "health_issues": 2.0
  },
  "origin": "United States",
  "primary_purpose": "Companionship",
  "coat_type": "Short, dense",
  "temperament": ["Friendly", "Playful", "Gentle", "Sociable"]
}
```

### Modifying Attribute Calculations

To change how attributes are calculated:

1. Modify the `calculateAttributes` function in `server/breedService.ts`
2. Update the `DogAttributes` interface in `shared/types.ts` if adding new attributes
3. Update the `AttributeRadarChart` component to visualize any new attributes

## Additional Information for PDF Reports

The PDF reports include more detailed information about each breed match, including:

1. **Breed History and Origin**
2. **Temperament and Personality**
3. **Exercise and Training Needs**
4. **Health Considerations**
5. **Grooming Requirements**

This data is compiled from the breed database and formatted in the `pdfGenerator.ts` file.

## Data Sources and Attribution

The breed data is compiled from reputable sources including:

1. American Kennel Club (AKC)
2. The Kennel Club (UK)
3. Fédération Cynologique Internationale (FCI)
4. Scientific studies on dog breeds and behavior

When updating breed information, ensure you're using accurate, up-to-date information from reliable sources.

## Customizing Attribute Ranges

If you need to customize the attribute scales and ranges:

1. Modify the data in `dog_breeds_attributes1.json`
2. Update the radar chart configuration in `AttributeRadarChart.tsx`
3. Update the attribute descriptions in `ResultsState.tsx`

Ensure all attributes use consistent scaling for accurate comparisons between breeds.