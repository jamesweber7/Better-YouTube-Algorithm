let data = {};
let creator_info = {};

setup();

async function setup() {
    await setupData();
    if (data.disabled)
        return;
    listenForUrlChanges();
    handleUrlChange();
}

function handleUrlChange() {
    if (data.disabled)
        return;
    dispatchUrlChangeEvent();
    const url = getCurrentUrl();

    if (isOnWatchPage(url)) {
        onWatchPage(url);
    } else if (isOnHomePage(url)) {
        onHomePage();
    } else if (isOnChannelPage(url)) {
        onChannelPage();
    }
}

function isOnWatchPage(url=getCurrentUrl()) {
    if (url.indexOf("https://www.youtube.com/watch?v=") === 0)
        return true;
}

function isOnHomePage(url=getCurrentUrl()) {
    const start = "https://www.youtube.com";
    if (url.indexOf(start) !== 0)
        return false;
    url = url.substring(start.length);
    if (url.length && url[0] === '/')
        url = url.substring(1);
    if (!url)
        return true;
    if (url[0] === '?')
        return true;
    return false;
}

function isOnChannelPage(url=getCurrentUrl()) {
    return url.indexOf('https://www.youtube.com/@') === 0;
}

function isOnChannelVideosPage(url=getCurrentUrl()) {
    return isOnChannelPage() && url.includes('/videos');
}

function isOnCreatorChannelPage(url=getCurrentUrl()) {
    return channelPageHandle(url) === creator_info.handle;
}

function isOnCreatorChannelHomePage(url=getCurrentUrl()) {
    return isOnCreatorChannelPage(url) && !isOnChannelVideosPage();
}

function isOnCreatorChannelVideosPage(url=getCurrentUrl()) {
    return isOnCreatorChannelPage(url) && isOnChannelVideosPage();
}

function channelPageHandle(url=getCurrentUrl()) {
    const url_start = 'https://www.youtube.com/@';
    if (url.indexOf('https://www.youtube.com/@') !== 0)
        return;
    url = url.substring(url_start.length);

    const url_end = '/';
    if (url.includes(url_end))
        url = url.substring(0, url.indexOf(url_end));
    return url;
}

async function isOnCreatorVideoWatchPage(url=getCurrentUrl()) {
    if (!isOnWatchPage(url))
        return false;

    const poster_handle = await waitForPosterHandleFromWatchPage();
    if (!poster_handle) // error or took too long
        return;

    return poster_handle === creator_info.handle;
}

async function waitForPosterHandleFromWatchPage() {
    if (!isOnWatchPage(getCurrentUrl()))
        return;

    
    await waitForNode(() => {
        const node = document.querySelector('#upload-info ytd-channel-name yt-formatted-string a');
        return node && node.href;
    });
    // element with attribute containing video poster's handle
    const info_a = document.querySelector('#upload-info ytd-channel-name yt-formatted-string a');
    if (!info_a) 
        return;

    // string containing video poster's handle
    const handle_href = info_a.href;
    if (!handle_href)
        return;

    // get video poster's handle
    const delimeter = '@';
    const delimeter_index = handle_href.indexOf(delimeter);
    if (delimeter_index < 0)
        return;
    const poster_handle = handle_href.substring(delimeter_index+delimeter.length);

    return poster_handle;
}

async function setupData() {
    data = await getData();
    creator_info = data.creator_info;
}

async function updateData() {
    return await setData(data); 
}

// handle URL changes using MutationObserver
function listenForUrlChanges() {
    let last_url = getCurrentUrl();

    new MutationObserver(() => {
        const url = getCurrentUrl();
        if (url != last_url) {
            last_url = url;
            handleUrlChange();
        }
    }).observe(document, { subtree: true, childList: true });
}

function dispatchUrlChangeEvent() {
    document.dispatchEvent(new UrlChangeEvent());
}
  
function getCurrentUrl() {
    return location.href;
}

function watchUrl(video_id) {
    return `/watch?v=${video_id}`;
}

function userProfileUrl() {
    return `/@${creator_info.handle}`;
}

function thumbnailUrl(video_id) {
    return `https://i.ytimg.com/vi/${video_id}/hqdefault.jpg`
}

function removeUrlQuery(url) {
    if (url.includes('?'))
        url = url.substring(0, url.indexOf('?'));
    return url;
}

async function onWatchPage() {
    if (!await isOnCreatorVideoWatchPage())
        return;
    data.time_of_last_video_view = Date.now();
    updateData();
    const subscribe_btn = await waitForNode(node => {return node.id === 'subscribe-button';});
    workSubscribeButton(subscribe_btn);
}

