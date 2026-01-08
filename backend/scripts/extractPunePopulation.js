const fs = require('fs');
const path = require('path');
const csv = require('csv-writer').createObjectCsvWriter;

// Mock data structure - in reality, you would use geotiff.js to read TIF files
// For now, let's create sample Pune population data

const punePopulationData = [
    {
        city: "Pune",
        year: 2000,
        totalPopulation: 2540000,
        growthRate: 2.1,
        density: 4500,
        ageGroups: {
            "0-14": 28.5,
            "15-24": 20.3,
            "25-54": 38.2,
            "55-64": 8.1,
            "65+": 4.9
        }
    },
    {
        city: "Pune",
        year: 2005,
        totalPopulation: 3125000,
        growthRate: 2.3,
        density: 5500,
        ageGroups: {
            "0-14": 27.8,
            "15-24": 21.5,
            "25-54": 37.8,
            "55-64": 8.5,
            "65+": 4.4
        }
    },
    {
        city: "Pune",
        year: 2010,
        totalPopulation: 3850000,
        growthRate: 2.4,
        density: 6800,
        ageGroups: {
            "0-14": 26.5,
            "15-24": 22.1,
            "25-54": 38.5,
            "55-64": 8.7,
            "65+": 4.2
        }
    },
    {
        city: "Pune",
        year: 2015,
        totalPopulation: 4750000,
        growthRate: 2.5,
        density: 8400,
        ageGroups: {
            "0-14": 25.2,
            "15-24": 23.4,
            "25-54": 38.8,
            "55-64": 9.1,
            "65+": 3.5
        }
    },
    {
        city: "Pune",
        year: 2020,
        totalPopulation: 5870000,
        growthRate: 2.6,
        density: 10400,
        ageGroups: {
            "0-14": 24.1,
            "15-24": 24.8,
            "25-54": 39.2,
            "55-64": 9.4,
            "65+": 2.5
        }
    },
    {
        city: "Pune",
        year: 2025,
        totalPopulation: 7240000,
        growthRate: 2.7,
        density: 12800,
        ageGroups: {
            "0-14": 22.8,
            "15-24": 25.6,
            "25-54": 40.1,
            "55-64": 9.8,
            "65+": 1.7
        }
    }
];

// Save to CSV for analysis
const csvWriter = csv({
    path: path.join(__dirname, '../../data/pune_population_2000_2025.csv'),
    header: [
        {id: 'city', title: 'CITY'},
        {id: 'year', title: 'YEAR'},
        {id: 'totalPopulation', title: 'TOTAL_POPULATION'},
        {id: 'growthRate', title: 'GROWTH_RATE'},
        {id: 'density', title: 'DENSITY_KM2'},
        {id: 'age_0_14', title: 'AGE_0_14_PERCENT'},
        {id: 'age_15_24', title: 'AGE_15_24_PERCENT'},
        {id: 'age_25_54', title: 'AGE_25_54_PERCENT'},
        {id: 'age_55_64', title: 'AGE_55_64_PERCENT'},
        {id: 'age_65_plus', title: 'AGE_65_PLUS_PERCENT'}
    ]
});

const records = punePopulationData.map(item => ({
    city: item.city,
    year: item.year,
    totalPopulation: item.totalPopulation,
    growthRate: item.growthRate,
    density: item.density,
    age_0_14: item.ageGroups["0-14"],
    age_15_24: item.ageGroups["15-24"],
    age_25_54: item.ageGroups["25-54"],
    age_55_64: item.ageGroups["55-64"],
    age_65_plus: item.ageGroups["65+"]
}));

csvWriter.writeRecords(records)
    .then(() => {
        console.log('✅ Pune population CSV file created successfully!');
        console.log('📍 Location: data/pune_population_2000_2025.csv');
    })
    .catch(err => {
        console.error('❌ Error writing CSV:', err);
    });

module.exports = { punePopulationData };