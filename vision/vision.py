
import cv2
import numpy as np

earth = {
'P1':[[37,39,28,34], [126,45,54,47]],
'P2':[[37,39,26,57], [126,45,55,51]],
'P3':[[37,39,9,99], [126,46,2,23]],
'P4':[[37,39,27,47], [126,46,1,13]],
'P5':[[37,39,12,98], [126,46,10,98]],
}

picture = {
'P1':[160, 300],
'P2':[338, 390],
'P3':[2214, 1640],
'P4':[829, 205],
'P5':[2841, 986],
}

def changeCoord(earth):
	return earth[0] + earth[1] / 60.0 + earth[2] / 60.0 / 60.0 + earth[3] / 60.0 / 60.0 / 60.0

points = ['P1', 'P2', 'P3', 'P4', 'P5']

for key in points:
	earth[key][0] = changeCoord(earth[key][0])
	earth[key][1] = changeCoord(earth[key][1])

earth_points = []
picture_points = []

cnt = 0;

for key in points:
	if cnt != 1 and cnt != 3:
		earth_points.append(earth[key])
		picture_points.append(picture[key])
	cnt += 1

earth_points = np.array(earth_points, np.float32)
picture_points = np.array(picture_points, np.float32)

print earth_points
print
print picture_points
print

matrix = cv2.getAffineTransform(earth_points, picture_points)

print matrix
print

for key in points:
	a = np.array([earth[key]], np.float32)
	a = np.array([a])
	print a
	print cv2.transform(a, matrix)

print
print 37.6579361 * (-272357.9612914) + (126.76522064 * 331551.87774443) - 31772648.23497085
