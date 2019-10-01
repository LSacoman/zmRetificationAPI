const { to, ReE, ReS } = require('../services/util.service')
const os = require('os')
var path = require('path')

const Matrix = require('node-matrix')
var exec = require('child_process').exec

module.exports.retify = async (req, res) => {
  const distinct = (value, index, self) => {
    return self.indexOf(value) === index
  }

  const matrixToString = mat => {
    let result = ''
    for (let i = 0; i < mat.numRows; i++) {
      let position = i.toString()
      const element = mat[position]
      result += element
      result += i == mat.numRows - 1 ? '' : '-'
    }
    return result
  }

  method = req.body.method
  kernelSize = req.body.kernelSize
  kernelFormat = req.body.kernelFormat
  iterations = req.body.iterations
  data = req.body.dataset
  datasetFormat = req.body.datasetFormat
  outputFormat = req.body.outputFormat
  dataArray = []

  if (datasetFormat == 'object') {
    var objects = JSON.parse(data)
    objects.forEach((object, index) => {
      rowObject = {
        latitude: object.coordinates[0],
        longitude: object.coordinates[1],
        ponto: index,
        c2: object.data,
        c3: object.data2 != null ? object.data2 : 0,
        c4: object.data3 != null ? object.data3 : 0,
        c5: object.data4 != null ? object.data4 : 0
      }
      dataArray.push(rowObject)
    })
  } else {
    rows = datasetFormat == 'string' ? data.split(';') : data.split('\n')

    rows.forEach((row, index) => {
      properties = row.split(',')
      rowObject = {
        latitude: properties[0],
        longitude: properties[1],
        ponto: properties[2] != null ? properties[2] : index,
        c2: properties[3],
        c3: properties[4] != null ? properties[4] : 0,
        c4: properties[5] != null ? properties[5] : 0,
        c5: properties[6] != null ? properties[6] : 0
      }
      dataArray.push(rowObject)
    })
  }

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

  let matrixC2 = Matrix({
    rows: latitudesLength,
    columns: longitudesLength
  })
  let matrixC3 = Matrix({
    rows: latitudesLength,
    columns: longitudesLength
  })
  let matrixC4 = Matrix({
    rows: latitudesLength,
    columns: longitudesLength
  })
  let matrixC5 = Matrix({
    rows: latitudesLength,
    columns: longitudesLength
  })

  // Popula as Matrizes com os valores corretos nas posicoes corretas
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

  // processa os dados que retornam do script de retificacao
  const processReturnDataFromScript = values => {
    let matrixRetorno = Matrix({
      rows: latitudesLength,
      columns: longitudesLength
    })
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

  const execCommand = (id, method, kernelSize, kernelFormat, iterations, stringData) => {
    return new Promise(resolve => {
      const cmd = 'sudo python3 retify.py ' + id + ' ' + method.toString() + ' ' + kernelSize.toString() + ' ' + kernelFormat.toString() + ' ' + iterations.toString() + ' ' + stringData

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

  const [out2, out3, out4, out5] = await Promise.all([
    execCommand('c2', method, kernelSize, kernelFormat, iterations, matrixToString(matrixC2)),
    execCommand('c3', method, kernelSize, kernelFormat, iterations, matrixToString(matrixC3)),
    execCommand('c4', method, kernelSize, kernelFormat, iterations, matrixToString(matrixC4)),
    execCommand('c5', method, kernelSize, kernelFormat, iterations, matrixToString(matrixC5))
  ])

  matrixRetornoC2 = processReturnDataFromScript(out2)
  matrixRetornoC3 = processReturnDataFromScript(out3)
  matrixRetornoC4 = processReturnDataFromScript(out4)
  matrixRetornoC5 = processReturnDataFromScript(out5)

  // popula o objeto com as informações das ZMs retificadas
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

  if (outputFormat == 'image') {
    // TODO: verificar como fazer retornar uma imagem
    //res.set('Content-Type', 'image/png')
    //res.attachment(path.join(__dirname, 'original.png'))
    // res.attachment(path.join(__dirname, 'retificada.png'))
    // res.set('Content-Type', 'image/png')
    // res.setHeader('Content-disposition', 'attachment; filename=retificada.png')
    // res.end()
    res.set('Content-Type', 'image/png')
    return res.sendFile(path.join(__dirname, '../public/', 'original.png'))
  } else if (outputFormat == 'object') {
    return ReS(res, dataArray, 200)
  } else {
    let csv = ''
    for (let index = 0; index < dataArray.length; index++) {
      const object = dataArray[index]
      csv += `${object.latitude}, ${object.longitude}, ${object.ponto}, ${object.c2}, ${object.c3}, ${object.c4}, ${object.c5}\n`
    }
    res.setHeader('Content-disposition', 'attachment; filename=testing.csv')
    res.set('Content-Type', 'text/csv')
    return res.status(200).send(csv)
  }
}
