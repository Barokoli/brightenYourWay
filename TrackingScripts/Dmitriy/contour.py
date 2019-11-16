import numpy as np
import cv2 as cv


def get_contours(im):
	imgray = cv.cvtColor(im, cv.COLOR_BGR2GRAY)
	ret, thresh = cv.threshold(imgray, 200, 255, 0)
	contours, hierarchy = cv.findContours(thresh, cv.RETR_TREE, cv.CHAIN_APPROX_SIMPLE)
	result = []
	for cnt in contours:
		rect = cv.minAreaRect(cnt)
		#if (100 > cv.contourArea(cnt) > 6) and (rect[1][0] > 20 or rect[1][1] < 20) and (not(rect[0][0] < 30 or rect[0][1] >160 or rect[0][1]< 20)):
		if cv.contourArea(cnt) > 1:
			result.append(cnt)
	return thresh, result
		

def get_first_center(im):
	origin_y = 90
	origin_x = 100
	hresh, result = get_contours(im)
	for cnt in contours:
		M = cv.moments(cnt)
		cx = int(M['m10']/M['m00'])
		cy = int(M['m01']/M['m00'])

def get_new_cors(rfx, rfy, contours):
	dist = float("inf")
	for cnt in contours:
		M = cv.moments(cnt)
		cx = int(M['m10']/M['m00'])
		cy = int(M['m01']/M['m00'])
		curr_dist = (cx-rfx)**2 + (cy-rfy)**2
		if curr_dist < dist:
			dist = curr_dist
			result = (cx,cy)
	return result

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