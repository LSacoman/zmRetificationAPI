import numpy as np
import sys
import cv2

#const cmd = 'sudo python3 retify.py ' + method.toString() + ' ' + kernelSize.toString() + ' ' + kernelFormat.toString() + ' ' + iterations.toString() + ' ' + retorno
formatedData = []
method = sys.argv[1]
kernelSize = sys.argv[2]
kernelFormat = sys.argv[3]
iterations = sys.argv[4]
dataArg = sys.argv[5]

dataRows = dataArg.split('-')
for row in dataRows:
	dataColumns = row.split(',')
	columnInt = []
	for column in dataColumns:
		columnInt.append(int(column))
	formatedData.append(columnInt)
	
data2 = 50 * np.array(formatedData, dtype=np.uint8)

if kernelFormat == 'rect':
	kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (kernelSize, kernelSize))
if kernelFormat == 'ellipse':
	kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (kernelSize, kernelSize))
if kernelFormat == 'cross':
	kernel = cv2.getStructuringElement(cv2.MORPH_CROSS, (kernelSize, kernelSize))

if method == 'median':
	result = cv2.medianBlur(data2, kernelSize)
if method == 'mode':
	result = cv2.medianBlur(data2, kernelSize)
if method == 'open':
	resulta = cv2.erode(data2, kernel, iterations = iterations)
	result = cv2.dilate(resulta, kernel, iterations = iterations)

retorno = list(np.asarray(result))

retornoString = ''
for x in retorno:
	xarray = list(np.asarray(x))
	retornoString = retornoString + str(xarray)

sys.stdout.write(retornoString)
