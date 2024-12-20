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

const m2json = {
  "3032568-uhd_3840_2160_25fps.mp4":
    "a colored liquid mixing slowly with clear water",
  "9210539-hd_1080_1920_30fps.mp4":
    "panning shot of a tram by the seaside in turkey",
  "2792931-hd_1620_1080_24fps.mp4": "features of the sky from dusk until dawn",
  "6846176-uhd_2160_3840_25fps.mp4": "a rabbit on the bed",
  "3045714-hd_1920_1080_25fps.mp4": "dogs playing",
  "855457-uhd_3840_2160_30fps.mp4": "video shot of river",
  "4883868-hd_1080_1920_30fps.mp4": "a woman holding a sign while sitting down",
  "7578640-uhd_4096_2160_25fps.mp4": "man looking at a screen with charts",
  "6568266-uhd_2160_4096_25fps.mp4": "video of a woman sitting on bed",
  "7789496-uhd_3840_2160_25fps.mp4": "elderly man playing with grandchildren",
  "5651776-uhd_3840_2160_25fps.mp4": "us currency in coins and bills",
  "854766-hd_1920_1080_30fps.mp4": "woman reading newspaper",
  "6955185-hd_1080_1920_25fps.mp4": "men playing on the cellphone",
  "11964889-uhd_3840_2160_25fps.mp4": "boats on sea",
  "2732784-uhd_3840_2160_25fps.mp4":
    "woman swimming in a pool lined with cabanas",
  "6893158-hd_1920_1080_25fps.mp4":
    "woman meditating while projected with psychedelic lights",
  "3181593-uhd_3840_2160_25fps.mp4":
    "a woman putting on mascara to enhanced and thickens her eyelashes",
  "8371249-uhd_2160_4096_25fps.mp4":
    "a woman filming a makeup tutorial on her phone",
  "3882875-hd_1920_1080_30fps.mp4": "a beautiful beach resort",
  "854243-hd_1280_720_30fps.mp4": "video of man swimming",
  "18137309-hd_1080_1920_50fps.mp4": "a woman reading a book in the sun",
  "6988803-hd_1080_1920_30fps.mp4": "young woman posing for the camera",
  "6000760-uhd_2160_3840_24fps.mp4": "a woman reading a book with her pet cat",
  "856621-hd_1920_1080_30fps.mp4": "time lapse video of preparing food",
  "5170429-uhd_4096_2160_24fps.mp4": "led sign board at night",
  "1494279-hd_1920_1080_24fps.mp4": "beautiful red roses",
  "6771710-uhd_3840_2160_25fps.mp4": "rain falling",
  "4434147-hd_1080_1920_20fps.mp4": "boomerang footage of ocean waves",
  "6707406-hd_1080_1920_25fps.mp4": "a woman drinking a healthy smoothie",
  "5377700-uhd_2160_3840_25fps.mp4":
    "hands typing on backlit keyboard close up",
  "8488698-hd_1920_1080_25fps.mp4": "women praying in a mosque",
  "4275787-uhd_4096_2160_25fps.mp4": "art flowers plant flower",
  "2941521-hd_1920_1080_24fps.mp4": "thick fogs on a mountain valley",
  "4786576-hd_1920_1080_25fps.mp4": "black coffee poured in drinking glass",
  "7033923-uhd_3840_2160_25fps.mp4": "close up video of donuts",
  "3206125-uhd_3840_2160_30fps.mp4": "giraffes and their environment",
  "6421452-uhd_2160_3840_30fps.mp4": "pouring wine in a glass",
  "2836275-uhd_3840_2160_24fps.mp4":
    "slow motion footage of a performing artist playing the guitar",
  "5430778-hd_1920_1080_25fps.mp4": "dried flowers and leaves on an open book",
  "4761811-uhd_4096_2160_25fps.mp4": "two men are boxing in a boxing ring",
  "6860993-uhd_2160_3840_25fps.mp4":
    "people holding hands together while praying",
  "8644057-uhd_2160_2688_30fps.mp4":
    "an animated video of a person and a dog on the beach",
  "4065635-uhd_4096_2160_25fps.mp4": "woman desk laptop office",
  "6853902-uhd_4096_2160_25fps.mp4": "a cat hopping on a chair",
  "6263491-uhd_3840_2160_25fps.mp4": "close up jewelry making",
  "3818528-uhd_3840_2160_30fps.mp4": "fixed shot of a rocky coast",
  "3248991-uhd_3840_2160_25fps.mp4":
    "person working and looking at pictures on a smartphone",
  "4510884-uhd_3840_2160_24fps.mp4": "nature mountain lake travel",
  "5027632-hd_1080_1920_30fps.mp4": "people talking and flirting in a bar",
  "3249808-uhd_3840_2160_25fps.mp4": "group of people sharing ideas at work",
  "4782132-uhd_3840_2160_30fps.mp4": "surfers on the sea of a beach in hawaii",
  "4907333-uhd_4096_2160_25fps.mp4":
    "two people in leather jackets standing next to each other",
  "3087320-uhd_3840_2160_30fps.mp4": "traffic in london street at night",
  "8746342-uhd_4096_2160_25fps.mp4":
    "a close up video of a person touching skin",
  "4786257-uhd_2160_4096_25fps.mp4": "a man playing a saxophone by the window",
  "4813238-hd_1920_1080_30fps.mp4": "a bitcoin taken by hand",
  "855868-hd_1920_1080_30fps.mp4": "flower blooming",
  "8015066-hd_1080_1920_25fps.mp4": "a slice of cake on a plate",
  "10780284-hd_3840_2160_30fps.mp4": "herd of deer in grass field",
  "5983040-uhd_3840_2160_24fps.mp4":
    "tilt view of a spinning vinyl on a turntable",
  "19144384-hd_1080_1920_30fps.mp4":
    "aerial view of a road with trees and a car",
  "7653827-uhd_2160_3840_25fps.mp4": "man wearing pink hat",
  "7076542-uhd_2160_3840_24fps.mp4":
    "high angle shot of tall buildings at new york",
  "4182664-hd_1920_1080_30fps.mp4": "nature tree flower cherry blossom",
  "6754986-hd_1920_1080_25fps.mp4": "long shot of cascade in the woods",
  "6827038-uhd_3840_2160_25fps.mp4": "golden analog watch",
  "7977614-hd_1080_1920_30fps.mp4": "person using a quill",
  "5998402-hd_1920_1080_30fps.mp4": "vitamins in capsule over the table",
  "7876926-uhd_2160_4096_25fps.mp4": "a man and a woman jogging together",
  "6274544-uhd_3840_2160_30fps.mp4": "drummer performing in a show",
  "9044219-uhd_2160_3840_30fps.mp4": "a man swimming in the pool",
  "5473757-uhd_3840_2160_24fps.mp4": "motor vehicles traveling on a highway",
  "4260499-uhd_3840_2160_25fps.mp4": "man doctor medical mask",
  "4121075-uhd_3840_2160_25fps.mp4": "woman on a video call at a restaurant",
  "5469584-uhd_2160_3840_30fps.mp4": "a woman wearing a bathing suit",
  "6618335-uhd_3840_2160_24fps.mp4":
    "a forklift truck transferring a cargo container",
  "3006968-hd_1920_1080_24fps.mp4":
    "two men talking with each other at the view deck of a roof top",
  "3769952-hd_1920_1080_25fps.mp4": "a front door opening to a living a room",
  "7956613-uhd_3840_2160_24fps.mp4": "man in yellow shirt",
  "3138762-hd_1920_1080_30fps.mp4": "people on a plateau overlooking the sea",
  "5554223-uhd_2160_4096_25fps.mp4":
    "woman in halloween costume adding red color to popcorn",
  "8531285-uhd_3840_2160_25fps.mp4":
    "ground level shot of a woman walking on grass barefooted",
  "6650578-uhd_2160_3840_30fps.mp4": "crop person holding heart shape",
  "3315083-uhd_3840_2160_30fps.mp4":
    "aerial footage of a toll booth in the highway",
  "3253799-uhd_3840_2160_25fps.mp4":
    "a group of people happily looking at an instant photograph taken by polaroid camera",
  "4800445-uhd_2160_3840_24fps.mp4": "two women hugging",
  "20712217-uhd_3840_2160_30fps.mp4":
    "sunflower in rural setting at sunset in summer",
  "3528765-hd_1280_720_30fps.mp4":
    "a person wearing white sneakers showing his dancing skill",
  "7709370-hd_1920_1080_25fps.mp4":
    "a woman drinking coffee and using a laptop",
  "5968244-uhd_3840_2160_30fps.mp4": "two women playing fence on a studio",
  "4793288-hd_1920_1080_30fps.mp4": "sea waves crashing on beach shore",
  "3045048-uhd_3840_2160_24fps.mp4":
    "two women on standing on a building inside ledge with a laptop",
  "8348322-uhd_3840_2160_25fps.mp4": "man presenting in a meeting",
  "5548029-uhd_3840_2160_25fps.mp4": "a fish hiding under the rocks",
  "6568193-uhd_4096_2160_25fps.mp4": "a woman spinning in front of a mirror",
  "4098644-uhd_2160_4096_25fps.mp4": "a woman sitting on a couch with a laptop",
  "5286268-hd_1920_1080_30fps.mp4":
    "protesters gathering in black lives matter rally",
  "6011533-uhd_3840_2160_25fps.mp4": "cancer patients in the hospital",
  "5034341-hd_1280_720_25fps.mp4": "person riding an aircraft",
  "6963822-uhd_4096_2160_25fps.mp4":
    "close up video of a woman using a cellphone",
  "5738747-hd_1920_1080_30fps.mp4": "machine lifting packages",
  "5977186-uhd_3840_2160_25fps.mp4":
    "two persons driving and drifting a quad bike in the desert",
  "3754909-uhd_4096_2160_25fps.mp4":
    "plastic filled environment can cause suffocation",
  "3051356-uhd_3840_2160_25fps.mp4":
    "slow motion footage of the movement of yellow fluid mixed in water creating abstract",
  "8243194-uhd_2160_3840_24fps.mp4": "person walking on the lake bridge",
  "8045156-hd_1920_1080_25fps.mp4": "a woman swimming in a pool",
  "5981930-hd_1920_1080_24fps.mp4":
    "green text based tiles on black background",
  "4804789-uhd_3840_2160_25fps.mp4": "man doing leg exercise",
  "5457918-hd_1080_1920_30fps.mp4": "sunset view from the beach shore",
  "3838403-uhd_4096_2160_25fps.mp4":
    "stamping letters on a paper to convey a message",
  "7592163-uhd_2160_3744_30fps.mp4": "woman petting a foal",
  "4716299-hd_1920_1080_24fps.mp4": "video of man ready to sleep",
  "4812508-uhd_3840_2160_25fps.mp4": "man stretching his body",
  "3997027-uhd_2160_4096_25fps.mp4": "hands woman girl model",
  "12751030-uhd_2732_874_60fps.mp4": "cg footage of stars in outer space",
  "5383826-hd_1920_1080_30fps.mp4": "shallow focus of beautiful blue flowers",
  "7182225-uhd_2160_3840_25fps.mp4":
    "a couple of people walking up some stairs",
  "8458636-uhd_2160_4096_25fps.mp4": "helpless woman trapped with spider s web",
  "7131686-uhd_2160_4096_30fps.mp4": "coffee in bed",
  "8480001-uhd_2160_3840_25fps.mp4":
    "a mother teaching daughter how to use a knife",
  "1841455-hd_1280_720_25fps.mp4": "close up shot of pine tree branch",
  "12433211-uhd_2160_3840_30fps.mp4":
    "a young woman recording a video while showing a pink blouse",
  "4588239-uhd_3840_2160_25fps.mp4": "a woman crying",
  "5873416-uhd_3840_2160_24fps.mp4": "stop sign",
  "856077-hd_1920_1080_24fps.mp4": "time lapse video of starry sky",
  "6785253-uhd_3840_2160_25fps.mp4": "woman stretching her body",
  "3865331-uhd_3840_2160_25fps.mp4": "a person playing the piano",
  "12909007-uhd_2160_3840_24fps.mp4":
    "sad depressed woman sitting on the floor in an office",
  "7712301-hd_1920_1080_30fps.mp4":
    "man and woman taking picture on graduation day",
  "3960159-uhd_2160_4096_25fps.mp4": "safe health lifestyle mask",
  "3894712-uhd_2160_4096_25fps.mp4": "fashion model posing black background",
  "7809638-uhd_2160_3840_30fps.mp4": "reading a book in spanish",
  "9315513-uhd_3840_2160_30fps.mp4": "drone footage of a rapeseed field",
  "1093656-uhd_3840_2160_30fps.mp4": "view of the sea at dawn",
  "7764684-uhd_4096_2160_25fps.mp4": "mockup of denim jeans",
  "5384672-uhd_4096_2160_30fps.mp4": "young people meeting in the park",
  "7901124-hd_1920_1080_30fps.mp4": "drone footage of a fireworks",
  "2530259-uhd_3840_2160_24fps.mp4":
    "aerial footage of a train going through luscious vegetation",
  "6014102-uhd_2160_4096_24fps.mp4": "passing marble with hands",
  "3188149-uhd_3840_2160_24fps.mp4": "a lake with calm waters on a foggy day",
  "4761333-uhd_3840_2160_25fps.mp4":
    "a gay couple face of happiness being together",
  "4811932-hd_1920_1080_30fps.mp4":
    "woman walking on red poppy flower field while carrying her baby",
  "14034808-hd_1080_1920_24fps.mp4": "snowstorm video",
  "9808505-uhd_4096_2160_25fps.mp4": "group of friends having a conversation",
  "4459299-hd_1080_1920_30fps.mp4": "swimming at the beach on sunset",
  "5743001-uhd_2160_4096_25fps.mp4":
    "woman wearing leotard dancing contemporary",
  "5370904-uhd_3840_2160_24fps.mp4": "bright moon among moving clouds",
  "8059692-hd_1920_1080_25fps.mp4": "man doing kung fu in a futuristic room",
  "3156882-uhd_3840_2160_30fps.mp4": "drone footage of a church and its paza",
  "5319432-uhd_3840_2160_25fps.mp4": "a man working out inside the gym",
  "18306131-hd_1080_1920_30fps.mp4": "autumn rain",
  "4395423-hd_1280_720_30fps.mp4": "an airplane airborne on a raining day",
  "7148101-uhd_3840_2160_30fps.mp4": "people roasting marshmallows",
  "7366409-uhd_3840_2160_25fps.mp4": "flowing water in a creek",
  "6890309-hd_1920_1080_30fps.mp4": "coconut sprinkles on red dessert",
  "6611953-uhd_3840_2160_25fps.mp4": "person holding a smartphone",
  "11059706-hd_1080_1920_30fps.mp4":
    "high angle view of one world trade center",
  "5208612-uhd_3840_2160_30fps.mp4": "drone footage of a river valley",
  "4194963-hd_1920_1080_24fps.mp4": "pattern abstract slow motion colours",
  "4903185-uhd_3840_2160_25fps.mp4": "a woman holding a flashlight in the dark",
  "5354649-uhd_3840_2160_30fps.mp4": "a time lapse of a moonset",
  "6892469-hd_1920_1080_25fps.mp4": "woman with dark eye makeup",
  "7467745-hd_1080_1920_30fps.mp4": "video of us navy soldier holding bible",
  "7274842-uhd_2160_4096_25fps.mp4": "a woman who looks sad sitting on a chair",
  "5640867-hd_1080_1920_30fps.mp4": "two white chickens walking on pavement",
  "5752737-uhd_3840_2160_30fps.mp4": "two persons doing an experiment",
  "2239153-hd_1920_1080_24fps.mp4": "mangoes on a tree",
  "7316609-uhd_3840_2160_25fps.mp4": "a memorial wall for heroes",
  "4503703-hd_1920_1080_24fps.mp4": "beautiful green landscape",
  "3048167-uhd_3840_2160_24fps.mp4":
    "woman on the driver s seat of a car smiling while texting",
  "8499646-uhd_3840_2160_24fps.mp4":
    "a woman and a dog wearing raincoat and rubber boots",
  "3006882-hd_1920_1080_24fps.mp4":
    "people and motor vehicles movement in a street",
  "8163725-uhd_2562_1440_30fps.mp4": "view of fish swimming underwater",
  "7293331-hd_1920_1080_30fps.mp4": "group of friends drinking beers",
  "4631140-uhd_4096_2160_25fps.mp4":
    "a hand reaching out to the camera in a white background",
  "4830189-hd_1920_1080_25fps.mp4": "footage of a wheat field",
  "3115237-hd_1920_1080_24fps.mp4":
    "a woman walking on a facade of concrete pillars and arches",
  "3704775-uhd_2160_4096_25fps.mp4":
    "a man cooking pancakes and is satisfied with the taste",
  "6014078-uhd_2160_4096_24fps.mp4": "three women in white dresses",
  "2006729-uhd_3840_2160_25fps.mp4":
    "close up view of liquid material inside a lava lamp",
  "7914783-hd_1920_1080_30fps.mp4": "men in a computer gaming competition",
  "7101969-uhd_1440_2190_25fps.mp4": "illustration of mixing colors",
  "10678756-uhd_4096_2160_25fps.mp4": "man standing among rushes",
  "3173208-uhd_3840_2160_30fps.mp4": "drone footage of boldt castle",
  "5385959-uhd_2160_4096_25fps.mp4": "a monk meditating near a waterfall",
  "4541555-uhd_3840_2160_25fps.mp4": "washing hands with water",
  "7646373-uhd_3840_2160_25fps.mp4": "family listening to realtor",
  "4298771-uhd_3840_2160_25fps.mp4": "men dinner drink glass",
  "10667778-uhd_2160_4096_25fps.mp4":
    "a gypsy couple holding hands while walking in a field",
  "5528384-uhd_2160_3840_24fps.mp4":
    "a teenage girl picking wild flower from the grass",
  "8717402-uhd_2160_4096_25fps.mp4": "a woman holding a hand gun",
  "7998251-hd_1080_1920_24fps.mp4": "a woman using a tailors chalk on fabric",
  "5545407-uhd_3840_2160_30fps.mp4":
    "time lapse video of cityscape during nighttime",
  "7006049-uhd_3840_2160_24fps.mp4": "a man holding a best actor trophy",
  "7876919-uhd_2160_4096_25fps.mp4": "person tying shoes",
  "7957923-uhd_3840_2160_24fps.mp4": "close up view of a man concentrating",
  "8458699-uhd_4096_2160_25fps.mp4":
    "woman feeling worried while sitting inside a cabinet",
  "7351364-uhd_4096_2160_25fps.mp4":
    "person using smartphone browsing on an app",
  "6591666-uhd_4096_2160_25fps.mp4": "adult reading book to child in bed",
  "3576377-uhd_3840_2160_25fps.mp4":
    "a romantic couple by the seashore with view of sunset",
  "6161378-uhd_3840_2160_30fps.mp4": "aerial view of a city",
  "6739288-hd_1920_1080_24fps.mp4": "aerial view of mountains",
  "3922709-hd_1920_1080_25fps.mp4": "pattern abstract slow motion vintage",
  "6252812-uhd_2560_1440_30fps.mp4": "aerial footage of fields",
  "5822552-hd_1920_1080_25fps.mp4": "women going down a stairs",
  "4812220-uhd_3840_2160_25fps.mp4": "shirtless man punching",
  "5260814-uhd_3840_2160_30fps.mp4":
    "view of travelers on motor bikes at the road",
  "6602217-hd_1080_1920_30fps.mp4": "a barista using a coffee machine",
  "4114175-hd_1920_1080_25fps.mp4": "hotdog",
  "5263819-uhd_4096_2160_30fps.mp4":
    "young playful girls fighting with pillows",
  "5842487-hd_1920_1080_25fps.mp4":
    "group of young people sitting at dinner table",
  "7001509-uhd_2160_4096_25fps.mp4": "a woman reading a book while sitting",
  "9498049-uhd_2160_4096_25fps.mp4": "couple having sweet moments",
  "2355566-uhd_3840_2160_24fps.mp4": "aerial footage of a cliff",
  "6444538-uhd_3840_2160_24fps.mp4": "golden sunrise above wetlands",
  "5974765-uhd_2160_4096_30fps.mp4":
    "two women and kid having fun dancing while looking at the smartphone",
  "7324772-uhd_2880_2160_25fps.mp4": "four women photo shooting in studio",
  "4698265-uhd_3840_2160_25fps.mp4": "romantic gay couple",
  "6780090-uhd_3840_2160_30fps.mp4": "women using laptop",
  "7999596-uhd_3840_2160_25fps.mp4": "an instructor helping students in class",
  "4107090-uhd_3840_2160_25fps.mp4":
    "woman sitting on a sofa reading a magazine",
  "5889739-uhd_2160_3840_25fps.mp4": "a man promoting a price sale offering",
  "1375991-hd_1920_1080_30fps.mp4": "view of the sun through a tree",
  "4701069-uhd_3840_2160_25fps.mp4": "couple kissing",
  "7258427-uhd_2160_3840_25fps.mp4": "close up view of slices of cantaloupe",
  "5923959-hd_1080_1920_30fps.mp4":
    "an elderly woman making a business presentation",
  "3806680-uhd_2160_3840_30fps.mp4":
    "two women enjoying and relaxing in a jacuzzi",
  "8152698-uhd_3840_2160_25fps.mp4": "a big brown bear lying on rocks",
  "855027-hd_1920_1080_30fps.mp4": "time lapse video of clouds",
  "5498902-hd_1920_1080_30fps.mp4": "time lapse video of sunset",
  "3323126-uhd_3840_2160_30fps.mp4":
    "a seafood store of international brand across the street",
  "6550210-hd_1920_1080_25fps.mp4": "picking a card",
  "4919852-uhd_2160_4096_25fps.mp4":
    "a woman in a dress sitting on a wooden bench",
  "3309011-hd_1920_1080_30fps.mp4":
    "interior designs of a building with marble coating and grand chandeliers",
  "4146355-uhd_3840_2160_25fps.mp4":
    "woman drinking her coffee while using her smartphone",
  "18069232-uhd_3840_2160_24fps.mp4":
    "an artist s animation of artificial intelligence ai this video represents how ai powered tools can support us and save time it was created by martina stiftinger as part of the visualis",
  "9489372-uhd_2160_4096_25fps.mp4":
    "woman sitting in a studio and posing at the camera",
  "5181949-uhd_3840_2160_30fps.mp4": "couple getting married",
  "9357246-uhd_3840_2160_30fps.mp4": "people at times square",
  "7671667-uhd_2160_3840_24fps.mp4": "video of a farm with animals",
  "13441309-uhd_2160_3840_24fps.mp4": "city man couple love",
  "15153890-uhd_2160_3840_60fps.mp4": "cat walking on a pile of snow",
  "8061668-uhd_2160_3840_25fps.mp4": "business woman writing in her agenda",
  "9323319-uhd_2160_3840_24fps.mp4":
    "a person holding a blue bag with a handle",
  "6628454-uhd_4096_2160_25fps.mp4":
    "a video of a masseuse giving a back massage",
  "4922993-uhd_3840_2160_24fps.mp4": "calm lake surrounded by mountains",
  "4647612-uhd_3840_2160_25fps.mp4":
    "a couple sweet moments while staying at home",
  "4727642-uhd_2160_3840_25fps.mp4":
    "a person standing in front of an apartment building",
  "7344544-uhd_2160_3840_25fps.mp4": "wood art sign pen",
  "6952660-uhd_2160_3840_30fps.mp4":
    "kids jumping while mother doing meditation yoga",
  "4761432-uhd_2160_4096_25fps.mp4": "a man using a jump rope to warm up",
  "6864596-uhd_2160_4096_25fps.mp4": "playing catch the bait with a cat",
  "8088301-uhd_4096_2160_24fps.mp4":
    "an elderly woman touching a sick man s forehead",
  "3222806-uhd_3840_2160_30fps.mp4": "rainy evening in the streets of london",
  "9466306-hd_1920_1080_25fps.mp4":
    "revolutionary soldiers riding a horse at the field",
  "8537341-uhd_3840_2160_25fps.mp4": "waves crashing on a rocky shore",
  "4027479-hd_1920_1080_25fps.mp4": "swirling paint in slow motion",
  "6584707-uhd_3840_2160_25fps.mp4": "indian flag waving",
  "5763324-hd_1920_1080_24fps.mp4": "close up video of people kissing",
  "2360935-uhd_4096_2160_24fps.mp4":
    "aerial footage of green hills and mountains with luscious vegetation",
  "5287074-hd_1920_1080_30fps.mp4": "protesters holding banners at the street",
  "15004793-hd_1920_1080_24fps.mp4": "rocky seacoast in slow motion",
  "11643256-hd_1080_1920_24fps.mp4":
    "bags of potato chips stocked in a grocery store",
  "8307110-hd_1920_1080_25fps.mp4":
    "woman in the beach combing her friend s hair",
  "7068566-uhd_2160_3840_24fps.mp4": "drone footage of a city",
  "4911821-uhd_3840_2160_24fps.mp4": "a woman recording a video",
  "4752897-uhd_2160_4096_25fps.mp4": "a man in a boxing ring with another man",
  "6502882-hd_1080_1920_25fps.mp4": "woman writing on whiteboard",
  "5171541-uhd_2160_3840_30fps.mp4":
    "close up view of a snail slowly crawling on the ground",
  "7977568-hd_1920_1080_30fps.mp4": "chess pieces on a checkerboard",
  "855379-hd_1920_1080_30fps.mp4": "people skating",
  "6547788-uhd_2160_3840_24fps.mp4": "woman eating a donut",
  "11096891-hd_3840_2160_30fps.mp4": "drone footage of a mountain by the sea",
  "13953530-hd_1920_1080_50fps.mp4": "haridwar ganga aarti",
  "7490405-hd_1920_1080_30fps.mp4": "business people having a break",
  "8724210-uhd_2160_4096_25fps.mp4": "close up video of a woman screaming",
  "8184024-hd_1920_1080_30fps.mp4": "a woman touching her shoulder",
  "3010445-hd_1920_1080_24fps.mp4":
    "a natural landscape of mountains and hills",
  "7067842-hd_1920_1080_30fps.mp4": "an icelandic horse",
  "4286675-hd_1920_1080_25fps.mp4": "wedding decorations",
  "5137844-uhd_4096_2160_25fps.mp4":
    "person opening a book then putting it in the book shelf",
  "8717594-uhd_2160_4096_25fps.mp4":
    "a man and woman in back to back wearing shades",
  "3296887-uhd_4096_2160_25fps.mp4":
    "topping fresh herbs on a bowl of soup dish",
  "5199734-uhd_3840_2160_25fps.mp4":
    "woman in plaid shirt sitting by the window while reading a bible",
  "16029657-hd_1080_1920_30fps.mp4": "colorful geometric pattern in motion",
  "9413800-hd_1080_1920_25fps.mp4": "a person flicking plastic toy soldiers",
  "5275272-uhd_4096_2160_25fps.mp4": "a person dribbling a basketball",
  "7088464-uhd_3840_2160_25fps.mp4":
    "a sonographer handling a patient mri test",
  "4927835-uhd_4096_2160_25fps.mp4":
    "a group of people sitting on a boat eating ice cream",
  "7353121-uhd_3840_2160_24fps.mp4": "men riding a horse while talking",
  "6676464-hd_1920_1080_30fps.mp4": "female hand picking valentine s coupon",
  "6021315-uhd_3840_2160_25fps.mp4":
    "santa claus having fun dancing to the music",
  "9088978-hd_1080_1920_30fps.mp4":
    "a woman with stickers on her face doing thumbs up",
  "2084066-hd_1920_1080_24fps.mp4":
    "man walking along the sidewalk carrying a camera",
  "6559706-uhd_4096_2160_25fps.mp4": "a man lying down",
  "4838263-uhd_2160_3840_24fps.mp4": "cute dog with antlers headband",
  "854429-hd_1920_1080_24fps.mp4": "people dancing",
  "3588888-hd_1920_1080_18fps.mp4":
    "old video of a person driving a sports car around the city",
  "7442203-hd_1920_1080_25fps.mp4": "drone footage of frozen water body",
  "3253079-uhd_3840_2160_25fps.mp4":
    "a group of people brainstorming in a meeting room and happily agreeing with a handshake on a plan",
};

// Parse the JSON data
const videos = m2json;

async function insertVideos() {
  // Create an array of promises for each insertOne call
  const insertPromises = Object.keys(videos).map(async (key) => {
    const video = {
      user_id: "bob", // Static user_id
      video_id: key.replace(".mp4", ""), // Remove .mp4 suffix
      title: key.replace(".mp4", ""), // Same as video_id
      author: "bob", // Static author
      description: videos[key], // Description is the value in the JSON
      status: "complete", // Set status as 'complete'
    };

    // Return the promise from insertOne to be handled by Promise.all()
    return db.uploadedvideos.insertOne(video);
  });

  try {
    // Use Promise.all to wait for all insertions to complete
    await Promise.all(insertPromises);
    console.log("All videos inserted");
  } catch (err) {
    console.error("Error inserting videos:", err);
  }
}

// Call the async function to start the process
insertVideos();
