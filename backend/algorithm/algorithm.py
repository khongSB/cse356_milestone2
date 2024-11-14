from pyspark.sql import SparkSession
from pyspark.sql.functions import col
from pyspark.ml.recommendation import ALS
from pyspark.ml.evaluation import RegressionEvaluator
import sys

# Initialize Spark session
spark = SparkSession.builder \
    .appName("VideoRecommendation") \
    .config("spark.mongodb.input.uri", "mongodb://localhost:27017/CSE356.views") \
    .config("spark.jars.packages", "org.mongodb.spark:mongo-spark-connector_2.12:3.0.1") \
    .getOrCreate()

# Load data from MongoDB (assuming you have MongoDB Spark Connector setup)
df = spark.read \
    .format("mongo") \
    .option("uri", "mongodb://localhost:27017/CSE356.views") \
    .load()

# Preprocess the data: Ensure 'value' is either 1 (liked) or 0 (disliked)
df = df.select("user_id", "video_id", "value") \
       .filter(col("value").isNotNull()) \
       .withColumn("value", 
                  (col("value") == True).cast("int"))  # Convert True/False to 1/0

# Convert data to a format suitable for ALS
training_data = df.select("user_id", "video_id", "value")

# Train the ALS model
als = ALS(
    userCol="user_id",
    itemCol="video_id",
    ratingCol="value",
    coldStartStrategy="drop"
)
model = als.fit(training_data)

# Evaluate the model (optional but recommended)
predictions = model.transform(training_data)
evaluator = RegressionEvaluator(
    metricName="rmse", 
    labelCol="value", 
    predictionCol="prediction"
)
rmse = evaluator.evaluate(predictions)
print(f"Root-mean-square error = {rmse}")

# Generate recommendations for a specific user (e.g., logged-in user with user_id = 123)
if len(sys.argv) > 1:
    user_id = int(sys.argv[1])
else:
    print("Please provide a user_id as a command-line argument.")
    sys.exit(1)

# Generate top 10 recommendations for the user
recommendations = model.recommendForUserSubset(
    training_data.filter(col("user_id") == user_id), 10
)

# Show the recommended videos for the user
recommendations.show(truncate=False)

# Extract video_ids into a Python list
# recommendations.rdd.flatMap() allows us to extract the video IDs from the recommendations
video_ids = recommendations.rdd.flatMap(lambda row: [x['video_id'] for x in row['recommendations']]).collect()

# Print the video IDs
print(f"{{user_id: {user_id}, recommendations: {video_ids}}}")

# Stop the Spark session when done
spark.stop()
