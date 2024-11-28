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
print(f"Starting recommendation process for user_id: {user_id}")

jar_paths = ["/root/.ivy2/jars/org.mongodb_bson-4.0.5.jar", "/root/.ivy2/jars/org.mongodb_bson-4.8.2.jar", "/root/.ivy2/jars/org.mongodb_bson-record-codec-4.8.2.jar", "/root/.ivy2/jars/org.mongodb_mongodb-driver-core-4.0.5.jar", "/root/.ivy2/jars/org.mongodb_mongodb-driver-core-4.8.2.jar", "/root/.ivy2/jars/org.mongodb_mongodb-driver-sync-4.0.5.jar", "/root/.ivy2/jars/org.mongodb_mongodb-driver-sync-4.8.2.jar", "/root/.ivy2/jars/org.mongodb.spark_mongo-spark-connector_2.12-3.0.1.jar", 
"/root/.ivy2/jars/org.mongodb.spark_mongo-spark-connector_2.12-10.2.2.jar"]

# Initialize Spark session
spark = SparkSession.builder \
    .appName("SpecificUserRecommendation") \
    .config("spark.jars", ",".join(jar_paths)) \
    .config("spark.mongodb.input.uri", "mongodb://127.0.0.1:27017/CSE356.interactions") \
    .config("spark.mongodb.output.uri", "mongodb://127.0.0.1:27017/CSE356.recommendations") \
    .config("spark.mongodb.write.database", "CSE356") \
    .config("spark.mongodb.write.collection", "recommendations") \
    .getOrCreate()
print("Spark session initialized.")

# Load data from MongoDB
interactions = spark.read \
    .format("mongodb") \
    .option("database", "CSE356") \
    .option("collection", "interactions") \
    .load()
print("Data loaded from MongoDB. Sample interactions data:")
interactions.show(5)

# Filter to only "liked" interactions (value = true)
likes = interactions.filter(col("value") == True).select("user_id", "video_id")
print("Filtered 'liked' interactions (value = true). Sample data:")
likes.show(5)

# Convert user and video IDs into an indexed column for ALS model
user_indexer = StringIndexer(inputCol="user_id", outputCol="user_idx").fit(likes)
video_indexer = StringIndexer(inputCol="video_id", outputCol="video_idx").fit(likes)

# Apply indexers
likes_indexed = user_indexer.transform(likes)
likes_indexed = video_indexer.transform(likes_indexed)
print("Indexed user and video IDs. Sample indexed data:")
likes_indexed.show(5)

# Prepare data for ALS model
als_data = likes_indexed.select(
    col("user_idx").cast("int").alias("user"),
    col("video_idx").cast("int").alias("item")
)
als_data = als_data.withColumn("rating", F.lit(1.0))
print("Prepared data for ALS model. Sample ALS input data:")
als_data.show(5)

# Initialize and train ALS model
print("Training ALS model...")
als = ALS(maxIter=10, regParam=0.01, userCol="user", itemCol="item", ratingCol="rating", coldStartStrategy="drop")
model = als.fit(als_data)
print("ALS model training complete.")

# Function to get recommendations for a specific user
def get_recommendations_for_user(user_id, num_recommendations=10):
    print(f"Generating recommendations for user_id: {user_id}")

    # Get the index of the specified user
    user_idx = user_indexer.transform(spark.createDataFrame([(user_id,)], ["user_id"])).select("user_idx").first()[0]
    print(f"User index for {user_id}: {user_idx}")

    # Generate recommendations for the user
    user_recs = model.recommendForUserSubset(
        spark.createDataFrame([(user_idx,)], ["user"]),
        num_recommendations
    ).select("recommendations").first()[0]
    print("Initial recommendations (indexed video IDs):", user_recs)

    # Get liked videos to filter out
    liked_videos = likes_indexed.filter(col("user_idx") == user_idx).select("video_idx").rdd.flatMap(lambda x: x).collect()
    print("Already liked video indices:", liked_videos)

    # Filter recommendations to exclude already-liked videos
    recommended_videos = [int(rec["item"]) for rec in user_recs if int(rec["item"]) not in liked_videos]
    print("Filtered recommendations (indexed video IDs):", recommended_videos)

   # Fill with random videos if there aren't enough recommendations
    if len(recommended_videos) < num_recommendations:
        all_video_ids = video_indexer.labels  # List of all video IDs
        liked_video_ids = [video_indexer.labels[int(v)] for v in liked_videos]
        random_videos = [v for v in all_video_ids if v not in liked_video_ids]
        
        # Convert sampled video IDs to indices
        additional_videos = [int(video_indexer.transform(spark.createDataFrame([(v,)], ["video_id"])).select("video_idx").first()[0])
                            for v in random.sample(random_videos, num_recommendations - len(recommended_videos))]
        
        recommended_videos += additional_videos
        print("Added random video indices to meet recommendation count:", additional_videos)


    # Map indices back to original video IDs
    recommended_video_ids = [video_indexer.labels[v] for v in recommended_videos[:num_recommendations]]
    print("Final recommended video IDs:", recommended_video_ids)

    # Return recommendations as a dictionary
    return {"user_id": user_id, "recommended_videos": recommended_video_ids}

# Get recommendations for the specified user ID
recommendations = get_recommendations_for_user(user_id, num_recommendations=10)
print("Generated recommendations for user_id:", recommendations)

# Convert the recommendation to a DataFrame and save to MongoDB
recommendation_df = spark.createDataFrame([recommendations])
recommendation_df.write \
    .format("mongodb") \
    .option("uri", "mongodb://localhost:27017/CSE356.recommendations") \
    .mode("append") \
    .save()
print("Recommendations saved to MongoDB successfully.")

# Stop the Spark session
spark.stop()
print("Spark session stopped.")
