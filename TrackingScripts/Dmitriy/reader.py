import cv2 as cv
import numpy as np
from contour import *

backSub = cv.createBackgroundSubtractorMOG2()
cap = cv.VideoCapture('output.avi')
fps = 60
frame_width = 110
frame_height = 180
out_writer = cv.VideoWriter('output_processed.avi',
        cv.VideoWriter_fourcc('M','J','P','G'),
        fps,
        (frame_width,frame_height))

i=0

object_y = 90
object_x = 100
searching = True
count = 0
while(i < 20*60):
    ret, new_frame = cap.read()
    # fgMask = backSub.apply(new_frame)
    imgray = cv.cvtColor(new_frame, cv.COLOR_BGR2GRAY)
    # ret,thresh = cv.threshold(imgray, 200, 255, cv.THRESH_BINARY)
    thresh, contours = get_contours(new_frame)
    object_x, object_y, final_cnt, lostTrack = get_new_cors(object_x, object_y, contours, searching)
    for row in thresh:
        for i in range(len(row)):
            row[i] = 255
    if lostTrack == False:
        tmpCnt = final_cnt
        cv.drawContours(thresh, [final_cnt], 0, (183,23,100), -1)
        searching = False
    elif searching == True:
        tmpCnt = final_cnt
        cv.drawContours(thresh, [final_cnt], 0, (183,23,100), -1)
        seraching = False
    elif count < 150:
        #cv.drawContours(thresh, [final_cnt], 0, (250,23,2), -1)
        cv.drawContours(thresh, [tmpCnt], 0, (183,23,100), -1)
        count += 1
    else:
        count = 0
        object_y = 90
        object_x = 100
        searching = True
        print("reset")

    #cv.circle(thresh, (object_x, object_y), 1, color=(0,255,255), thickness=2, lineType=8, shift=0)
    cv.imshow('frame', thresh)
    cv.waitKey(0)

    out_writer.write(thresh)


    i += 1

out_writer.release()
