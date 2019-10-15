module.exports.ParseObject = data => {
  let dataArray = []
  let objects = JSON.parse(data)
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
  return dataArray
}
module.exports.ParseString = data => {
  let dataArray = []
  rows = data.split(';')

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
  return dataArray
}

module.exports.ParseCSV = data => {
  let dataArray = []
  rows = data.split('\n')

  rows.pop()
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
  return dataArray
}
