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

// [
//     {
//         "duration": "2:02",
//         "thumbnail_url": "https://i.ytimg.com/vi/D2I2AuavP6w/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLDE9AsLSMbyKgMBJaoyoJar4bAsCQ",
//         "title": "5 Ways To Break Your Code",
//         "video_id": "D2I2AuavP6w"
//     },
//     {
//         "duration": "3:05",
//         "thumbnail_url": "https://i.ytimg.com/vi/ua_l51jugUM/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLCMZLxP0E1KqQjiFr49xc9gYKIXMg",
//         "title": "I Regret Making This...",
//         "video_id": "ua_l51jugUM"
//     },
//     {
//         "duration": "2:42",
//         "thumbnail_url": "https://i9.ytimg.com/vi/XCeIy5Ijc70/hqdefault_custom_2.jpg?sqp=CKjg-7QG-oaymwE2CNACELwBSFXyq4qpAygIARUAAIhCGAFwAcABBvABAfgB_gmAAtAFigIMCAAQARh_IBMoJzAP&rs=AOn4CLACY9wIKnfzxLIq3rBIGr7QYygdRQ",
//         "title": "This Game is HARD! Birfday Bash Playthrough",
//         "video_id": "XCeIy5Ijc70"
//     },
//     {
//         "duration": "2:37",
//         "thumbnail_url": "https://i9.ytimg.com/vi/9khznJ4JVSY/hqdefault_custom_1.jpg?sqp=CKjg-7QG-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLDI16MgCWPU2DWRlHzo4K8KOxb7Tw",
//         "title": "CHILL Exploration Game! Down To The Wire Playthrough",
//         "video_id": "9khznJ4JVSY"
//     },
//     {
//         "duration": "1:00",
//         "thumbnail_url": "https://i9.ytimg.com/vi/5c05G_F-yYs/hqdefault_custom_2.jpg?sqp=CKjg-7QG-oaymwE2CNACELwBSFXyq4qpAygIARUAAIhCGAFwAcABBvABAfgB_gmAAtAFigIMCAAQARh_ID4oEzAP&rs=AOn4CLCk7y8zsdngQklpPjSn0qdWMFUavw",
//         "title": "So Many SPIDERS! Flight of the Spider Gameplay",
//         "video_id": "5c05G_F-yYs"
//     },
//     {
//         "duration": "0:42",
//         "thumbnail_url": "https://i.ytimg.com/vi/LmjARtQGLgI/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLC7FjgMKPcptkMrCoL0R947Q8-x-w",
//         "title": "I Made a (fake) Pop-Up VIRUS...",
//         "video_id": "LmjARtQGLgI"
//     },
//     {
//         "duration": "2:31",
//         "thumbnail_url": "https://i.ytimg.com/vi/1cpwkeGeDcs/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLANOU722-aPd6fb2DH1rxwNQ4T12Q",
//         "title": "Ultrasonic Phased Array for Mid-Air Haptics - Capstone Presentation",
//         "video_id": "1cpwkeGeDcs"
//     },
//     {
//         "duration": "1:16",
//         "thumbnail_url": "https://i.ytimg.com/vi/hu2qzmydQBc/hqdefault.jpg?sqp=-oaymwE2CNACELwBSFXyq4qpAygIARUAAIhCGAFwAcABBvABAfgB_gmAAtAFigIMCAAQARgPIGUoRTAP&rs=AOn4CLC8u4Z-35CJuLSqnsfM3jY6v_luWA",
//         "title": "Wiki Adventure (Beta) - Out Now!",
//         "video_id": "hu2qzmydQBc"
//     },
//     {
//         "duration": "5:00",
//         "thumbnail_url": "https://i.ytimg.com/vi/kmC9GL1Bz0E/hqdefault.jpg?sqp=-oaymwE2CNACELwBSFXyq4qpAygIARUAAIhCGAFwAcABBvABAfgB_gmAAtAFigIMCAAQARhqIGooajAP&rs=AOn4CLBtZI-c-l552ZoRBRPQ__fdTG6NIA",
//         "title": "Snake Game Finite Automaton",
//         "video_id": "kmC9GL1Bz0E"
//     },
//     {
//         "duration": "9:09",
//         "thumbnail_url": "https://i.ytimg.com/vi/7YlrlwFKLqg/hqdefault.jpg?sqp=-oaymwE2CNACELwBSFXyq4qpAygIARUAAIhCGAFwAcABBvABAfgB_gmAAtAFigIMCAAQARhcIFwoXDAP&rs=AOn4CLCD7TfMvNKu8jFvL5IYchrATj_2jw",
//         "title": "Interactive Euclid's Elements Visualization",
//         "video_id": "7YlrlwFKLqg"
//     },
//     {
//         "duration": "0:35",
//         "thumbnail_url": "https://i.ytimg.com/vi/zMLS2GLCLH4/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLDsb3z6hL4yLcT48FeCXM1f-1GvNA",
//         "title": "How To Use Wordlest - Wordle Assisstance Tool",
//         "video_id": "zMLS2GLCLH4"
//     },
//     {
//         "duration": "3:44",
//         "thumbnail_url": "https://i.ytimg.com/vi/UKjWc4tRXJ4/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLCE_taCLgL97DlJ7rqrvvMp1vUNmQ",
//         "title": "Bad Apple!! But it's Lights in Apartment Windows Turning On and Off",
//         "video_id": "UKjWc4tRXJ4"
//     }
// ]

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