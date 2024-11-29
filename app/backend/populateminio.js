const fs = require("fs");
const path = require("path");
const Minio = require("minio");

// Configure MinIO Client
const minioClient = new Minio.Client({
  endPoint: "10.0.1.163",  // Replace with your MinIO endpoint
  port: 9000,
  useSSL: false,
  accessKey: "admin",  // Replace with your MinIO access key
  secretKey: "password",  // Replace with your MinIO secret key
});

// MinIO bucket name
const BUCKET_NAME = "processed-media";

// Folder paths for your local files (on the host machine)
const LOCAL_MANIFESTS_DIR = "/root/milestone3/app/media/processed-media/manifests";  // Local path to manifests
const LOCAL_THUMBNAILS_DIR = "/root/milestone3/app/media/processed-media/thumbnails";  // Local path to thumbnails

// Function to upload files from the specified directory to MinIO
const uploadFiles = async (dirPath, bucketDir) => {
  // Get the list of all files in the directory
  const files = fs.readdirSync(dirPath);

  // Loop through all files and upload them to MinIO
  for (const file of files) {
    const filePath = path.join(dirPath, file);  // Full local file path
    const key = `${bucketDir}/${file}`;  // MinIO object key (path in the bucket)
    
    try {
      // Upload the file to MinIO using fPutObject
      await minioClient.fPutObject(BUCKET_NAME, key, filePath);
      console.log(`Successfully uploaded ${bucketDir}: ${file}`);
    } catch (err) {
      console.error(`Error uploading ${file}:`, err);
    }
  }
};

// Upload files from the manifests and thumbnails directories
const uploadManifests = async () => {
  await uploadFiles(LOCAL_MANIFESTS_DIR, "manifests");
};

const uploadThumbnails = async () => {
  await uploadFiles(LOCAL_THUMBNAILS_DIR, "thumbnails");
};

// Execute the upload process for both directories
const uploadAllFiles = async () => {
  try {
    await uploadManifests();
    await uploadThumbnails();
    console.log("All files uploaded successfully.");
  } catch (err) {
    console.error("Error uploading files:", err);
  }
};

// Start the upload process
uploadAllFiles();