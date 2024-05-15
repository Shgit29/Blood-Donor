import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, mean_squared_error
from datetime import datetime

# Load your data
data_path = '/home/user1/Everything programming/front end web/React/blood-donor/data/people11.csv'
data = pd.read_csv(data_path)

# Convert 'Donation Date' to datetime
data['Donation Date'] = pd.to_datetime(data['Donation Date'])

# Encode categorical variables
label_encoders = {}
for column in ['Gender', 'Donation Location (Karachi)']:
    le = LabelEncoder()
    data[column] = le.fit_transform(data[column])
    label_encoders[column] = le

# Perform one-hot encoding for 'Blood Group' using pandas get_dummies
blood_group_encoded_df = pd.get_dummies(data['Blood Group'], prefix='Blood_Group')

# Concatenate the one-hot encoded blood group columns with the original data
data_encoded = pd.concat([data, blood_group_encoded_df], axis=1)

# Drop the original 'Blood Group' column
data_encoded.drop(['Blood Group'], axis=1, inplace=True)

# Split data into features (X) and target (y) for blood group model
X_blood_group = data_encoded.drop(columns=['Donation Location (Karachi)', 'Donation Date'])
y_blood_group = blood_group_encoded_df

# Split data into training and testing sets for blood group model
X_blood_group_train, X_blood_group_test, y_blood_group_train, y_blood_group_test = train_test_split(X_blood_group, y_blood_group, test_size=0.2, random_state=42)

# Split data into features (X) and target (y) for location and date models
X_location = data_encoded.drop(['Donation Location (Karachi)', 'Donation Date'], axis=1)
y_location = data_encoded['Donation Location (Karachi)']

X_date = data_encoded.drop(['Donation Date'], axis=1)
y_date = data_encoded['Donation Date'].map(datetime.toordinal)  # Convert dates to ordinal numbers

# Split data into training and testing sets for location and date models
X_location_train, X_location_test, y_location_train, y_location_test = train_test_split(X_location, y_location, test_size=0.2, random_state=42)
X_date_train, X_date_test, y_date_train, y_date_test = train_test_split(X_date, y_date, test_size=0.2, random_state=42)

# Initialize and train the location prediction model
location_model = RandomForestClassifier()
print(X_location_train)
print(y_location_train)
location_model.fit(X_location_train, y_location_train)

# Initialize and train the date prediction model
date_model = RandomForestRegressor()
date_model.fit(X_date_train, y_date_train)

# Initialize and train the blood group prediction model
blood_group_model = RandomForestClassifier()
blood_group_model.fit(X_blood_group_train, y_blood_group_train)

# Get user input for the blood group
user_blood_group = input("Enter the blood group (e.g., A+ve, B-ve, AB+ve, etc.): ")

# Prepare input data for prediction
blood_group_input = np.zeros(len(X_blood_group.columns))
blood_group_index = np.argmax(y_blood_group.columns == 'Blood_Group_' + user_blood_group)
blood_group_input[blood_group_index] = 1  # Set the value to 1 to indicate the presence of the specified blood group

# Get the features for the input blood group
# Assuming there are only 10 features (excluding blood group) in the test data
input_features = X_blood_group_test.iloc[0].values[:12]  # Select the first 10 features

# Location prediction - use the selected features
location_input_data = input_features.copy()  # Include all features for location prediction

# Predict location
predicted_location = location_model.predict([location_input_data])[0]
predicted_location_label = label_encoders['Donation Location (Karachi)'].inverse_transform([predicted_location])[0]

# Print the results
print("Predicted Location:", predicted_location_label)

# Now continue with date prediction
input_feature = X_blood_group_test.iloc[0].values[:1]
# Include blood group information for date prediction
date_input_data = np.concatenate((input_feature, blood_group_input))  # Combine features and blood group input

# Predict date (ordinal format)
predicted_date_ordinal = date_model.predict([date_input_data])[0]

# Convert predicted date back to datetime format
predicted_date = datetime.fromordinal(int(predicted_date_ordinal))

# Print the predicted date
print("Predicted Donation Date:", predicted_date.strftime('%Y-%m-%d'))

# print("predicted")
