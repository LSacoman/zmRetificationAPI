import matplotlib.pyplot as plt
import numpy as np
import sys
from PIL import Image
import cv2

formatedData = []
dataArg = sys.argv[1]
dataRows = dataArg.split('-')
for row in dataRows:
	dataColumns = row.split(',')
	columnInt = []
	for column in dataColumns:
		columnInt.append(int(column))
	formatedData.append(columnInt)
	
data2 = 50 * np.array(formatedData, dtype=np.uint8)

kernel = np.ones((5, 5), np.uint8)
erosion = cv2.erode(data2, kernel, iterations=5)


#cv2.namedWindow('Imagem Original', cv2.WINDOW_NORMAL)
#cv2.imshow('Imagem Original', data2)
#cv2.imwrite('original.png', data2)
#cv2.namedWindow('Imagem Retificada', cv2.WINDOW_NORMAL)
#cv2.imshow('Imagem Retificada', erosion)
#cv2.imwrite('retificada.png', erosion)
#cv2.waitKey(0)
#cv2.destroyAllWindows()
retorno = list(np.asarray(erosion))


retornoString = ''
for x in retorno:
	xarray = list(np.asarray(x))
	retornoString = retornoString + str(xarray)


sys.stdout.write(retornoString)
