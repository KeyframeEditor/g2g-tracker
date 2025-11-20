// Event Schedule Data
const SCHEDULE_DATA = {
    "2025-11-22": [
        { time: "14:20", title: "Opening By TLM" },
        { time: "14:30", title: "Pembukaan Menteri Ekonomi Kreatif / Kepala Badan Ekonomi Kreatif" },
        { time: "14:40", title: "Kuis Gamer No 1" },
        { time: "15:10", title: "Stage Session Ekraf" },
        { time: "15:40", title: "Stage Session Intel" },
        { time: "16:20", title: "Stage Session Todak" },
        { time: "17:00", title: "Stage Session Axioo Pongo" },
        { time: "17:45", title: "Stage Session Genshin Impact" },
        { time: "18:25", title: "3 on 3 Djijuriin Michael Jorden by Intel" },
        { time: "19:05", title: "Pejuang Seruput by Intel" },
        { time: "20:00", title: "Karaoke Wibu" },
        { time: "20:45", title: "Prize Announcement & Closing" }
    ],
    "2025-11-23": [
        { time: "10:35", title: "Opening by TLM" },
        { time: "10:50", title: "Anno 177: Pax Romana Tournament" },
        { time: "11:30", title: "Stage Session Ekraf" },
        { time: "12:00", title: "Stage Session Todak" },
        { time: "12:40", title: "Perintah Aldo (PERINDO)" },
        { time: "13:20", title: "Coswalk Competition" },
        { time: "15:30", title: "Main Tebak Bok (MABOK)" },
        { time: "16:00", title: "Bongkar Bongkar Gacha (BBG)" },
        { time: "16:25", title: "Kombatan Performance" },
        { time: "17:20", title: "Performance by Okemudin" },
        { time: "17:30", title: "Lelang Maha Asik" },
        { time: "18:00", title: "Awarding Cosplay" },
        { time: "19:05", title: "Raffle Media" },
        { time: "19:20", title: "Nakama Toxic Performance" },
        { time: "20:20", title: "Band TLM Aldo" },
        { time: "20:40", title: "Prize Announcement" },
        { time: "20:50", title: "Closing" }
    ]
};

// Global variables
let timelineBlocks = [];
let currentEvent = null;
let updateInterval;

// Utility function to get current time in Asia/Jakarta timezone
function getCurrentTimeInJakarta() {
    return new Date(new Date().toLocaleString("en-US", {timeZone: "Asia/Jakarta"}));
}

// Utility function to format time for display
function formatTime(time) {
    return time.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'Asia/Jakarta'
    });
}

// Utility function to format date for schedule lookup
function formatDate(date) {
    return date.toISOString().split('T')[0];
}

// Parse time string to Date object for a specific date
function parseEventTime(dateStr, timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const date = new Date(dateStr + 'T00:00:00+07:00');
    date.setHours(hours, minutes, 0, 0);
    return date;
}

// Generate dynamic time blocks based on actual event schedule
function generateTimeBlocks() {
    const blocks = [];
    const currentTime = getCurrentTimeInJakarta();
    const dates = Object.keys(SCHEDULE_DATA).sort();
    
    // Convert events to time-based array with durations
    const allEvents = [];
    for (const dateStr of dates) {
        const events = SCHEDULE_DATA[dateStr];
        for (let i = 0; i < events.length; i++) {
            const event = events[i];
            const startTime = parseEventTime(dateStr, event.time);
            
            // Calculate end time based on next event or default duration
            let endTime;
            if (i < events.length - 1) {
                // End time is start of next event
                endTime = parseEventTime(dateStr, events[i + 1].time);
            } else {
                // Last event of the day - default to 30 minutes duration
                endTime = new Date(startTime.getTime() + (30 * 60 * 1000));
            }
            
            allEvents.push({
                startTime: startTime,
                endTime: endTime,
                event: event,
                dateStr: dateStr
            });
        }
    }
    
    // Sort all events by start time
    allEvents.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
    
    if (allEvents.length === 0) return blocks;
      // Add comprehensive time blocks before events start
    const firstEventTime = allEvents[0].startTime;
    if (currentTime < firstEventTime) {
        // Start from current time and create blocks leading up to events
        const startTime = new Date(currentTime);
        startTime.setHours(startTime.getHours() - 2); // Start 2 hours before current time
        
        // Create 4-hour blocks from start time to first event
        let blockTime = new Date(startTime);
        while (blockTime < firstEventTime) {
            const blockEndTime = new Date(Math.min(blockTime.getTime() + (4 * 60 * 60 * 1000), firstEventTime.getTime()));
            
            let blockTitle = "Waiting for Events";
            if (blockTime <= currentTime && currentTime < blockEndTime) {
                blockTitle = "Current Time - Before Events Start";
            } else if (blockEndTime <= currentTime) {
                blockTitle = "Past Time - Before Events";
            } else {
                // Calculate time until events
                const timeUntilEvents = Math.ceil((firstEventTime.getTime() - blockTime.getTime()) / (60 * 60 * 1000));
                blockTitle = `${timeUntilEvents}h until Events Start`;
            }
            
            blocks.push({
                startTime: new Date(blockTime),
                endTime: new Date(blockEndTime),
                event: { title: blockTitle, time: formatTime(blockTime) },
                dateStr: formatDate(blockTime),
                isPreEvent: true
            });
            
            blockTime = new Date(blockEndTime);
        }
    }
    
    // Add event blocks
    for (const eventData of allEvents) {
        blocks.push({
            startTime: eventData.startTime,
            endTime: eventData.endTime,
            event: eventData.event,
            dateStr: eventData.dateStr
        });
    }
    
    // Add a "after events" block
    const lastEventTime = allEvents[allEvents.length - 1].endTime;
    const afterEndTime = new Date(lastEventTime.getTime() + (60 * 60 * 1000));
    blocks.push({
        startTime: lastEventTime,
        endTime: afterEndTime,
        event: null,
        dateStr: formatDate(lastEventTime),
        isPostEvent: true
    });
    
    return blocks;
}

