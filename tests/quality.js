const Matrix = require('node-matrix')
const { ParseCSV } = require('../services/input.service')
module.exports.ZMquality = data => {
  dataArray = ParseCSV(data)

  let latitudes = []
  let longitudes = []
  dataArray.forEach(element => {
    latitudes.push(element.latitude)
    longitudes.push(element.longitude)
  })

  let distinctLatitudes = latitudes.filter(distinct)
  let distinctLongitudes = longitudes.filter(distinct)

  distinctLatitudes = distinctLatitudes.sort((a, b) => a - b)
  distinctLongitudes = distinctLongitudes.sort((a, b) => a - b)

  const latitudesLength = distinctLatitudes.length
  const longitudesLength = distinctLongitudes.length

  let matrix = Matrix({
    rows: latitudesLength,
    columns: longitudesLength
  })

  // Popula as Matrizes com os valores corretos nas posicoes corretas
  for (let lat = 0; lat < latitudesLength; lat++) {
    for (let long = 0; long < longitudesLength; long++) {
      for (let index = 0; index < dataArray.length; index++) {
        const element = dataArray[index]
        if (element.latitude == distinctLatitudes[lat] && element.longitude == distinctLongitudes[long]) {
          matrix[lat][long] = parseInt(element.c2)
        } else {
          matrix[lat][long] = null
        }
      }
    }
  }
  const testHorizontal = matrix => {
    let possibilidadesHorizontal = 0
    let mudancasHorizontal = 0
    for (let lat = 0; lat < latitudesLength.length; lat++) {
      for (let long = 0; long < longitudesLength.length; long++) {
        if (matrix[lat][long] != null) possibilidadesHorizontal++
        if (long != 0) {
          if (matrix[lat][long] != null && matrix[lat][long - 1] != null) {
            if (matrix[lat][long] != matrix[lat][long - 1]) {
              mudancasHorizontal++
            }
          }
        }
      }
    }
  }
  const testVertical = matrix => {
    let possibilidadesVertical = 0
    let mudancasVertical = 0
    for (let long = 0; long < longitudesLength.length; long++) {
      for (let lat = 0; lat < latitudesLength.length; lat++) {
        if (matrix[lat][long] != null) possibilidadesVertical++
        if (lat != 0) {
          if (matrix[lat][long] != null && matrix[lat - 1][long] != null) {
            if (matrix[lat][long] != matrix[lat - 1][long]) {
              mudancasVertical++
            }
          }
        }
      }
    }
  }
  const testLeftDiagonal = matrix => {}
  const testRightDiagonal = matrix => {}
}
