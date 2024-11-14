# from pyspark.sql import SparkSession
# from pyspark.sql.functions import col
# from pyspark.ml.recommendation import ALS
# from pyspark.ml.evaluation import RegressionEvaluator
# import sys

# # Initialize Spark session
# spark = SparkSession.builder \
#     .appName("VideoRecommendation") \
#     .config("spark.mongodb.input.uri", "mongodb://localhost:27017/CSE356.views") \
#     .config("spark.jars.packages", "org.mongodb.spark:mongo-spark-connector_2.12:3.0.1") \
#     .getOrCreate()

# # Load data from MongoDB (assuming you have MongoDB Spark Connector setup)
# df = spark.read \
#     .format("mongo") \
#     .option("uri", "mongodb://localhost:27017/CSE356.views") \
#     .load()

# # Preprocess the data: Ensure 'value' is either 1 (liked) or 0 (disliked)
# df = df.select("user_id", "video_id", "value") \
#        .filter(col("value").isNotNull()) \
#        .withColumn("value", 
#                   (col("value") == True).cast("int"))  # Convert True/False to 1/0

# # Convert data to a format suitable for ALS
# training_data = df.select("user_id", "video_id", "value")

# # Train the ALS model
# als = ALS(
#     userCol="user_id",
#     itemCol="video_id",
#     ratingCol="value",
#     coldStartStrategy="drop"
# )
# model = als.fit(training_data)

# # Evaluate the model (optional but recommended)
# predictions = model.transform(training_data)
# evaluator = RegressionEvaluator(
#     metricName="rmse", 
#     labelCol="value", 
#     predictionCol="prediction"
# )
# rmse = evaluator.evaluate(predictions)
# print(f"Root-mean-square error = {rmse}")

# # Generate recommendations for a specific user (e.g., logged-in user with user_id = 123)
# if len(sys.argv) > 1:
#     user_id = int(sys.argv[1])
# else:
#     print("Please provide a user_id as a command-line argument.")
#     sys.exit(1)

# # Generate top 10 recommendations for the user
# recommendations = model.recommendForUserSubset(
#     training_data.filter(col("user_id") == user_id), 10
# )

# # Show the recommended videos for the user
# recommendations.show(truncate=False)

# # Extract video_ids into a Python list
# # recommendations.rdd.flatMap() allows us to extract the video IDs from the recommendations
# video_ids = recommendations.rdd.flatMap(lambda row: [x['video_id'] for x in row['recommendations']]).collect()

# # Print the video IDs
# print(f"{{user_id: {user_id}, recommendations: {video_ids}}}")

# # Stop the Spark session when done
# spark.stop()


# spark-submit --packages org.mongodb.spark:mongo-spark-connector_2.12:10.2.2 algorithm/algorithm.py bob

import sys
import random
from pyspark.sql import SparkSession, functions as F
from pyspark.ml.recommendation import ALS
from pyspark.sql.functions import col
from pyspark.ml.feature import StringIndexer

# Check if user_id is provided
if len(sys.argv) < 2:
    print("Usage: script.py <user_id>")
    sys.exit(1)

user_id = sys.argv[1]  # Get user_id from command-line argument

# Initialize Spark session
spark = SparkSession.builder \
    .appName("SpecificUserRecommendation") \
    .config("spark.mongodb.input.uri", "mongodb://127.0.0.1:27017/CSE356.Interactions") \
    .config("spark.mongodb.output.uri", "mongodb://127.0.0.1:27017/CSE356.Recommendations") \
    .getOrCreate()

# Load data from MongoDB
interactions = spark.read \
    .format("mongodb") \
    .option("database", "CSE356") \
    .option("collection", "interactions") \
    .load()

# Filter to only "liked" interactions (value = true)
likes = interactions.filter(col("value") == True).select("user_id", "video_id")

# Convert video IDs into an indexed column for ALS model
user_indexer = StringIndexer(inputCol="user_id", outputCol="user_idx").fit(likes)
video_indexer = StringIndexer(inputCol="video_id", outputCol="video_idx").fit(likes)

# Apply indexers
likes_indexed = user_indexer.transform(likes)
likes_indexed = video_indexer.transform(likes_indexed)

# Prepare data for ALS model
als_data = likes_indexed.select(
    col("user_idx").cast("int").alias("user"),
    col("video_idx").cast("int").alias("item")
)
als_data = als_data.withColumn("rating", F.lit(1.0))


# Initialize and train ALS model
als = ALS(maxIter=10, regParam=0.01, userCol="user", itemCol="item", ratingCol="rating", coldStartStrategy="drop")
model = als.fit(als_data)

# Function to get recommendations for a specific user
def get_recommendations_for_user(user_id, num_recommendations=10):
    # Get the index of the specified user
    user_idx = user_indexer.transform(spark.createDataFrame([(user_id,)], ["user_id"])).select("user_idx").first()[0]

    # Generate recommendations for the user
    user_recs = model.recommendForUserSubset(
        spark.createDataFrame([(user_idx,)], ["user"]),
        num_recommendations
    ).select("recommendations").first()[0]

    # Get liked videos to filter out
    liked_videos = likes_indexed.filter(col("user_idx") == user_idx).select("video_idx").rdd.flatMap(lambda x: x).collect()

    # Filter recommendations to exclude already-liked videos
    recommended_videos = [int(rec["item"]) for rec in user_recs if int(rec["item"]) not in liked_videos]

    # Fill with random videos if there aren't enough recommendations
    if len(recommended_videos) < num_recommendations:
        all_video_ids = video_indexer.labels  # List of all video IDs
        liked_video_ids = [video_indexer.labels[int(v)] for v in liked_videos]
        
        # Choose random videos that are not liked already
        random_videos = [v for v in all_video_ids if v not in liked_video_ids]
        additional_videos = random.sample(random_videos, num_recommendations - len(recommended_videos))
        recommended_videos += additional_videos

    # Map indices back to original video IDs
    recommended_video_ids = [video_indexer.labels[int(v)] for v in recommended_videos[:num_recommendations]]
    
    # Return recommendations as a dictionary
    return {"user_id": user_id, "recommended_videos": recommended_video_ids}

# Get recommendations for the specified user ID
recommendations = get_recommendations_for_user(user_id, num_recommendations=10)
print(recommendations)

# Convert the recommendation to a DataFrame and save to MongoDB
recommendation_df = spark.createDataFrame([recommendations])
recommendation_df.write.format("mongo").mode("append").save()

print("Recommendation Successful")

# Stop the Spark session
spark.stop()
