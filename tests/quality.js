const Matrix = require('node-matrix')
const { ParseCSV } = require('../services/input.service')
module.exports.ZMquality = data => {
  const distinct = (value, index, self) => {
    return self.indexOf(value) === index
  }
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
  // matrix[5][6] = 3
  // matrix[5][5] = 4
  const testHorizontal = matrix => {
    let possibilidadesHorizontal = 0
    let mudancasHorizontal = 0
    for (let lat = 0; lat < latitudesLength; lat++) {
      for (let long = 0; long < longitudesLength; long++) {
        if (long != 0) {
          if (matrix[lat][long] != null && matrix[lat][long - 1] != null) {
            if (matrix[lat][long] != null) possibilidadesHorizontal++
            if (matrix[lat][long] != matrix[lat][long - 1]) mudancasHorizontal++
          }
        }
      }
    }
    console.log(`Teste Horizontal possibilidades: ${possibilidadesHorizontal}, mudanças: ${mudancasHorizontal} `)
    return [possibilidadesHorizontal, mudancasHorizontal]
  }

  const testVertical = matrix => {
    let possibilidadesVertical = 0
    let mudancasVertical = 0
    for (let long = 0; long < longitudesLength; long++) {
      for (let lat = 0; lat < latitudesLength; lat++) {
        if (lat != 0) {
          if (matrix[lat][long] != null && matrix[lat - 1][long] != null) {
            if (matrix[lat][long] != null) possibilidadesVertical++
            if (matrix[lat][long] != matrix[lat - 1][long]) mudancasVertical++
          }
        }
      }
    }
    console.log(`Teste Vertical possibilidades: ${possibilidadesVertical}, mudanças: ${mudancasVertical} `)
    return [possibilidadesVertical, mudancasVertical]
  }

  const testLeftDiagonal = matrix => {
    let possibilidadesLeftDiagonal = 0
    let mudancasLeftDiagonal = 0
    for (let lat = 0; lat < latitudesLength; lat++) {
      let latLocal = lat
      let longLocal = 0
      while (latLocal < latitudesLength && longLocal < longitudesLength) {
        if (latLocal + 1 < latitudesLength && longLocal + 1 < longitudesLength) {
          if (matrix[latLocal][longLocal] != null && matrix[latLocal + 1][longLocal + 1] != null) {
            if (matrix[latLocal][longLocal] != null) possibilidadesLeftDiagonal++
            if (matrix[latLocal][longLocal] != matrix[latLocal + 1][longLocal + 1]) mudancasLeftDiagonal++
          }
        }
        latLocal++
        longLocal++
      }
    }

    for (let long = 1; long < longitudesLength; long++) {
      let latLocal = 0
      let longLocal = long
      while (latLocal < latitudesLength && longLocal < longitudesLength) {
        if (latLocal + 1 < latitudesLength && longLocal + 1 < longitudesLength) {
          if (matrix[latLocal][longLocal] != null && matrix[latLocal + 1][longLocal + 1] != null) {
            if (matrix[latLocal][longLocal] != null) possibilidadesLeftDiagonal++
            if (matrix[latLocal][longLocal] != matrix[latLocal + 1][longLocal + 1]) mudancasLeftDiagonal++
          }
        }
        latLocal++
        longLocal++
      }
    }
    console.log(`Teste Diagonal Esquerda possibilidades: ${possibilidadesLeftDiagonal}, mudanças: ${mudancasLeftDiagonal} `)
    return [possibilidadesLeftDiagonal, mudancasLeftDiagonal]
  }

  // console.log(matrix)
  const testRightDiagonal = matrix => {
    let possibilidadesRightDiagonal = 0
    let mudancasRightDiagonal = 0
    for (let lat = 0; lat < latitudesLength; lat++) {
      let latLocal = lat
      let longLocal = 0
      while (latLocal >= 0 && longLocal < longitudesLength) {
        // console.log(`posicao [${latLocal}, ${longLocal}]`)
        // matrix[latLocal][longLocal] = 'p1'
        if (latLocal - 1 > 0 && longLocal + 1 < longitudesLength) {
          if (matrix[latLocal][longLocal] != null && matrix[latLocal - 1][longLocal + 1] != null) {
            if (matrix[latLocal][longLocal] != null) possibilidadesRightDiagonal++
            if (matrix[latLocal][longLocal] != matrix[latLocal - 1][longLocal + 1]) mudancasRightDiagonal++
          }
        }
        latLocal--
        longLocal++
      }
    }
    //console.log('segunda parte')
    for (let long = 1; long < longitudesLength; long++) {
      let latLocal = latitudesLength - 1
      let longLocal = long
      while (latLocal >= 0 && longLocal < longitudesLength) {
        //console.log(`posicao [${latLocal}, ${longLocal}]`)
        //matrix[latLocal][longLocal] = 'p2'
        if (latLocal - 1 > 0 && longLocal + 1 < longitudesLength) {
          if (matrix[latLocal][longLocal] != null && matrix[latLocal - 1][longLocal + 1] != null) {
            if (matrix[latLocal][longLocal] != null) possibilidadesRightDiagonal++
            if (matrix[latLocal][longLocal] != matrix[latLocal - 1][longLocal + 1]) mudancasRightDiagonal++
          }
        }
        latLocal--
        longLocal++
      }
    }
    //console.log(matrix)
    console.log(`Teste Diagonal Direita possibilidades: ${possibilidadesRightDiagonal}, mudanças: ${mudancasRightDiagonal} `)
    return [possibilidadesRightDiagonal, mudancasRightDiagonal]
  }

  let mudancahorizontal, mudancavertical, mudancadiagonalEsquerda, mudancadiagonalDireita, possibilidadeshorizontal, possibilidadesvertical, possibilidadesDiagonalEsquerda, possibilidadesDiagonalDireita
  ;[mudancahorizontal, possibilidadeshorizontal] = testHorizontal(matrix)
  ;[mudancavertical, possibilidadesvertical] = testVertical(matrix)
  ;[mudancadiagonalEsquerda, possibilidadesDiagonalEsquerda] = testLeftDiagonal(matrix)
  ;[mudancadiagonalDireita, possibilidadesDiagonalDireita] = testRightDiagonal(matrix)

  let indice_de_suavidade = 100 - ((mudancahorizontal / 4) * possibilidadeshorizontal + (mudancavertical / 4) * possibilidadesvertical + (mudancadiagonalEsquerda / 4) * possibilidadesDiagonalEsquerda + (mudancadiagonalDireita / 4) * possibilidadesDiagonalDireita) * 100

  console.log(`Indece de suavidade: ${indice_de_suavidade}`)
}
