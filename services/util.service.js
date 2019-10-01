const { to } = require('await-to-js')
const pe = require('parse-error')

module.exports.to = async promise => {
  let err, res
  ;[err, res] = await to(promise)
  if (err) return [pe(err)]

  return [null, res]
}

// Error Web Response
module.exports.ReE = function(res, err, code) {
  if (typeof err == 'object' && typeof err.message != 'undefined') err = err.message
  if (typeof code !== 'undefined') res.statusCode = code
  return res.json({ success: false, error: err })
}

// Success Web Response
module.exports.ReS = function(res, data, code) {
  let send_data = { success: true }

  if (typeof data == 'object') send_data = Object.assign(data, send_data)
  if (typeof code !== 'undefined') res.statusCode = code
  return res.json(send_data)
}

module.exports.SendCSV = (res, object) => {
  let csv = ''
  for (let index = 0; index < object.length; index++) {
    const object = object[index]
    csv += `${object.latitude}, ${object.longitude}, ${object.ponto}, ${object.c2}, ${object.c3}, ${object.c4}, ${object.c5}\n`
  }
  res.setHeader('Content-disposition', 'attachment; filename=testing.csv')
  res.set('Content-Type', 'text/csv')
  return res.status(200).send(csv)
}

module.exports.SendImage = (res, fullPath) => {
  // TODO: verificar como fazer retornar uma imagem
  //res.set('Content-Type', 'image/png')
  //res.attachment(path.join(__dirname, 'original.png'))
  // res.attachment(path.join(__dirname, 'retificada.png'))
  // res.set('Content-Type', 'image/png')
  // res.setHeader('Content-disposition', 'attachment; filename=retificada.png')
  // res.end()
  res.set('Content-Type', 'image/png')
  return res.sendFile(fullPath)
}

// TE stands for Throw Error
module.exports.TE = TE = function(err_message, log) {
  if (log === true) console.error(err_message)
  throw new Error(err_message)
}

module.exports.isAdmin = function() {}
