/* global chrome */

let isRunning = false
let tryAmt
let minutesThreshold

const resetVariables = () => {
  tryAmt = 0
  minutesThreshold = 5
  chrome.browserAction.setBadgeText({text: ``})
}

const runProgram = (tab) => {
  tryAmt += 1
  chrome.browserAction.setBadgeText({text: `${tryAmt}`})
  return chrome.tabs.sendMessage(tab.id, {message: 'run', tryAmt, minutesThreshold})
}

const stopProgram = (tab) => {
  return chrome.tabs.sendMessage(tab.id, {message: 'stop'})
}

const toggleProgram = (tab) => {
  isRunning = !isRunning

  if (isRunning) minutesThreshold = parseFloat(window.prompt('De quanto em quantos minutos é pra dar refresh?', '2'))
  const message = (isRunning) ? 'Script Inicializado!!!' : 'Script Pausado!!!'
  window.alert(message)

  if (isRunning) runProgram(tab)
  if (!isRunning) stopProgram(tab)
}

chrome.browserAction.onClicked.addListener((tab) => {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    const activeTab = tabs[0]

    resetVariables()
    toggleProgram(activeTab)
    const runProgramCaller = () => { runProgram(tab) }
    if (isRunning) {
      chrome.webNavigation.onCompleted.addListener(runProgramCaller)
    } else {
      chrome.webNavigation.onCompleted.removeListener(runProgramCaller)
    }
  })
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  chrome.notifications.create('worktimer-notification', request.options, () => {})
  chrome.alarms.create('myAlarm', {delayInMinutes: 1})

  document.write('<audio id="player" src="alarm.mp3" autoplay>')
  const player = document.getElementById('player')
  player.pause()
  player.volume = 0
  setTimeout(() => {
    player.play()
  }, 150)

  const alarm = new window.Audio(chrome.runtime.getURL('alarm.mp3'))
  alarm.play()

  player.parentNode.removeChild(player)
  sendResponse()
})

// On run...
resetVariables()
