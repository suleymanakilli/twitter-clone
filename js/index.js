const URL = "http://localhost:3000/tweets";
const nextPageData = {
    loading: false,
    url: null
}
window.onscroll = function(ev) {
    if ((window.innerHeight + window.scrollY) == document.body.offsetHeight) {
        onNextPage()
    }
};
 const onNextPage = () => {
    if(nextPageData.url){
        getTwitterData(true);
    }
    else{
        console.log("no data")
    }
 }

 const onEnter = (e) => {
    if(e.key == "Enter") {
        getTwitterData();
    }
}
 
const getTwitterData = (nextPage=false) => {
    var input=document.getElementById("search-input")
    var query=input.value
    if(!query) return
    const encodedQuery=encodeURIComponent(query)
    const params = `q=${encodedQuery}&result_type=mixed`;
    let fullUrl = `${URL}?${params}`;
    if(nextPage){
        fullUrl = nextPageData.url;
        nextPageData.loading = true;
    }
    console.log(fullUrl)
          
    fetch(fullUrl,{
        method:'GET'
    }).then((response)=>{
        return response.json()
    }).then((data)=>{
        saveNextPage(data.search_metadata)
        buildTweets(data.statuses,nextPage)
    })
}
      
const saveNextPage = (metadata) => {
    nextPageData.url = `${URL}${metadata.next_results}`
    nextPageData.loading = false;
}


