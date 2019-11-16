import cv2 as cv
import numpy as np
from contour import *

backSub = cv.createBackgroundSubtractorMOG2()
cap = cv.VideoCapture('/Users/home/Desktop/stuff/work/code/Junction/light-navigation/stick/output/output.avi')
fps = 60
frame_width = 110	
frame_height = 180
out_writer = cv.VideoWriter('/Users/home/Desktop/stuff/work/code/Junction/light-navigation/stick/output/output_processed.avi',
        cv.VideoWriter_fourcc('M','J','P','G'), 
        fps,
        (frame_width,frame_height))

i=0

object_y = 90
object_x = 100

while(i < 20*60):
	ret, new_frame = cap.read()
	# fgMask = backSub.apply(new_frame)
	imgray = cv.cvtColor(new_frame, cv.COLOR_BGR2GRAY)
	# ret,thresh = cv.threshold(imgray, 200, 255, cv.THRESH_BINARY)
	thresh, contours = get_contours(new_frame)
	object_x, object_y = get_new_cors(object_x, object_y, contours)
	for row in thresh:
		for i in range(len(row)):
			row[i] = 255
	cv.circle(thresh, (object_x, object_y), 1, color=(0,255,255), thickness=2, lineType=8, shift=0)
	cv.imshow('frame', thresh)
	cv.waitKey(0)

	out_writer.write(thresh)


	i += 1

out_writer.release()