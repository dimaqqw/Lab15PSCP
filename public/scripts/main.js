function switchGetHome() {}

function switchGetAdd() {
  window.location.href = 'Add'
}

function switchGetUpdate(name, number, id) {
  window.location.href = 'Update/' + name + '/' + number + '/' + id
}

function postDataByAddButton() {
  const dataName = document.getElementById('fio').value
  const dataNumber = +document.getElementById('number').value
  console.log(Number.isInteger(dataNumber))
  if (dataName != '' && dataNumber != '') {
    if (
      Number.isInteger(dataNumber) &&
      Number.toString(dataNumber).length > 5
    ) {
      var xhr = new XMLHttpRequest()
      xhr.open('POST', '/Add', true)
      xhr.setRequestHeader('Content-Type', 'application/json')
      xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === 200) {
            console.log('POST request successful!')
            window.location.href = '/'
          } else {
            console.error('Error:', xhr.status)
          }
        }
      }
      const data = {
        name: dataName,
        number: dataNumber,
      }
      xhr.send(JSON.stringify(data))
    } else {
      console.log('Номер некоректный')
    }
  } else {
    console.log('Нет данных!')
  }
}

if (window.location.pathname.includes('/Update')) {
  var buttonStrings = document.querySelectorAll('.button-string')
  buttonStrings.forEach(function (buttonString) {
    buttonString.style.pointerEvents = 'none'
  })
}

function postDataByUpdate() {
  const id = +document.getElementById('id').value
  const name = document.getElementById('fio').value
  const number = +document.getElementById('number').value
  if (
    id != '' &&
    name != '' &&
    number != '' &&
    Number.isInteger(number) &&
    Number.toString(dataNumber).length > 5
  ) {
    const data = { id, name, number }

    fetch('/Update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.ok) {
          console.log('Data updated successfully!')
          window.location.href = '/'
        } else {
          console.error('Error updating data:', response.statusText)
        }
      })
      .catch((error) => console.error('Error updating data:', error))
  } else {
    console.log('Error for update')
  }
}

function postDataByDelete(id) {
  // const id = document.getElementById('id').value

  fetch('/Delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id }),
  })
    .then((response) => {
      if (response.ok) {
        console.log('Data deleted successfully!')
        window.location.href = '/'
      } else {
        console.error('Error deleting data:', response.statusText)
      }
    })
    .catch((error) => console.error('Error deleting data:', error))
}