// Determine the status of a time block
function getBlockStatus(block, currentTime) {
    if (currentTime >= block.startTime && currentTime < block.endTime) {
        return 'current';
    } else if (currentTime >= block.endTime) {
        return 'past';
    } else {
        return 'future';
    }
}

// Get the current event if any
function getCurrentEvent(currentTime) {
    const currentBlock = timelineBlocks.find(block => 
        currentTime >= block.startTime && currentTime < block.endTime && block.event
    );
    return currentBlock ? currentBlock.event : null;
}

// Create HTML for a timeline block
function createTimelineBlockHTML(block, index) {
    const currentTime = getCurrentTimeInJakarta();
    const status = getBlockStatus(block, currentTime);
    
    const startTimeStr = formatTime(block.startTime);
    const endTimeStr = formatTime(block.endTime);
    
    // Format date for display if it's different from today
    const blockDate = block.startTime.toLocaleDateString('en-US', {
        timeZone: 'Asia/Jakarta',
        month: 'short',
        day: 'numeric'
    });
    
    // Determine block type and styling
    let blockClass = `timeline-block ${status}`;
    if (block.isPreEvent) blockClass += ' pre-event';
    if (block.isPostEvent) blockClass += ' post-event';
    if (!block.event && !block.isPreEvent && !block.isPostEvent) blockClass += ' gap-event';
    
    let blockHTML = `<div class="${blockClass}" data-index="${index}">`;
    
    // Add date header if this is the first block of a new day
    if (index === 0 || formatDate(block.startTime) !== formatDate(timelineBlocks[index - 1].startTime)) {
        blockHTML += `<div class="date-header">${blockDate}</div>`;
    }
    
    blockHTML += `<div class="block-time">${startTimeStr} - ${endTimeStr}</div>`;
      if (block.event) {
        // Calculate actual duration
        const durationMs = block.endTime.getTime() - block.startTime.getTime();
        const durationMinutes = Math.round(durationMs / (60 * 1000));
        
        blockHTML += `<div class="block-title">${block.event.title}</div>`;
        
        if (block.isPreEvent) {
            // Show countdown for pre-event blocks
            const firstEvent = timelineBlocks.find(b => b.event && !b.isPreEvent);
            if (firstEvent) {
                const timeUntil = firstEvent.startTime.getTime() - block.startTime.getTime();
                const hoursUntil = Math.ceil(timeUntil / (60 * 60 * 1000));
                const firstEventDate = firstEvent.startTime.toLocaleDateString('en-US', {
                    timeZone: 'Asia/Jakarta',
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                });
                blockHTML += `<div class="block-duration">Events start ${firstEventDate} at ${formatTime(firstEvent.startTime)}</div>`;
            }
        } else {
            blockHTML += `<div class="block-duration">${durationMinutes} minutes</div>`;
        }
    } else if (block.isPreEvent) {
        blockHTML += `<div class="block-title">Before Events</div>`;
    } else if (block.isPostEvent) {
        blockHTML += `<div class="block-title">After Events</div>`;
    } else {
        blockHTML += `<div class="block-title">Break / Gap</div>`;
    }
    
    // Add current time indicator if this block contains current time
    if (status === 'current' || (currentTime >= block.startTime && currentTime < block.endTime)) {
        const progress = (currentTime.getTime() - block.startTime.getTime()) / 
                        (block.endTime.getTime() - block.startTime.getTime());
        const currentTimeStr = formatTime(currentTime);
        blockHTML += `<div class="current-time-indicator" style="top: ${progress * 100}%">`;
        blockHTML += `<span class="current-time-label">${currentTimeStr}</span>`;
        blockHTML += `</div>`;
    }
    
    blockHTML += `</div>`;
    
    return blockHTML;
}

