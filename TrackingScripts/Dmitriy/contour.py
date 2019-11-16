import numpy as np
import cv2 as cv


def get_contours(im):
	imgray = cv.cvtColor(im, cv.COLOR_BGR2GRAY)
	ret, thresh = cv.threshold(imgray, 200, 255, 0)
	contours, hierarchy = cv.findContours(thresh, cv.RETR_TREE, cv.CHAIN_APPROX_SIMPLE)
	result = []
	for cnt in contours:
		if 100 > cv.contourArea(cnt) > 6:
			result.append(cnt)
			return thresh, result
		

# im = cv.imread('test.jpg')
# contours = get_contours(im)

# for cnt in contours:
# 	# M = cv.moments(cnt)
# 	# cx = int(M['m10']/M['m00'])
# 	# cy = int(M['m01']/M['m00'])
# 	# cv.circle(thresh, (cx,cy), 1, color=(0,255,255), thickness=2, lineType=8, shift=0)
# 	# print(cx,cy)
# 	# print(cv.contourArea(cnt))	
# 	# cv.drawContours(thresh, [cnt], 0, (183,23,100), -1)
# for row in thresh:
# 	for i in range(len(row)):
# 		row[i] = 255

# cv.imshow('thresh', thresh)
# cv.waitKey(0)