// default data
const storage_keys = {
    head: 'yt_algorithm_data'
};

var default_data =  {
    disabled: false,
    time_of_last_video_view: Date.now(),
    creator_info: {
        handle: 'jamesweber_dev',
        display_name: 'James Weber',
        profile_photo: 'https://yt3.ggpht.com/AnK5_SP8seOPeENco1-lnchjwqPl_DhqtnQDStJkuCUH4L_Hd3Ld-eVxnJYSqhKv8TP6fh2M=s88-c-k-c0x00ffffff-no-rj',
        videos: [
            {
                "title": "5 Ways To Break Your Code",
                "video_id": "D2I2AuavP6w",
                "duration": "2:02",
            },
            {
                "title": "I Regret Making This...",
                "video_id": "ua_l51jugUM",
                "duration": "3:05",
            },
            {
                "title": "This Game is HARD! Birfday Bash Playthrough",
                "video_id": "XCeIy5Ijc70",
                "duration": "2:42",
            },
            {
                "title": "CHILL Exploration Game! Down To The Wire Playthrough",
                "video_id": "9khznJ4JVSY",
                "duration": "2:37",
            },
            {
                "title": "So Many SPIDERS! Flight of the Spider Gameplay",
                "video_id": "5c05G_F-yYs",
                "duration": "1:00",
            },
            {
                "title": "I Made a (fake) Pop-Up VIRUS...",
                "video_id": "LmjARtQGLgI",
                "duration": "0:42",
            },
            {
                "title": "Ultrasonic Phased Array for Mid-Air Haptics - Capstone Presentation",
                "video_id": "1cpwkeGeDcs",
                "duration": "2:31",
            },
            {
                "title": "Wiki Adventure (Beta) - Out Now!",
                "video_id": "hu2qzmydQBc",
                "duration": "1:16",
            },
            {
                "title": "Snake Game Finite Automaton",
                "video_id": "kmC9GL1Bz0E",
                "duration": "5:00",
            },
            {
                "title": "Interactive Euclid's Elements Visualization",
                "video_id": "7YlrlwFKLqg",
                "duration": "9:09",
            },
            {
                "title": "How To Use Wordlest - Wordle Assisstance Tool",
                "video_id": "zMLS2GLCLH4",
                "duration": "0:35",
            },
            {
                "title": "Bad Apple!! But it's Lights in Apartment Windows Turning On and Off",
                "video_id": "UKjWc4tRXJ4",
                "duration": "3:44",
            }
        ]
    }
}

function isDataInitialized(data) {
    return !!Object.keys(data).length;
}

async function initializeDefaultData() {
    await setData(default_data);
    return default_data;
}

async function getData() {
    let data = await chrome.storage.local.get([storage_keys.head]);
    if (isDataInitialized(data))
        return data[storage_keys.head];
    return await initializeDefaultData();
}

async function setData(data) {
    let root = {};
    root[storage_keys.head] = data;
    return await chrome.storage.local.set(root);
}

async function clearData() {
    return await chrome.storage.local.clear();
}