// ------ HELPER FUNCTIONS ------ //

function sleep(s) {
    return new Promise(resolve => setTimeout(resolve, s * 1000));
}

// ------ MAIN INITIALIZATION ------ //
async function initialize(restart = false) {
    if (restart) {
        console.log("Restarting to append new button in window", new Date().toLocaleString())
    }
    console.log("Started", new Date().toLocaleString())

    await sleep(1)
    console.log("Timeout", new Date().toLocaleString())

    console.log("Content script loaded")

    const chatWindow = document.querySelector('body div > main.relative div[role="presentation"]')
    if (!chatWindow || chatWindow == undefined) {
        console.log("Chat window not found")
        return
    }

    console.log("Chat window found")

    const topMenu = chatWindow.querySelector('.bg-token-main-surface-primary')
    if (!topMenu || topMenu == undefined) {
        console.log("Top menu not found")
        return
    }

    topMenu.classList.remove('justify-between')
    topMenu.classList.add('top_menu')

    console.log("Top menu found")
    const exportBtn = document.createElement('button')
    exportBtn.innerHTML = "Export chat"
    exportBtn.className = "export_btn"

    const topMenuFirstItem = topMenu.querySelector('div:nth-child(2)')
    if (!topMenuFirstItem || topMenuFirstItem == undefined) {
        console.log("Top menu first item not found")
        return
    }

    topMenuFirstItem.insertAdjacentElement('afterend', exportBtn)

    exportBtn.addEventListener('click', () => exportChatContent(chatWindow, exportBtn))

    if (!restart) {
        addWindowChangeStateUpdate()
    }
}

initialize()

// ------ WINDOW CHANGE EVENT LISTENERS ------ // 
function addWindowChangeStateUpdate() {
    const navigationLinks = document.querySelectorAll('nav > div ol li a')
    // console.log("Nav links:", navigationLinks)
    if (navigationLinks && navigationLinks.length > 0) {
        for (let i = 0; i < navigationLinks.length; i++) {
            // console.log("Listening to", navigationLinks[i])
            navigationLinks[i].addEventListener('click', () => initialize(restart = true))
        }
    }
}


// ------ EXPORT LOGIC ------ //
function exportChatContent(chatWindow, exportBtn) {
    console.log("Exporting chat")
    exportBtn.innerHTML = "Exporting..."

    chatMessages = chatWindow.querySelectorAll('div[data-testid*="conversation-turn"]')
    if (!chatMessages || chatMessages == undefined || chatMessages.length == 0) {
        console.log("Chat messages not found")
        return
    }

    const segregatedMessages = {
        user: [],
        ai: [],
    };

    const allMessages = [];

    for (let i = 0; i < chatMessages.length; i++) {
        let chatMessage = chatMessages[i]
        if (chatMessage == undefined) {
            continue
        }

        let chatContent = chatMessage.innerText

        if (i % 2 == 0) {
            segregatedMessages.user.push(chatContent)
        } else {
            segregatedMessages.ai.push(chatContent)
        }

        allMessages.push(chatContent)
    }

    console.log("Chat messages found")
    console.log(segregatedMessages)
    console.log(allMessages)

    // Finished
    exportBtn.innerHTML = "Export chat"
}