async function workSubscribeButton(subscribe_btn) {
    if (isSubscribed())
        return hideSubscribeButton();
    // style subscribe button
    subscribe_btn.style.position = 'fixed';
    subscribe_btn.style.zIndex = 2**32-1;
    subscribe_btn.style.left = '100vw';
    subscribe_btn.style.top = '0';

    document.addEventListener('mousemove', moveSubscribeWithMouse);
    document.addEventListener('drag', moveSubscribeWithMouse);
    document.addEventListener('click', moveSubscribeWithMouse);
    document.addEventListener('click', checkForSubscribeChange, true);
    document.addEventListener('urlchange', stopWorkingSubscribeButton);

    function moveSubscribeWithMouse(e) {
        // stop other the event from performing other actions
        e.preventDefault();
        const subscribe_btn_rect = subscribe_btn.getBoundingClientRect();
        // move the block to the mouse position
        subscribe_btn.style.left = e.clientX - subscribe_btn_rect.width/2 + (Number.parseInt(subscribe_btn.style.left) - subscribe_btn_rect.left) + 'px';
        subscribe_btn.style.top = e.clientY - subscribe_btn_rect.height/2 + (Number.parseInt(subscribe_btn.style.top) - subscribe_btn_rect.top) + 'px';
    }

    function checkForSubscribeChange(e, num_tries=2) {
        if (isSubscribed()) {
            stopWorkingSubscribeButton();
            hideSubscribeButton();
        } else if (num_tries > 1) {
            // sometimes needs to move to back of event stack
            setTimeout(() => {checkForSubscribeChange(e, num_tries-1);}, 0);
        }
    }

    function stopWorkingSubscribeButton() {
        subscribe_btn.style.position = '';
        document.removeEventListener('mousemove', moveSubscribeWithMouse);
        document.removeEventListener('drag', moveSubscribeWithMouse);
        document.removeEventListener('click', moveSubscribeWithMouse);
        document.removeEventListener('click', checkForSubscribeChange);
        document.removeEventListener('urlchange', stopWorkingSubscribeButton);
    }

    function isSubscribed() {
        return subscribe_btn.innerText !== 'Subscribe'
    }

    function hideSubscribeButton() {
        subscribe_btn.style.display = 'none';
    }
}

async function onHomePage() {
    await updateRecommendedVideosToCreatorVideos();
}

async function updateRecommendedVideosToCreatorVideos() {
    if (!creator_info.videos.length)
        return;
    let valid = true;
    document.addEventListener('urlchange', abort);
    document.addEventListener('click', onclick, true);

    let unused_creator_videos = creator_info.videos.slice();
    let found_videos = [];
    let video_pairs = [];

    listenForAddedVideos();
    

    function videoAdded(video) {
        const odds_of_using_video = 0.25 + 0.75*daysSinceLastWatchedVideo();
        if (Math.random() < odds_of_using_video) {
            const idx = Math.floor(Math.random()*unused_creator_videos.length);
            // const video_data = unused_creator_videos[idx];
            const video_data = unused_creator_videos.splice(idx, 1)[0];
            video_pairs.push({
                video: video,
                video_data: video_data
            });
            // if all videos have been added, then repeat list of videos
            if (!unused_creator_videos.length) {
                unused_creator_videos = creator_info.videos.slice();
            }
        }
        updateVideoPairs();
    }

    function updateVideoPairs() {
        video_pairs.forEach(pair => {
            updateRecommendedItemToVideoData(pair.video, pair.video_data);
        })
    }

    async function listenForAddedVideos() {
        await waitForNode(node => {
            return !valid || (node && node.tagName && node.tagName.toLowerCase() === 'ytd-rich-item-renderer' && !node.hasAttribute('is-slim-media')  && !node.hasAttribute('is-shelf-item') && !node.querySelector('ytd-ad-slot-renderer') && !found_videos.includes(node));
        }, {
            no_timeout: true,
        }).then(node => {
            if (!valid)
                return;
            found_videos.push(node);
            videoAdded(node);
            listenForAddedVideos();
        })
    }

    function mouseOverVideoPair(mouseX, mouseY) {
        for (let i = 0; i < video_pairs.length; i++) {
            const video = video_pairs[i].video;
            const rect = video.getBoundingClientRect();
            if (mouseX >= rect.left && mouseX <= rect.right) {
                if (mouseY >= rect.top && mouseY <= rect.bottom) {
                    return video_pairs[i];
                }
            }
        }
    }

    function onclick(e) {
        const video_pair = mouseOverVideoPair(e.pageX, e.pageY);
        if (!video_pair)
            return;
        e.preventDefault();
        e.stopPropagation();

        const a = document.createElement('a');
        a.style.display = 'none';
        document.body.append(a);
        a.href = watchUrl(video_pair.video_data.video_id);

        setTimeout(() => {
            a.click();
            a.remove();
        }, 0)
    }

    function abort() {
        valid = false;
        document.removeEventListener('urlchange', abort);
        document.removeEventListener('click', onclick);
    }
}

