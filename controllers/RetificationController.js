const { to, ReE, ReS } = require('../services/util.service')

const Matrix = require('node-matrix')
var exec = require('child_process').exec

module.exports.arrayToImage = async (req, res) => {
  const distinct = (value, index, self) => {
    return self.indexOf(value) === index
  }

  method = req.body.method
  kernelSize = req.body.kernelSize
  kernelFormat = req.body.kernelFormat
  iterations = req.body.iterations
  data = req.body.zmData
  dataArray = []

  rows = data.split(';')
  rows.forEach(row => {
    properties = row.split(',')
    rowObject = {
      latitude: properties[0],
      longitude: properties[1],
      ponto: properties[2],
      c2: properties[3],
      c3: properties[4],
      c4: properties[5],
      c5: properties[6]
    }
    dataArray.push(rowObject)
  })
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

  let matrixC2 = Matrix({ rows: latitudesLength, columns: longitudesLength })
  let matrixC3 = Matrix({ rows: latitudesLength, columns: longitudesLength })
  let matrixC4 = Matrix({ rows: latitudesLength, columns: longitudesLength })
  let matrixC5 = Matrix({ rows: latitudesLength, columns: longitudesLength })

  for (let lat = 0; lat < latitudesLength; lat++) {
    for (let long = 0; long < longitudesLength; long++) {
      for (let index = 0; index < dataArray.length; index++) {
        const element = dataArray[index]
        if (element.latitude == distinctLatitudes[lat] && element.longitude == distinctLongitudes[long]) {
          matrixC2[lat][long] = parseInt(element.c2)
          matrixC3[lat][long] = parseInt(element.c3)
          matrixC4[lat][long] = parseInt(element.c4)
          matrixC5[lat][long] = parseInt(element.c5)
        }
      }
    }
  }

  const matrixToString = mat => {
    let retorno = ''
    for (let i = 0; i < mat.numRows; i++) {
      let teste = i.toString()
      const element = mat[teste]
      retorno += element
      retorno += i == mat.numRows - 1 ? '' : '-'
    }
    return retorno
  }

  const processScriptReturn = values => {
    let matrixRetorno = Matrix({ rows: latitudesLength, columns: longitudesLength })
    rows = values.split('][')
    for (let i = 0; i < rows.length; i++) {
      rows[i] = rows[i].replace('[', '')
      rows[i] = rows[i].replace(']', '')
      cols = rows[i].split(',')
      for (let j = 0; j < cols.length; j++) {
        matrixRetorno[i][j] = parseInt(cols[j])
      }
    }
    return matrixRetorno
  }

  const execCommand = (method, kernelSize, kernelFormat, iterations, retorno) => {
    return new Promise(resolve => {
      const cmd = 'sudo python3 retify.py ' + method.toString() + ' ' + kernelSize.toString() + ' ' + kernelFormat.toString() + ' ' + iterations.toString() + ' ' + retorno

      exec(
        cmd,
        {
          cwd: __dirname
        },
        (err, stdout, stderr) => {
          resolve(stdout)
        }
      )
    })
  }

  const [out2, out3, out4, out5] = await Promise.all([execCommand(method, kernelSize, kernelFormat, iterations, matrixToString(matrixC2)), execCommand(method, kernelSize, kernelFormat, iterations, matrixToString(matrixC3)), execCommand(method, kernelSize, kernelFormat, iterations, matrixToString(matrixC4)), execCommand(method, kernelSize, kernelFormat, iterations, matrixToString(matrixC5))])

  matrixRetornoC2 = processScriptReturn(out2)
  matrixRetornoC3 = processScriptReturn(out3)
  matrixRetornoC4 = processScriptReturn(out4)
  matrixRetornoC5 = processScriptReturn(out5)

  console.log('Matrix 1', matrixRetornoC2)
  console.log('Matrix 2', matrixRetornoC3)
  console.log('Matrix 3', matrixRetornoC4)
  console.log('Matrix 4', matrixRetornoC5)

  for (let lat = 0; lat < latitudesLength; lat++) {
    for (let long = 0; long < longitudesLength; long++) {
      for (let index = 0; index < dataArray.length; index++) {
        const element = dataArray[index]
        if (element.latitude == distinctLatitudes[lat] && element.longitude == distinctLongitudes[long]) {
          dataArray[index].c2 = Math.round(matrixRetornoC2[lat][long] / 50)
          dataArray[index].c3 = Math.round(matrixRetornoC3[lat][long] / 50)
          dataArray[index].c4 = Math.round(matrixRetornoC4[lat][long] / 50)
          dataArray[index].c5 = Math.round(matrixRetornoC5[lat][long] / 50)
        }
      }
    }
  }
  return ReS(res, dataArray, 200)
}
