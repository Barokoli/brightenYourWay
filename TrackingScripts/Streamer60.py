import numpy as np
import atexit
import sys
import cv2
import time
from rabbitmq import Subscriber
import Vtt60Processed.Sample as Vtt60Processed


class Streamer60():
    def __init__(self,url='10.84.110.2',topic='radar60',only_latest=False):

        fps = 60
        frame_width = 110
        frame_height = 180
        self.out_writer = cv2.VideoWriter('/Users/home/Desktop/stuff/work/code/Junction/light-navigation/stick/output/output.avi',
        cv2.VideoWriter_fourcc('M','J','P','G'), 
        fps,
        (frame_width,frame_height))

        self.url = url
        self.topic = topic
        self.only_latest = only_latest
        self.samples_in_total = 0
        self.fps = 30
        self.startTime = time.time()
        cv2.namedWindow('junction',cv2.WINDOW_NORMAL)

        # connect to RabbitMQ topic
        self.subscriber = Subscriber(self.url)
        self.subscriber.subscribe(self.topic, self.process_sample, only_latest=self.only_latest)
        atexit.register(self.exit)
        try:
            self.subscriber.run()
        except KeyboardInterrupt:
            pass
            
    def deserialize_vtt_60_processed(self,sample):
        """Deserialize raw data and config dictionary. 
        Return None is case of failure"""
        try:
            deserialized_sample = Vtt60Processed.Sample.GetRootAsSample(sample, 0)
        except Exception:
            return None
        sample_dict = {}
        sample_dict['amplitude']  = deserialized_sample.AmplitudeAsNumpy()
        sample_dict['angle'] = deserialized_sample.AngleAsNumpy()
        self.samples_in_total += 1
        return sample_dict

    def process_sample(self, ch, method, properties, body):
        """Process a single sample from radar"""

        # data inside a dictionary
        # {'amplitude':[1.3,4.4,5...],
        # 'angle': [0.04,0.1,...]}
        sample_dict = self.deserialize_vtt_60_processed(body)
        if body is None or sample_dict is None:
            print('Stream stopped.')
            return
        if self.samples_in_total % self.fps == 0:
            endTime = time.time()
            print('FPS: {:.1f}'.format(self.fps/(endTime - self.startTime)))
            self.startTime = endTime
        
        # your code here
        amplitude = sample_dict['amplitude']
        amplitude = np.reshape(amplitude,(180,110))
        amplitude = np.where(amplitude>130,130,amplitude)
        amplitude = np.uint8(255*amplitude/130)
        out = cv2.cvtColor(amplitude,cv2.COLOR_GRAY2BGR)
        # out = cv2.applyColorMap(out,cv2.COLORMAP_MAGMA)
        self.out_writer.write(out)
        cv2.imshow('junction',out)
        cv2.waitKey(10)



    def exit(self):
        """Perform actions before exit"""
        self.out_writer.release()
        cv2.destroyAllWindows()
        print("Exiting..")

def main():
    """Start Streamer"""
    viewer = Streamer60()

if __name__ == '__main__':
    main()