async function getHomePageVideos() {
    return waitForNode(node => {
        return node && node.tagName && node.tagName.toLowerCase() === 'ytd-rich-item-renderer' && document.getElementsByTagName('ytd-rich-item-renderer').length >= 4
    });
}

function updateRecommendedItemToVideoData(video, video_data) {
    // // exit if already a video by creator video id
    // const video_id_el = video.querySelector('#video-title-link');
    // if (!video_id_el)
    //     return;
    // const video_id = getVideoIdFromHref(video_id_el.href);
    // if (isCreatorVideoId(video_id))
    //     return;

    // title
    const title_el = video.querySelector('#video-title');
    if (title_el && title_el.innerText)
        title_el.innerText = video_data.title;

    // update all links
    [...video.getElementsByTagName('a')].forEach(a => {
        if (!a.href)
            return;
        if (a.href.indexOf('/watch?v=') === 0) {
            a.href = watchUrl(video_data.video_id);
            return;
        }
        if (a.href.indexOf('/@') === 0) {
            a.href = userProfileUrl(creator_info.handle);
            return;
        }
    })

    // thumbnail
    const thumbnail_el = video.querySelector('yt-image img');
    if (thumbnail_el) {
        const thumbnail_url = thumbnailUrl(video_data.video_id);
        thumbnail_el.src = thumbnail_url;
        thumbnail_el.onload = () => {
        if (thumbnail_el.src != thumbnail_url)
            thumbnail_el.src = thumbnail_url;
        }
    }

    // profile photo
    const profile_photo_el = video.querySelector('#avatar-container #avatar-link #avatar img');
    if (profile_photo_el) {
        profile_photo_el.style.visibility = 'visible';
        profile_photo_el.src = creator_info.profile_photo;
        profile_photo_el.setAttribute('src', creator_info.profile_photo);
        profile_photo_el.onload = () => {
            if (profile_photo_el.src != creator_info.profile_photo)
                profile_photo_el.src = creator_info.profile_photo;
        }
    }

    // handle
    const channel_name_el = video.querySelector('#channel-name yt-formatted-string a');
    if (channel_name_el)
        channel_name_el.innerText = creator_info.display_name;

    // views


    // duration
    // I'm bored and I don't think duration really matters so I'm not going to update duration atm
}

function isCreatorVideoId(video_id) {
    for (const video of creator_info.videos) {
        if (video.video_id === video_id)
            return true;
    }
    return false;
}

async function onChannelPage() {
    if (isOnCreatorChannelHomePage())
        return onCreatorChannelHomePage();
    if (isOnCreatorChannelVideosPage())
        return onCreatorChannelVideosPage();
}

async function onCreatorChannelHomePage() {
    let subscribe_btn = document.getElementsByTagName('yt-subscribe-button-view-model')[0];
    if (!subscribe_btn)
        subscribe_btn = await (waitForNode(node => {return node && node.tagName && node.tagName.toLowerCase() === 'yt-subscribe-button-view-model'}));
    workSubscribeButton(subscribe_btn);
}

async function onCreatorChannelVideosPage() {
    // this has created a lot of bugs. It seems like they're all fixed but this has had a lot of side effects
    refreshCreatorVideos();
}

function configureDefaults(options, default_vals, overwrite_vals) {
    Object.keys(default_vals).forEach(key => {
        options[key] = overwriteDefault(options[key], default_vals[key], overwrite_vals);
    })
    return options;
}

function overwriteDefault(param_val, default_val, overwrite_vals=[]) {
    return [undefined, ...overwrite_vals].includes(param_val) ? default_val : param_val;
}

