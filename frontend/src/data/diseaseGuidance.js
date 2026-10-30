
const diseaseGuidance = {
  "Tomato___Early_blight": {
    symptoms: [
      "Brown spots with concentric rings on older leaves.",
      "Yellowing around affected areas.",
      "Severely affected leaves may dry and fall."
    ],
    prevention: [
      "Avoid splashing water onto foliage.",
      "Improve spacing and airflow.",
      "Remove infected plant debris.",
      "Rotate crops where practical."
    ],
    management: [
      "Remove severely affected leaves when appropriate.",
      "Avoid working with plants when foliage is wet.",
      "Seek locally approved disease-control advice."
    ],
    care: [
      "Water consistently near the roots.",
      "Maintain good soil drainage.",
      "Monitor lower leaves regularly."
    ]
  },

  "Tomato___Late_blight": {
    symptoms: [
      "Dark, water-soaked-looking lesions on leaves.",
      "Rapid browning of foliage in favorable weather.",
      "Possible white growth near lesions in humid conditions."
    ],
    prevention: [
      "Monitor plants during cool, wet weather.",
      "Avoid prolonged leaf wetness.",
      "Use healthy planting material.",
      "Follow regional late blight alerts."
    ],
    management: [
      "Seek agricultural advice promptly because late blight can spread rapidly.",
      "Handle infected material carefully.",
      "Follow locally recommended disease management practices."
    ],
    care: [
      "Maintain good airflow.",
      "Water at soil level where possible.",
      "Inspect nearby plants for symptoms."
    ]
  },

  "Tomato___Leaf_Mold": {
    symptoms: [
      "Yellow patches on the upper leaf surface.",
      "Olive-green or brownish mold underneath leaves.",
      "Leaves may curl or wither."
    ],
    prevention: [
      "Improve greenhouse ventilation.",
      "Reduce prolonged humidity around leaves.",
      "Avoid overcrowding plants."
    ],
    management: [
      "Remove badly affected foliage when appropriate.",
      "Improve airflow around the crop.",
      "Consult local crop protection guidance."
    ],
    care: [
      "Avoid unnecessary overhead watering.",
      "Maintain suitable spacing.",
      "Monitor humidity in protected growing areas."
    ]
  },

  "Tomato___Bacterial_spot": {
    symptoms: [
      "Small dark spots on leaves.",
      "Yellowing near some lesions.",
      "Spots may also develop on fruit."
    ],
    prevention: [
      "Use healthy seeds and transplants.",
      "Avoid handling plants when wet.",
      "Clean tools and equipment.",
      "Reduce water splashing between plants."
    ],
    management: [
      "Remove heavily affected plant material when appropriate.",
      "Avoid spreading contaminated water or debris.",
      "Seek locally recommended management advice."
    ],
    care: [
      "Water near the soil.",
      "Improve air circulation.",
      "Inspect new growth regularly."
    ]
  },

  "Tomato___Spider_mites Two-spotted_spider_mite": {
    symptoms: [
      "Fine pale speckles on leaves.",
      "Yellowing or bronzing of foliage.",
      "Fine webbing may appear during heavy infestations."
    ],
    prevention: [
      "Inspect leaf undersides regularly.",
      "Avoid unnecessary plant stress.",
      "Monitor nearby plants for mites."
    ],
    management: [
      "Confirm mite presence before choosing control methods.",
      "Consider suitable biological or locally approved controls.",
      "Avoid indiscriminate pesticide use that harms beneficial organisms."
    ],
    care: [
      "Maintain appropriate watering.",
      "Inspect leaves frequently.",
      "Keep plants in suitable growing conditions."
    ]
  },

  "Tomato___Tomato_Yellow_Leaf_Curl_Virus": {
    symptoms: [
      "Upward curling and yellowing of leaves.",
      "Reduced growth or stunting.",
      "Possible reduction in flowering and fruit production."
    ],
    prevention: [
      "Monitor whiteflies that can spread the virus.",
      "Use healthy transplants.",
      "Manage weeds that may host pests.",
      "Consider resistant varieties where appropriate."
    ],
    management: [
      "Seek confirmation of suspected viral infection.",
      "Manage whitefly populations using local recommendations.",
      "Consult an agricultural specialist about severely affected plants."
    ],
    care: [
      "Monitor new growth.",
      "Maintain suitable nutrition and watering.",
      "Inspect nearby plants."
    ]
  }
};

const generalGuidance = {
  symptoms: [
    "Check for unusual spots, yellowing, curling, or discoloration.",
    "Inspect both sides of the leaf.",
    "Observe whether symptoms are spreading."
  ],
  prevention: [
    "Use healthy planting material.",
    "Maintain appropriate watering and drainage.",
    "Improve airflow around plants.",
    "Keep tools and growing areas clean."
  ],
  management: [
    "Compare symptoms with trusted agricultural references.",
    "Avoid applying treatments based only on an AI prediction.",
    "Consult local agricultural experts for suitable management."
  ],
  care: [
    "Monitor soil moisture.",
    "Provide crop-appropriate sunlight and nutrition.",
    "Inspect plants regularly."
  ]
};

export function getDiseaseGuidance(predictedClass) {
  return {
    ...(diseaseGuidance[predictedClass] || generalGuidance),
    specific: Boolean(diseaseGuidance[predictedClass])
  };
}
