import logging
import socket
import time
import pickle
from Utilities.utils import log
from Utilities.RtpPacket import RtpPacket

class VStream:
    
    def __init__(self, filename, peer_ip):
        self.filename = filename
        self.running = True
        self.discard = False
        self.peer_ip = peer_ip
        self.socket_video = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        try:
            self.file = open(filename, 'rb')
            log("INF", f"video-ready: {self.filename}")
        except:
            raise IOError
        self.frameN = 0
        
    def nextFrame(self):
        """Fetches the next frame"""
        data = self.file.read(5) # gets framelength from the first 5 bits
        if data:
            framelen = int(data)
            # Read current frame
            data = self.file.read(framelen)
            self.frameN += 1
        else:
            self.file.seek(0)
            data = self.file.read(5)
            if data:
                framelen = int(data)
                # Read current frame
                data = self.file.read(framelen)
                self.frameN = 1
        return data
    
    def frameNum(self):
        """Fetch frame number"""
        return self.frameN

    def stop(self):
        self.discard = True

    def cont(self):
        self.discard = False

    def terminate(self):
        self.running = False
        
    def run(self):
        """Send RTP packets over UDP."""
        while self.running:
            data = self.nextFrame()
            if data:
                frameN = self.frameNum()
                try:
                    self.socket_video.sendto(pickle.dumps(self.forgeRTP(data, frameN)),(self.peer_ip, 23457))
                except:
                    logging.error("Connection Error - Server Worker")
            time.sleep(0.05)

    def forgeRTP(self, payload, frameN):
        version = 2
        padding = 0
        extension = 0
        cc = 0
        marker = 0
        pt = 26 # MJPEG type
        seqN = frameN
        ssrc = 0
        packet = RtpPacket()
        packet.encode(
            version,
            padding,
            extension,
            cc,
            seqN,
            marker,
            pt,
            ssrc,
            payload
        )
        if seqN == 500:
            log("INF", "packets-have-all-been-sent")
        return packet.getPacket()