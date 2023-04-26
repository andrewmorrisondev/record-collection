const records = document.querySelectorAll('.record-card')

records.forEach(record => {
  const hiddenDivs = record.querySelectorAll('.hidden')
  record.addEventListener("mouseover", (event) => {
    hiddenDivs.forEach(hiddenDiv => {
      hiddenDiv.classList.remove('hidden')
    })
  })
  record.addEventListener("mouseout", (event) => {
    hiddenDivs.forEach(hiddenDiv => {
      hiddenDiv.classList.add('hidden')
    })
  })
})