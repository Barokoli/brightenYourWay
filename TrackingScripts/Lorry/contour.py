import numpy as np
import cv2 as cv
im = cv.imread('test.jpg')

imgray = cv.cvtColor(im, cv.COLOR_BGR2GRAY)
ret, thresh = cv.threshold(imgray, 127, 255, 0)
contours, hierarchy = cv.findContours(thresh, cv.RETR_TREE, cv.CHAIN_APPROX_SIMPLE)

for row in thresh:
	for i in range(len(row)):
		row[i] = 255

for cnt in contours:
	if cv.contourArea(cnt) > 6:
		#print(cv.contourArea(cnt))
		rect = cv.minAreaRect(cnt)
		if (rect[1][0] > 20 or rect[1][1] <20) and (not(rect[0][0] < 30 or rect[0][1] >160 or rect[0][1]< 20)):
			cv.drawContours(thresh, [cnt], 0, (183,23,100), -1)
			print("size", rect[1], rect[0], rect[0][0]>30)
		#print("size", rect[1][1], rect[1][0], rect[0])
		box = cv.boxPoints(rect)
		box = np.int0(box)
		#cv.drawContours(thresh,[box],0,(183,23,255),1)
# for contour in contours:
# 	if
# image = cv2.circle(thresh, center_coordinates, radius, color, thickness=-1)

# print(contours[2])

cv.imshow('thresh', thresh)
cv.waitKey(0)
