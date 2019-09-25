const { to, ReE, ReS } = require('../services/util.service')

const Matrix = require('node-matrix')
var exec = require('child_process').exec

module.exports.arrayToImage = async (req, res) => {
  const distinct = (value, index, self) => {
    return self.indexOf(value) === index
  }

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

  var matrix = Matrix({ rows: latitudesLength, columns: longitudesLength })

  for (let lat = 0; lat < latitudesLength; lat++) {
    for (let long = 0; long < longitudesLength; long++) {
      for (let index = 0; index < dataArray.length; index++) {
        const element = dataArray[index]
        if (element.latitude == distinctLatitudes[lat] && element.longitude == distinctLongitudes[long]) {
          matrix[lat][long] = parseInt(element.c5)
        }
      }
    }
  }

  let retorno = ''
  for (let i = 0; i < matrix.numRows; i++) {
    let teste = i.toString()
    const element = matrix[teste]
    retorno += element
    retorno += i == matrix.numRows - 1 ? '' : '-'
  }

  console.log(retorno)

  // const cmd = 'sudo comando1';

  // exec(cmd, {
  //   cwd: __dirname
  // }, (err, stdout, stderr) => {
  //   console.log(stdout);
  //   if (err) console.log(err);
  //   else runCommand(cmds, cb);
  // });
}
