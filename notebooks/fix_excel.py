import pandas as pd

# Official summary data for full Pune district 2011 (confirmed from censusindia.gov.in)
summary_data = {
    'city': ['Pune'],
    'year': [2011],
    'totalPopulation': [9429408],
    'malePopulation': [4924105],
    'femalePopulation': [4505303],
    'children_0_6': [1104960],  # Corrected slight typo from earlier
    'literates': [7098479],
    'illiterates': [2330929],
    'workingPopulation': [3766808],
    'nonWorkingPopulation': [5662600]
}
summary_df = pd.DataFrame(summary_data)

# Read raw data (will work if file is in same folder or use full path)
raw_df = pd.read_excel('PCA_CDB-2725-F-Census.xlsx', sheet_name='EB-2725')

# Create updated file
with pd.ExcelWriter('Updated_Pune_Population_Cleaned.xlsx') as writer:
    raw_df.to_excel(writer, sheet_name='Raw_Pune_Data', index=False)
    summary_df.to_excel(writer, sheet_name='Pune_Summary', index=False)

print("Updated Excel created successfully in the current folder!")