// Render the entire timeline
function renderTimeline() {
    const timeline = document.getElementById('timeline');
    const currentTime = getCurrentTimeInJakarta();
    
    let html = '';
    timelineBlocks.forEach((block, index) => {
        html += createTimelineBlockHTML(block, index);
    });
    
    timeline.innerHTML = html;
    
    // Set dynamic heights based on event duration
    const blocks = timeline.querySelectorAll('.timeline-block');
    blocks.forEach((blockElement, index) => {
        const block = timelineBlocks[index];
        const durationMs = block.endTime.getTime() - block.startTime.getTime();
        const durationMinutes = durationMs / (60 * 1000);
        
        // Base height of 60px, then add 2px per minute (min 60px, max 200px)
        let height = Math.max(60, Math.min(200, 60 + (durationMinutes * 2)));
        
        // Special heights for non-event blocks
        if (block.isPreEvent || block.isPostEvent) {
            height = 80;
        } else if (!block.event && !block.isPreEvent && !block.isPostEvent) {
            height = 50; // Short break blocks
        }
        
        blockElement.style.minHeight = `${height}px`;
    });
}

// Update timeline status and live event display
function updateTimeline() {
    const currentTime = getCurrentTimeInJakarta();
    const timeline = document.getElementById('timeline');
    const blocks = timeline.querySelectorAll('.timeline-block');
    
    // Update each block's status and current time indicators
    blocks.forEach((blockElement, index) => {
        const block = timelineBlocks[index];
        const status = getBlockStatus(block, currentTime);
        
        // Remove all status classes
        blockElement.classList.remove('past', 'current', 'future');
        // Add current status class
        blockElement.classList.add(status);
        
        // Update or remove current time indicator
        const existingIndicator = blockElement.querySelector('.current-time-indicator');
        if (existingIndicator) {
            existingIndicator.remove();
        }
        
        // Add current time indicator if this block contains current time
        if (currentTime >= block.startTime && currentTime < block.endTime) {
            const progress = (currentTime.getTime() - block.startTime.getTime()) / 
                            (block.endTime.getTime() - block.startTime.getTime());
            const currentTimeStr = formatTime(currentTime);
            
            const indicator = document.createElement('div');
            indicator.className = 'current-time-indicator';
            indicator.style.top = `${progress * 100}%`;
            indicator.innerHTML = `<span class="current-time-label">${currentTimeStr}</span>`;
            blockElement.appendChild(indicator);
        }
    });
      // Update current event display
    currentEvent = getCurrentEvent(currentTime);
    updateLiveEventDisplay();
    
    // Align the center needle with the current time indicator
    setTimeout(() => {
        alignNeedleWithCurrentTime();
    }, 100);
}

