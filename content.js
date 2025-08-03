// ----- GLOBAL STATE ----- // 
const state = {
    exportPopupOpen: false
}

// ------ HELPER FUNCTIONS & CONSTANTS ------ //
const EXPORT_MSG = "Export"
const EXPORTING_MSG = "Exporting..."

function sleep(s) {
    return new Promise(resolve => setTimeout(resolve, s * 1000));
}


// ------ HELPERS ------ // 
function downloadFile(filename, content, type) {
    const blob = new Blob([content], { type })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')

    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
}


function escapeHTML(text) {
    return text.replace(/[&<>"']/g, (m) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    })[m]);
}

function exportToPDF(html) {
    const win = window.open('', '', 'height=700,width=900');
    if (!win) {
        return
    }

    win.document.write(html)
    win.document.close()
    win.focus()
    win.print()
    win.close()
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
    const popupBtn = document.createElement('button')
    popupBtn.innerHTML = EXPORT_MSG
    popupBtn.className = "export_btn"

    const topMenuFirstItem = topMenu.querySelector('div:nth-child(2)')
    if (!topMenuFirstItem || topMenuFirstItem == undefined) {
        console.log("Top menu first item not found")
        return
    }

    topMenuFirstItem.insertAdjacentElement('afterend', popupBtn)

    popupBtn.addEventListener('click', () => openExportSettingsPopup(chatWindow, popupBtn, topMenu))

    if (!restart) {
        addWindowChangeStateUpdate()
    }
}

initialize()

// ------ WINDOW CHANGE EVENT LISTENERS ------ // 
function addWindowChangeStateUpdate() {
    const navigationLinks = document.querySelectorAll('nav > div ol li a')
    console.log("Nav links:", navigationLinks)
    if (navigationLinks && navigationLinks.length > 0) {
        for (let i = 0; i < navigationLinks.length; i++) {
            // console.log("Listening to", navigationLinks[i])
            navigationLinks[i].addEventListener('click', () => initialize(restart = true))
        }
    }
}

// ------ EXPORT SETTINGS POPUP ------ //
function openExportSettingsPopup(chatWindow, popupBtn, topMenu) {
    if (state.exportPopupOpen) {
        return
    }
    console.log("Opening export settings popup")

    // Main popup window
    const exportSettingsPopup = document.createElement('div')
    exportSettingsPopup.className = "export_settings_popup"

    const exportSettingsHeading = document.createElement('h2')
    exportSettingsHeading.innerHTML = "Export settings"
    exportSettingsPopup.appendChild(exportSettingsHeading)

    // Export type choices selection inputs
    const exportTypeChoices = document.createElement('div')
    exportTypeChoices.className = "export_type_choice"

    const exportTypeHeading = document.createElement('h3')
    exportTypeHeading.innerHTML = "Export type"
    exportTypeChoices.appendChild(exportTypeHeading)

    const fullChatChoice = document.createElement('input')
    fullChatChoice.type = "checkbox"
    fullChatChoice.id = "full_chat"
    const fullChatLabel = document.createElement('label')
    fullChatLabel.htmlFor = "full_chat"
    fullChatLabel.innerHTML = "Full chat"
    exportTypeChoices.appendChild(fullChatLabel)
    exportTypeChoices.appendChild(fullChatChoice)


    const aiChatChoice = document.createElement('input')
    aiChatChoice.type = "checkbox"
    aiChatChoice.id = "ai_chat"
    const aiChatLabel = document.createElement('label')
    aiChatLabel.htmlFor = "ai_chat"
    aiChatLabel.innerHTML = "AI chat"
    exportTypeChoices.appendChild(aiChatLabel)
    exportTypeChoices.appendChild(aiChatChoice)

    exportSettingsPopup.appendChild(exportTypeChoices)

    // Export format choice
    const exportFormatChoices = document.createElement('div')
    exportFormatChoices.className = "export_format_choice"

    const exportFormatHeading = document.createElement('h3')
    exportFormatHeading.innerHTML = "Export format"
    exportFormatChoices.appendChild(exportFormatHeading)

    const exportFormatChoicesContainer = document.createElement('div')
    exportFormatChoicesContainer.className = "export_type_choices_container"

    const jsonChoiceContainer = document.createElement('div')
    const jsonChoice = document.createElement('input')
    jsonChoice.type = "checkbox"
    jsonChoice.id = "json"
    const jsonLabel = document.createElement('label')
    jsonLabel.htmlFor = "json"
    jsonLabel.innerHTML = "JSON"
    jsonChoiceContainer.appendChild(jsonLabel)
    jsonChoiceContainer.appendChild(jsonChoice)
    exportFormatChoicesContainer.appendChild(jsonChoiceContainer)

    const csvChoiceContainer = document.createElement('div')
    const csvChoice = document.createElement('input')
    csvChoice.type = "checkbox"
    csvChoice.id = "csv"
    const csvLabel = document.createElement('label')
    csvLabel.htmlFor = "csv"
    csvLabel.innerHTML = "CSV"
    csvChoiceContainer.appendChild(csvLabel)
    csvChoiceContainer.appendChild(csvChoice)
    exportFormatChoicesContainer.appendChild(csvChoiceContainer)

    const plainTextChoiceContainer = document.createElement('div')
    const plainTextChoice = document.createElement('input')
    plainTextChoice.type = "checkbox"
    plainTextChoice.id = "plain_text"
    const plainTextLabel = document.createElement('label')
    plainTextLabel.htmlFor = "plain_text"
    plainTextLabel.innerHTML = "Plain text"
    plainTextChoiceContainer.appendChild(plainTextLabel)
    plainTextChoiceContainer.appendChild(plainTextChoice)
    exportFormatChoicesContainer.appendChild(plainTextChoiceContainer)

    const wordChoiceContainer = document.createElement('div')
    const wordChoice = document.createElement('input')
    wordChoice.type = "checkbox"
    wordChoice.id = "word_text"
    const wordLabel = document.createElement('label')
    wordLabel.htmlFor = "word_text"
    wordLabel.innerHTML = "Word text"
    wordChoiceContainer.appendChild(wordLabel)
    wordChoiceContainer.appendChild(wordChoice)
    exportFormatChoicesContainer.appendChild(wordChoiceContainer)

    const htmlChoiceContainer = document.createElement('div')
    const htmlChoice = document.createElement('input')
    htmlChoice.type = "checkbox"
    htmlChoice.id = "html"
    const htmlLabel = document.createElement('label')
    htmlLabel.htmlFor = "html"
    htmlLabel.innerHTML = "HTML"
    htmlChoiceContainer.appendChild(htmlLabel)
    htmlChoiceContainer.appendChild(htmlChoice)
    exportFormatChoicesContainer.appendChild(htmlChoiceContainer)

    const pdfChoiceContainer = document.createElement('div')
    const pdfChoice = document.createElement('input')
    pdfChoice.type = "checkbox"
    pdfChoice.id = "pdf"
    const pdfLabel = document.createElement('label')
    pdfLabel.htmlFor = "pdf"
    pdfLabel.innerHTML = "PDF"
    pdfChoiceContainer.appendChild(pdfLabel)
    pdfChoiceContainer.appendChild(pdfChoice)
    exportFormatChoicesContainer.appendChild(pdfChoiceContainer)

    const markdownChoiceContainer = document.createElement('div')
    const markdownChoice = document.createElement('input')
    markdownChoice.type = "checkbox"
    markdownChoice.id = "markdown"
    const markdownLabel = document.createElement('label')
    markdownLabel.htmlFor = "markdown"
    markdownLabel.innerHTML = "Markdown"
    markdownChoiceContainer.appendChild(markdownLabel)
    markdownChoiceContainer.appendChild(markdownChoice)
    exportFormatChoicesContainer.appendChild(markdownChoiceContainer)

    exportFormatChoices.appendChild(exportFormatChoicesContainer)
    exportSettingsPopup.appendChild(exportFormatChoices)

    // Export button
    const exportBtn = document.createElement('button')
    exportBtn.className = 'export_btn_popup'
    exportBtn.innerHTML = EXPORT_MSG
    exportBtn.addEventListener('click', () => exportChatContent(chatWindow, popupBtn))
    exportSettingsPopup.appendChild(exportBtn)

    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'popup_close_btn';
    closeBtn.innerHTML = '&times;';
    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeExportSettingsPopup();
    });
    exportSettingsPopup.appendChild(closeBtn);

    // Append under menu container

    topMenu.insertAdjacentElement('afterend', exportSettingsPopup)
    state.exportPopupOpen = true;
    setTimeout(() => {
        window.addEventListener('click', handleOutsideClick)
    }, 1)
}

function closeExportSettingsPopup() {
    console.log("Registered outside click")
    if (!state.exportPopupOpen) {
        console.log("Not open")
        return
    }

    const exportSettingsPopup = document.querySelector('.export_settings_popup')
    if (!exportSettingsPopup || exportSettingsPopup === null) {
        return
    }

    exportSettingsPopup.remove()
    state.exportPopupOpen = false
}

function handleOutsideClick(e) {
    const exportSettingsPopup = document.querySelector('.export_settings_popup')

    const isInside = exportSettingsPopup?.contains(e.target);
    const isTrigger = document.querySelector('.export_btn')?.contains(e.target);

    if (!isInside && !isTrigger) {
        closeExportSettingsPopup();
        window.removeEventListener('click', handleOutsideClick);
    }
}

// ------ EXPORT LOGIC ------ //
function exportChatContent(chatWindow, popupBtn) {
    console.log("Exporting chat")
    popupBtn.innerHTML = EXPORTING_MSG

    chatMessages = chatWindow.querySelectorAll('div[data-testid*="conversation-turn"]')
    if (!chatMessages || chatMessages == undefined || chatMessages.length == 0) {
        console.log("Chat messages not found")
        popupBtn.innerHTML = EXPORT_MSG
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