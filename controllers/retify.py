import numpy as np
import sys
import cv2

#const cmd = 'sudo python3 retify.py ' + method.toString() + ' ' + kernelSize.toString() + ' ' + kernelFormat.toString() + ' ' + iterations.toString() + ' ' + retorno
formatedData = []
identifier = sys.argv[1]
method = sys.argv[2]
kernelSize = sys.argv[3]
kernelFormat = sys.argv[4]
iterations = sys.argv[5]
dataArg = sys.argv[6]

dataRows = dataArg.split('-')
for row in dataRows:
	dataColumns = row.split(',')
	columnInt = []
	for column in dataColumns:
		columnInt.append(int(column))
	formatedData.append(columnInt)
	
data2 = 50 * np.array(formatedData, dtype=np.uint8)

cv2.imwrite('../public/original' + identifier + '.png', data2)

if kernelFormat == 'rect':
	kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (int(kernelSize), int(kernelSize)))
if kernelFormat == 'ellipse':
	kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (int(kernelSize), int(kernelSize)))
if kernelFormat == 'cross':
	kernel = cv2.getStructuringElement(cv2.MORPH_CROSS, (int(kernelSize), int(kernelSize)))

if method == 'median':
	result = cv2.medianBlur(data2, int(kernelSize))
if method == 'mode':
	result = cv2.medianBlur(data2, int(kernelSize))
if method == 'open':
	resulta = cv2.erode(data2, kernel, iterations = int(iterations))
	result = cv2.dilate(resulta, kernel, iterations = int(iterations))
if method == 'close':
	resulta = cv2.dilate(data2, kernel, iterations = int(iterations))
	resulta = cv2.erode(result, kernel, iterations = int(iterations))	
if method == 'openandclose':
	resulta = cv2.erode(data2, kernel, iterations = int(iterations))
	resultb = cv2.dilate(resulta, kernel, iterations = int(iterations))
	resultc = cv2.dilate(resultb, kernel, iterations = int(iterations))
	result = cv2.erode(resultc, kernel, iterations = int(iterations))	


cv2.imwrite('../public/retificada-' + method + '-' + kernelsize + '-' + kernelFormat + '-' + iterations + '-' + identifier + '.png', result)
#cv2.namedWindow('Imagem Original', cv2.WINDOW_NORMAL)
#cv2.imshow('Imagem Original', data2)
#cv2.namedWindow('Imagem Retificada', cv2.WINDOW_NORMAL)
#cv2.imshow('Imagem Retificada', result)
#cv2.waitKey(0)
#cv2.destroyAllWindows()


retorno = list(np.asarray(result))

retornoString = ''
for x in retorno:
	xarray = list(np.asarray(x))
	retornoString = retornoString + str(xarray)

sys.stdout.write(retornoString)
