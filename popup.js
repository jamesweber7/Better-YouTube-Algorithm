let data = {};

// ui elements
let youtube_link = document.getElementById('youtube-link');
let youtube_profile_photo = document.getElementById('youtube-profile-photo');
let disable_button = document.getElementById('disable-button');
let disable_button_description = document.getElementById('disable-button-description');

setup();
async function setup() {
    await setupData();
    setupUI();
    setupEventListeners();
}

function setupUI() {
    youtube_link.href = `https://www.youtube.com/@${data.creator_info.handle}`
    youtube_profile_photo.src = data.creator_info.profile_photo;
    if (data.disabled)
        disable_button.classList.add('disabled');
    updateDisabledUI();
}

function setupEventListeners() {
    youtube_link.addEventListener('click', openYoutube, true);
    disable_button.addEventListener('click', toggleDisabled);
}

function openYoutube(e) {
    e.preventDefault();
    window.open(youtube_link.href, '_blank');
}

function toggleDisabled() {
    data.disabled = !disable_button.classList.contains('disabled');
    updateData();
    updateDisabledUI();
}

function updateDisabledUI() {
    if (data.disabled) {
        disable_button.classList.add('disabled');
        disable_button_description.innerText = 'Extension Disabled :('
    } else {
        disable_button.classList.remove('disabled');
        disable_button_description.innerText = 'Disable Extension (YOU BETTER NOT)'
    }
}

async function setupData() {
    data = await getData();
}

async function updateData() {
    return await setData(data); 
}