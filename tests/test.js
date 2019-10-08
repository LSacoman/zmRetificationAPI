;(async () => {
  const axios = require('axios')
  // Make a request for a user with a given ID
  let url = 'http://18.229.147.63:5000/retify'

  let methods = ['median', 'open', 'close', 'openandclose']
  let kernelSizes = [3, 5, 7]
  let kernelFormats = ['cross', 'ellipse', 'rect']
  let iterations = [1, 2, 3, 4]
  let datasetFormat = 'csv'
  let outputFormat = 'csv'

  let dataset = `-53.570684808,-24.952417737,1,2,3,2,3
-53.570616162,-24.952485076,2,2,2,2,3
-53.570616162,-24.952417737,3,2,3,2,3
-53.570547517,-24.952619754,4,2,2,2,3
-53.570547517,-24.952552415,5,2,2,2,3
-53.570547517,-24.952485076,6,2,2,2,3
-53.570478871,-24.952687093,7,2,2,2,3
-53.570478871,-24.952619754,8,2,2,2,3
-53.570478871,-24.952552415,9,2,2,2,3
-53.570478871,-24.952485076,10,2,2,2,3
-53.570410226,-24.952754433,11,2,3,2,3
-53.570410226,-24.952687093,12,2,2,2,3
-53.570410226,-24.952619754,13,2,2,2,3
-53.570410226,-24.952552415,14,2,2,2,3
-53.570410226,-24.952485076,15,2,2,2,3
-53.570341581,-24.952821772,16,2,3,2,4
-53.570341581,-24.952754433,17,2,3,2,3
-53.570341581,-24.952687093,18,2,3,2,3
-53.570341581,-24.952619754,19,2,2,2,3
-53.570341581,-24.952552415,20,2,3,2,3
-53.570272935,-24.952956450,21,1,3,1,4
-53.570272935,-24.952889111,22,1,3,1,4
-53.570272935,-24.952821772,23,1,3,1,4
-53.570272935,-24.952754433,24,1,3,2,4
-53.570272935,-24.952687093,25,2,3,2,4
-53.570272935,-24.952619754,26,2,3,2,3`

  for (let i = 0; i < methods.length; i++) {
    const method = methods[i]
    for (let j = 0; j < kernelSizes.length; j++) {
      const kernelSize = kernelSizes[j]
      for (let k = 0; k < kernelFormats.length; k++) {
        const kernelFormat = kernelFormats[k]
        for (let w = 0; w < iterations.length; w++) {
          const iteration = iterations[w]
          let start_time = new Date().getTime()
          let result = await axios.post(url, {
            method,
            kernelSize,
            kernelFormat,
            iterations: iteration,
            datasetFormat,
            dataset,
            outputFormat
          })

          console.log(`method: ${method}, KernelSize: ${kernelSize}, KernelFormat: ${kernelFormat}, Iterations ${iteration}`)
          console.log('Time elapsed:', (new Date().getTime() - start_time) / 1000)
        }
      }
    }
  }
})()