const buildTweets = (tweets, nextPage) => {
    let tweetContent=""
    tweets.map((tweet)=>{
        const postedDate=moment(tweet.created_at).fromNow()
        tweetContent+=`<div class="post">
        <div class="image">
        <img src="${tweet.user.profile_image_url}" alt="" width="50" height="50">
    </div>
    <div class="post-content">
        <div class="user-info">
            <div class="hoverr">
                <div class="name">
                    <span class="name">${tweet.user.name}</span>
                    <span class="nick">@${tweet.user.screen_name}</span>
                </div>
                <span class="post-date"><li>${postedDate}</li></span>
            </div>
            <div class="card">
                <div class="container">
                    <div class="user-info">
                        <div class="image">
                            <img src="${tweet.user.profile_image_url}" alt="" width="50" height="50">
                        </div>
                        <div class="name">
                            <span>${tweet.user.name}</span>
                        </div> 
                        <div class="nick">
                            <span>@${tweet.user.screen_name}</span>
                        </div> 
                        <div class="about">
                            ${tweet.user.description}
                        </div>
                        <div class="followers">
                            <div class="following-info">
                                <span class="number">${tweet.user.followers_count}</span>
                                <span class="text">Following</span>
                            </div>
                            <div class="followers-info">
                                <span class="number">${tweet.user.friends_count}</span>
                                <span class="text">Follower</span>
                            </div>
                        </div>
                        
                    </div>
                    <div class="follow-button">
                        <button>Follow</button>
                    </div>
                </div>
                
            </div>
            
            <div class="post-settings">
                <div class="more-icon">
                    <svg width="14" height="4" viewBox="0 0 14 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M2.5 0.25C1.535 0.25 0.75 1.037 0.75 2C0.75 2.963 1.535 3.75 2.5 3.75C3.464 3.75 4.25 2.964 4.25 2C4.25 1.036 3.463 0.25 2.5 0.25ZM7 0.25C6.034 0.25 5.25 1.037 5.25 2C5.25 2.963 6.035 3.75 7 3.75C7.965 3.75 8.75 2.964 8.75 2C8.75 1.036 7.966 0.25 7 0.25ZM9.75 2C9.75 1.037 10.535 0.25 11.5 0.25C12.464 0.25 13.25 1.036 13.25 2C13.25 2.964 12.464 3.75 11.5 3.75C10.534 3.75 9.75 2.963 9.75 2ZM10.75 2C10.75 2.414 11.086 2.75 11.5 2.75C11.914 2.75 12.25 2.413 12.25 2C12.25 1.586 11.913 1.25 11.5 1.25C11.087 1.25 10.75 1.587 10.75 2ZM6.25 2C6.25 2.414 6.586 2.75 7 2.75C7.414 2.75 7.75 2.413 7.75 2C7.75 1.586 7.413 1.25 7 1.25C6.587 1.25 6.25 1.587 6.25 2ZM1.75 2C1.75 2.414 2.086 2.75 2.5 2.75C2.914 2.75 3.25 2.413 3.25 2C3.25 1.586 2.913 1.25 2.5 1.25C2.087 1.25 1.75 1.587 1.75 2Z" fill="#14171A"/>
                        </svg>
                </div>
            </div>
        </div>
        <div class="explanation">
            <span>${tweet.full_text}</span>
        </div>
        `
        if(tweet.extended_entities 
            && tweet.extended_entities.media
            && tweet.extended_entities.media.length > 0){
            tweetContent += buildImages(tweet.extended_entities.media);
            tweetContent += buildVideo(tweet.extended_entities.media);
        }
        tweetContent+=` <div class="utilites">
            <div class="comment-icon icon">
                <div class="svg">
                    <svg width="14" height="14"  viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M5.53053 0L8.47089 0.00708861V0.00637975C11.5686 0.00708861 13.9957 2.43139 14 5.52699V5.53904C13.9979 7.19919 13.1912 8.8721 11.8429 10.0134C10.6981 10.9817 6.29681 13.7973 6.10967 13.9164C6.02106 13.9731 5.92253 14 5.82471 14C5.64891 14 5.47737 13.9135 5.37671 13.754C5.32284 13.6711 5.29165 13.5449 5.29165 13.4684V10.7548C2.25843 10.6386 0 8.43544 0 5.53053C0 2.42927 2.42856 0 5.52911 0H5.53053ZM6.35494 12.4937C7.70886 11.6161 10.3515 9.88294 11.1553 9.20243H11.1561C12.2704 8.25823 12.936 6.88729 12.9381 5.53337C12.9367 3.03109 10.9746 1.07038 8.47089 1.07038H8.46947L5.52982 1.06329C3.02613 1.06329 1.064 3.02542 1.064 5.53053C1.064 7.94775 2.94815 9.70289 5.54258 9.70289H5.82329C6.11747 9.70289 6.35494 9.94106 6.35494 10.2345V12.4937Z" fill="#6E7F8D"/>
                    </svg>
                </div>
                <div class="span">
                    <span>2</span>
                </div>
                
                
            </div>
            <div class="retweet-icon icon">
                <div class="svg">
                    <svg width="19" height="13" viewBox="0 0 19 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M5.74342 11.8218H10.3787H10.3803C10.7076 11.8218 10.9746 12.0857 10.9746 12.4109C10.9746 12.7361 10.7083 13 10.3803 13H5.74501C4.1072 13 2.77366 11.6788 2.77366 10.0545V2.01121L1.01462 3.75496C0.782456 3.98511 0.407669 3.98511 0.174715 3.75496C-0.0582385 3.52482 -0.0582385 3.15172 0.174715 2.92236L2.94798 0.173197C3.17934 -0.0577324 3.55572 -0.0577324 3.78788 0.173197L6.56114 2.92236C6.7933 3.15172 6.7933 3.52482 6.56114 3.75496C6.44545 3.87043 6.29332 3.92777 6.14119 3.92777C5.98905 3.92777 5.83692 3.87043 5.71965 3.75496L3.96061 2.01121V10.0545C3.96061 11.0285 4.7609 11.8218 5.74342 11.8218ZM17.9854 9.24543C18.2175 9.01529 18.5939 9.01529 18.8253 9.24543C19.0582 9.47557 19.0582 9.84868 18.8253 10.078L16.052 12.8272C15.9355 12.9434 15.785 13 15.6321 13C15.4791 13 15.327 12.9427 15.2121 12.8272L12.4389 10.078C12.2059 9.84868 12.2075 9.47557 12.4389 9.24543C12.6702 9.01529 13.0466 9.01529 13.2788 9.24543L15.0378 10.9892V2.94592C15.0378 1.97193 14.2375 1.1786 13.255 1.1786H8.61969C8.29165 1.1786 8.02542 0.914685 8.02542 0.589499C8.02542 0.264312 8.29165 0.000392745 8.61969 0.000392745H13.255C14.8928 0.000392745 16.2263 1.32156 16.2263 2.94592V10.9892L17.9854 9.24543Z" fill="#6E7F8D"/>
                    </svg>
                </div>
                <div class="span">
                    <span>${tweet.retweet_count}</span>
                </div>
                
                    
            </div>
            <div class="like-icon icon">
                <div class="svg">
                    <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M7.98965 14H8.0008V13.9985H8.00955C10.0659 13.9637 16 8.97927 16 4.25981C16 1.99112 13.9906 0 11.6979 0C9.87402 0 8.64802 1.17098 8 2.02073C7.35038 1.1695 6.12439 0 4.30132 0C2.01015 0 0 1.99112 0 4.25907C0 8.98001 5.93333 13.9645 7.98965 14ZM1.19494 4.26055C1.19494 2.58253 2.64623 1.11103 4.30212 1.11103H4.30292C6.31625 1.11103 7.43955 3.28349 7.45069 3.3057C7.63459 3.72169 8.37178 3.72169 8.55488 3.3057C8.56443 3.28423 9.68853 1.11103 11.7011 1.11103C13.357 1.11103 14.8082 2.58253 14.8082 4.26055C14.8082 8.50999 9.21007 12.8438 8.00159 12.8897C6.79471 12.8438 1.19494 8.50925 1.19494 4.26055Z" fill="#6E7F8D"/>
                        </svg>
                </div>
                <div class="span">
                    <span>${tweet.favorite_count}</span>
                </div>
                
                    
            </div>
            <div class="share-icon icon">
                <div class="svg">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.828 4.25321L7.91507 0.179059C7.68577 -0.0596863 7.31404 -0.0596863 7.08552 0.179059L3.17256 4.25321C2.94248 4.49195 2.94248 4.879 3.17256 5.11693C3.40264 5.35486 3.77281 5.35649 4.00211 5.11693L6.91335 2.08576V10.3889C6.91335 10.7262 7.1763 11 7.50029 11C7.82429 11 8.08724 10.7262 8.08724 10.3889V2.08576L10.9985 5.11693C11.1127 5.23671 11.263 5.29619 11.4133 5.29619C11.5635 5.29619 11.7138 5.23752 11.828 5.11693C12.0573 4.87818 12.0573 4.49195 11.828 4.25321Z" fill="#6E7F8D"/>
                        <path d="M14.1664 16H1.8336C0.8224 16 0 15.1723 0 14.1546V9.60386C0 9.27053 0.2688 9 0.6 9C0.9312 9 1.2 9.27053 1.2 9.60386V14.1546C1.2 14.5064 1.484 14.7923 1.8336 14.7923H14.1664C14.516 14.7923 14.8 14.5064 14.8 14.1546V9.60386C14.8 9.27053 15.0688 9 15.4 9C15.7312 9 16 9.27053 16 9.60386V14.1546C16 15.1723 15.1776 16 14.1664 16Z" fill="#6E7F8D"/>
                    </svg>
                </div>
               
                    
            </div>
            
                
        </div>
    </div>
    </div>`
    
    })
    if(nextPage){
        document.querySelector('.post-container').insertAdjacentHTML('beforeend', tweetContent)
    } else {
        document.querySelector(".post-container").innerHTML=tweetContent
    }

}

const buildImages = (mediaList) => {

    let imagesContent = `<div class="media-container">`;
    let imagesExist = false;
    mediaList.map((media)=>{
        if(media.type == "photo"){
            imagesExist = true;
            imagesContent += `
                <div class="image" style="background-image: url(${media.media_url_https})"></div>
            `
        }
    })
    imagesContent += `</div>`;
    return (imagesExist ? imagesContent : '');
}

const buildVideo = (mediaList) => {
    let videoContent = `<div class="media-container">`;
    let videoExists = false;
    mediaList.map((media)=>{
        if(media.type == "video" || media.type == 'animated_gif'){
            videoExists = true;
            const video = media.video_info.variants.find((video)=>video.content_type == 'video/mp4');
            const videoOptions = getVideoOptions(media.type);
            videoContent += `
            <video ${videoOptions}>
                <source src="${video.url}" type="video/mp4">
                Your browser does not support HTML5 video.
            </video>
            `
        }
    })
    videoContent += `</div>`;
    return (videoExists ? videoContent : '');

}

function getVideoOptions (mediaType){
    if(mediaType == 'animated_gif'){
        return "loop autoplay";
    } else {
        return "controls";
    }
}