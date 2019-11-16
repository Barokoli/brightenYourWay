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
		print(cv.contourArea(cnt))
		cv.drawContours(thresh, [cnt], 0, (183,23,100), -1)
# for contour in contours:
# 	if 
# image = cv2.circle(thresh, center_coordinates, radius, color, thickness=-1) 

# print(contours[2])

cv.imshow('thresh', thresh)
cv.waitKey(0)