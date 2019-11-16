import cv2
import numpy as np

backSub = cv2.createBackgroundSubtractorMOG2()
cap = cv2.VideoCapture('/Users/home/Desktop/stuff/work/code/Junction/light-navigation/stick/output/output.avi')
fps = 60
frame_width = 110	
frame_height = 180
out_writer = cv2.VideoWriter('/Users/home/Desktop/stuff/work/code/Junction/light-navigation/stick/output/output_processed.avi',
        cv2.VideoWriter_fourcc('M','J','P','G'), 
        fps,
        (frame_width,frame_height))
i=0

def get_max_x(frame):
	window_size = 2
	frame_2d = np.sum(frame, 0)
	frame_1d = np.sum(frame_2d, 1)
	length = frame_1d.shape[0]
	window_sum = 0
	for i in range(window_size, length-window_size):
		cur_window = sum(frame_1d[i-window_size: i + window_size])
		if cur_window > window_sum:
			max_ind = i
			window_sum = cur_window
	print(max_ind)
# Setup SimpleBlobDetector parameters.
# params = cv2.SimpleBlobDetector_Params()
 
# # Change thresholds
# params.minThreshold = 220;
# params.maxThreshold = 255;
 
# # Filter by Area.
# params.filterByArea = True
# params.minArea = 20
 
# # Filter by Circularity
# params.filterByCircularity = True
# params.minCircularity = 0.1
 
# # Filter by Convexity
# params.filterByConvexity = True
# params.minConvexity = 0.87
 
# # Filter by Inertia
# params.filterByInertia = True
# params.minInertiaRatio = 0.01
# ver = (cv2.__version__).split('.')
# if int(ver[0]) < 3 :
#    detector = cv2.SimpleBlobDetector(params)
# else : 
#     detector = cv2.SimpleBlobDetector_create(params)
# ret, new_frame = cap.read()
while(i < 20*60):
	# old_drame = new_frame

	ret, new_frame = cap.read()
	get_max_x(new_frame)
	# diff = new_frame - old_drame
	fgMask = backSub.apply(new_frame)
	ret,thresh = cv2.threshold(new_frame, 200, 255,cv2.THRESH_BINARY)
	# if (i < 600):
	# 	cv2.imshow('10', thresh)
	# 	cv2.waitKey(0)
	# 	cv2.imwrite('test.jpg', thresh)
	# contours, hierarchy = cv2.findContours(thresh, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
	# print(len(contours))
	# out_writer.write(thresh)
	if (True):
		# keypoints = detector.detect(thresh)
		# print(keypoints)
		# # cv2.DRAW_MATCHES_FLAGS_DRAW_RICH_KEYPOINTS ensures the size of the circle corresponds to the size of blob
		# im_with_keypoints = cv2.drawKeypoints(fgMask, keypoints, np.array([]), (0,0,255), cv2.DRAW_MATCHES_FLAGS_DRAW_RICH_KEYPOINTS)
		out_writer.write(thresh)
		# cv2.imshow("Keypoints", im_with_keypoints)
		# cv2.waitKey(0)

		# cv2.imshow(f'frame{i}', thresh)
		# res = cv2.waitKey(0)
		# print(ret, i)
	i += 1

out_writer.release()