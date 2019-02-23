/* global chrome */

let minutesThreshold = 5
let tryAmt
let timeoutHandler = null

const searchTable = async (data) => {
  return data.forEach(v => {
    if (v.innerHTML !== '-' && v.innerHTML !== '<b>Vagas</b>') {
      window.alert('TEM VAGA, CARALHO')
      console.log(v)
    }
  })
}

const findVaga = async () => {
  console.log(`Tentando achar vagas: ${tryAmt}`)

  const data = document.querySelectorAll('td:nth-child(4)')
  if (!data || !data.length) {
    window.alert('Verificar sessão!')
    return
  }

  await searchTable(data)
  window.location.reload()
}

const toggleScript = () => {
  if (!timeoutHandler) {
    timeoutHandler = window.setTimeout(findVaga, 1000 * 60 * minutesThreshold)
    return
  }

  window.clearTimeout(timeoutHandler)
  timeoutHandler = null
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === 'run') {
    tryAmt = request.tryAmt
    minutesThreshold = request.minutesThreshold
    toggleScript()
  } else if (request.message === 'stop') {
    tryAmt = 0
    minutesThreshold = 5
    toggleScript()
  }
})