async function waitForNode(pass, options={}) {
    options = configureDefaults(options, {
        targetNode: document.body,
        config: { childList: true, subtree: true },
        timeout: 10e3,
        no_timeout: false,
        check_on_call: true,
        error_on_not_found: false,
        default_return: null,
    });

    // check on call
    if (options.check_on_call) {
        const node = checkAllNodes();
        if (node)
            return node;
    }

    return new Promise((resolve, reject) => {
        // use mutation observer
        const observer = new MutationObserver(mutationCallback);

        // Start observing the target node for configured mutations
        observer.observe(options.targetNode, options.config);
        setTimeout(() => {
            observer.disconnect();
            if (options.error_on_not_found) {
                reject();
            } else {
                pass(options.default_return);
            }
        }, options.timeout);

        // use timeouts
        let num_timeouts = 0;
        setTimeout(timedCallback, 0);

        function timedCallback() {
            num_timeouts ++;
            const node = checkAllNodes();
            if (node) {
                observer.disconnect();
                resolve(node);
            }
            let next_timeout;
            const proportional_timeouts = [0, 0, 0.0025, 0.0075, 0.01, 0.01, 0.02, 0.5, 0.1]; // percentage of timeout time
            const absolute_timeouts = [0, 0, 100, 500, 1000] // constant timeout times
            const timeouts_list = options.no_timeout ? absolute_timeouts : proportional_timeouts;
            const i = Math.min(num_timeouts, timeouts_list.length-1);
            next_timeout = timeouts_list[i];
            if (!options.no_timeout) {
                // use timeouts proportional to max timeout time
                next_timeout *= options.timeout;
            }
            
            setTimeout(timedCallback, next_timeout);
        }

        function mutationCallback (mutationsList, observer) {
            for(let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    // Check for added nodes
                    mutation.addedNodes.forEach(node => {
                        if (pass(node)) {
                            observer.disconnect();
                            resolve(node);
                        }
                    });
                }
            }
        };
    });

    function checkAllNodes() {
        const existingNodes = options.targetNode.querySelectorAll('*');
        for (const node of existingNodes)
            if (pass(node))
                return node;
    }
}

// this has created a lot of bugs. It seems like they're all fixed but this has had a lot of side effects
function refreshCreatorVideos(max_time=10e3) {
    let valid = true;
    document.addEventListener('urlchange', abort);
    updateVideos();

    // use timeouts
    let num_timeouts = 0;
    let starttime = Date.now();
    setTimeout(timedCallback, 0);

    function timedCallback() {
        if (!valid)
            return;
        updateVideos();

        num_timeouts ++;
        
        const timeouts = [0, 0, 0.0025, 0.0075, 0.01, 0.01, 0.02, 0.5, 0.1];
        const i = Math.min(num_timeouts, timeouts.length-1);
        const next_timeout = timeouts[i] * max_time;
        
        if (Date.now()-starttime < max_time)
            setTimeout(timedCallback, next_timeout);
    }

    function updateVideos() {
        const videos = [...document.getElementsByTagName('ytd-rich-item-renderer')];
        videos.forEach(video => {
            parseAndAddCreatorVideo(video);
        })
    }

    function abort() {
        valid = false;
        document.removeEventListener('urlchange', abort);
    }
}

function parseAndAddCreatorVideo(video) {
    // title
    const title_el = video.querySelector('#video-title');
    if (!title_el)
        return;
    const title = title_el.innerText;

    // video id
    const video_id_el = video.querySelector('#video-title-link');
    if (!video_id_el)
        return;
    const video_id = getVideoIdFromHref(video_id_el.href);

    // duration
    const duration_el = video.querySelector('#thumbnail ytd-thumbnail-overlay-time-status-renderer');
    const duration = duration_el ? duration_el.innerText.replace('\n', '') : '3:14'; // I don't really care if this doesn't get the right duration

    // reject videos not by creator
    // note: creator videos don't have anything referencing their handle, but videos by other users have their handles
    for (const a of [...video.getElementsByTagName('a')]) {
        if (a.href.includes('@') && a.href != `/@${data.creator_info.handle}`) {
            return;
        }
    }

    updateCreatorVideo({
        title: title,
        video_id: video_id,
        duration: duration,
    });
}

function updateCreatorVideo(video_data) {
    for (const i in creator_info.videos) {
        if (creator_info.videos[i].video_id === video_data.video_id) {
            creator_info.videos[i].title = video_data.title;
            if (video_data.duration !== '3:14')
                creator_info.videos[i].duration = video_data.duration;
            return updateData();
        }
    }
    // not existing video
    creator_info.videos.push(video_data);
    updateData();
}

function getVideoIdFromHref(video_href) {
    const start_delimeter = '?v=';
    const idx = video_href.indexOf(start_delimeter);
    if (idx < 0)
        return;
    video_href = video_href.substring(idx+start_delimeter.length);
    const end_delimeters = ['&', '?', '/'];
    end_delimeters.forEach(delimeter => {
        if (video_href.includes(delimeter))
            video_href = video_href.substring(0, video_href.indexOf(delimeter));
    })
    return video_href;
}

function daysSinceLastWatchedVideo() {
    const ms_since = Date.now() - data.time_of_last_video_view;
    const ms_per_day = 1000 * 60 * 60 * 24;
    const days_since = ms_since / ms_per_day;

    return days_since;
}