// Update the live event display at the top
function updateLiveEventDisplay() {
    const liveTitle = document.getElementById('live-title');
    const liveTime = document.getElementById('live-time');
    const currentTime = getCurrentTimeInJakarta();
    
    if (currentEvent) {
        liveTitle.textContent = currentEvent.title;
        
        // Find the block containing this event to show time range
        const eventBlock = timelineBlocks.find(block => block.event === currentEvent);
        if (eventBlock) {
            const startTime = formatTime(eventBlock.startTime);
            const endTime = formatTime(eventBlock.endTime);
            const eventDate = eventBlock.startTime.toLocaleDateString('en-US', {
                timeZone: 'Asia/Jakarta',
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
            liveTime.textContent = `${eventDate} • ${startTime} - ${endTime}`;
        }
    } else {
        liveTitle.textContent = 'No event at this moment';
        const currentDate = currentTime.toLocaleDateString('en-US', {
            timeZone: 'Asia/Jakarta',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
        liveTime.textContent = `${currentDate} • ${formatTime(currentTime)} (Jakarta Time)`;
    }
}

// Auto-scroll to current time position
function scrollToCurrentTime() {
    const currentTime = getCurrentTimeInJakarta();
    
    // Find the block that contains the current time
    let currentBlockIndex = -1;
    for (let i = 0; i < timelineBlocks.length; i++) {
        const block = timelineBlocks[i];
        if (currentTime >= block.startTime && currentTime < block.endTime) {
            currentBlockIndex = i;
            break;
        }
    }
    
    // If current time is not within any block, find the closest future block
    if (currentBlockIndex === -1) {
        for (let i = 0; i < timelineBlocks.length; i++) {
            const block = timelineBlocks[i];
            if (currentTime < block.startTime) {
                currentBlockIndex = i;
                break;
            }
        }
        // If still not found, use the last block
        if (currentBlockIndex === -1) {
            currentBlockIndex = timelineBlocks.length - 1;
        }
    }
    
    if (currentBlockIndex !== -1) {
        const timeline = document.getElementById('timeline');
        const blocks = timeline.querySelectorAll('.timeline-block');
        const targetBlock = blocks[currentBlockIndex];
        
        if (targetBlock) {
            const block = timelineBlocks[currentBlockIndex];
            
            // Calculate exact position within the block based on current time
            let blockProgress = 0;
            if (currentTime >= block.startTime && currentTime < block.endTime) {
                blockProgress = (currentTime.getTime() - block.startTime.getTime()) / 
                               (block.endTime.getTime() - block.startTime.getTime());
            } else if (currentTime < block.startTime) {
                blockProgress = 0;
            } else {
                blockProgress = 1;
            }
            
            // Get the exact pixel position of the red time indicator
            const blockTop = targetBlock.offsetTop;
            const blockHeight = targetBlock.offsetHeight;
            const timelineHeight = timeline.clientHeight;
            
            // The red indicator position within the block
            const indicatorPosition = blockTop + (blockHeight * blockProgress);
            
            // Scroll so the red indicator aligns perfectly with the center needle (50vh)
            const scrollPosition = indicatorPosition - (timelineHeight / 2);
            
            timeline.scrollTo({
                top: Math.max(0, scrollPosition),
                behavior: 'smooth'
            });
        }
    }
}

// Function to continuously align the needle with current time indicator
function alignNeedleWithCurrentTime() {
    const currentTime = getCurrentTimeInJakarta();
    const timeline = document.getElementById('timeline');
    const blocks = timeline.querySelectorAll('.timeline-block');
    
    // Find the block with current time indicator
    for (let i = 0; i < blocks.length; i++) {
        const block = timelineBlocks[i];
        const blockElement = blocks[i];
        
        if (currentTime >= block.startTime && currentTime < block.endTime) {
            const indicator = blockElement.querySelector('.current-time-indicator');
            if (indicator) {
                // Get the absolute position of the indicator
                const blockTop = blockElement.offsetTop;
                const indicatorTop = indicator.offsetTop;
                const absoluteIndicatorPosition = blockTop + indicatorTop;
                
                // Get current scroll position and timeline center
                const scrollTop = timeline.scrollTop;
                const timelineHeight = timeline.clientHeight;
                const centerPosition = scrollTop + (timelineHeight / 2);
                
                // Check if needle and indicator are misaligned (more than 5px difference)
                const misalignment = Math.abs(absoluteIndicatorPosition - centerPosition);
                if (misalignment > 5) {
                    // Adjust scroll to align needle with indicator
                    const targetScroll = absoluteIndicatorPosition - (timelineHeight / 2);
                    timeline.scrollTo({
                        top: Math.max(0, targetScroll),
                        behavior: 'smooth'
                    });
                }
            }
            break;
        }
    }
}

// Initialize the application
function initializeApp() {
    console.log('Initializing Event Realtime Tracker...');
    
    // Generate timeline blocks
    timelineBlocks = generateTimeBlocks();
    console.log(`Generated ${timelineBlocks.length} timeline blocks`);
    
    // Render initial timeline
    renderTimeline();
    
    // Initial update
    updateTimeline();
      // Auto-scroll to current time with multiple attempts to ensure perfect alignment
    setTimeout(() => {
        scrollToCurrentTime();
        // Fine-tune alignment after initial scroll
        setTimeout(() => {
            alignNeedleWithCurrentTime();
        }, 500);
    }, 1000);
    
    // Start real-time updates every second
    updateInterval = setInterval(updateTimeline, 1000);
    
    // Log current time and first event for debugging
    const currentTime = getCurrentTimeInJakarta();
    const firstEvent = timelineBlocks.find(block => block.event && !block.isPreEvent);
    if (firstEvent) {
        const timeUntil = firstEvent.startTime.getTime() - currentTime.getTime();
        const hoursUntil = Math.round(timeUntil / (60 * 60 * 1000));
        console.log(`Current time: ${formatTime(currentTime)}`);
        console.log(`First event: ${formatTime(firstEvent.startTime)} (in ${hoursUntil} hours)`);
    }
    
    console.log('Event Realtime Tracker initialized successfully!');
}

// Clean up on page unload
function cleanup() {
    if (updateInterval) {
        clearInterval(updateInterval);
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', initializeApp);
window.addEventListener('beforeunload', cleanup);

// Handle visibility change to resume updates when tab becomes visible
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        updateTimeline();
        setTimeout(scrollToCurrentTime, 100);
    }
});

// Expose some functions globally for debugging
window.EventTracker = {
    getCurrentTime: getCurrentTimeInJakarta,
    getCurrentEvent: () => currentEvent,
    getTimelineBlocks: () => timelineBlocks,
    scrollToCurrentTime: scrollToCurrentTime,
    updateTimeline: updateTimeline
};
