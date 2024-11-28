print("Starting user initialization script...");

db = db.getSiblingDB("CSE356"); // Switch to the target database

// Define the user data
const user = {
  username: "bob",
  email: "bob@gmail.com",
  password: "123",
  isVerified: true,
  verificationKey: "skibidi",
};

// Insert the user, ensuring no duplicates
db.users.updateOne(
  { username: user.username },
  { $setOnInsert: user },
  { upsert: true }
);

console.log("Added bob into CSE356");