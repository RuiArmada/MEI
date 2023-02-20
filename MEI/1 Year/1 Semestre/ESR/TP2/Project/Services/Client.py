from pathlib import Path
from tkinter import *
from tkinter import messagebox
from PIL import Image, ImageTk
import socket, threading, os
import json
import pickle

from Utilities.RtpPacket import RtpPacket
from Utilities.utils import log
from Utilities.Types import Types
from Utilities.Common import Common
from Peer2Peer.Nodes import Node

class Client(Node):
 
    # Initiation..
    def __init__(self, master, ip, port, file, conf, name):
        super().__init__(ip,port,name,conf)
        self.master = master
        self.master.title(f"Client - " + name)
        self.master.protocol("WM_DELETE_WINDOW", self.handler)
        self.host_ip = ip
        self.peer_ip = json.loads(conf.get(name,"peers"))[0]
        self.port = int(port)
        self.port_video = int(port)+1
        self.filename = file
        self.sessionId = 0
        self.requestSent = -1
        self.teardownAcked = 0
        self.frameNbr = 0
        self.state = Types.INIT
        self.socket = None
        self.socket_video = None
        self.isNotInPause = True

    def main_loop(self):
        try:
            self.socket_video = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            self.socket_video.bind((self.host_ip, self.port_video))
            self.socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            log("CLI",f"client-address-else:  {self.host_ip}:{self.port}")
            log("CLI",f"client-address-video: {self.host_ip}:{self.port_video}")
            self.createWidgets()
        except Exception as e:
            self.terminate()
            print(e)
            messagebox.showerror('Failed', f'{e}')         

    def createWidgets(self):
        """Build GUI."""
        # Create Setup button
        self.setup = Button(self.master, width=20, padx=3, pady=3)
        self.setup["text"] = "Setup"
        self.setup["command"] = self.setupVid
        self.setup.grid(row=1, column=0, padx=2, pady=2)
        # Create Play button        
        self.start = Button(self.master, width=20, padx=3, pady=3)
        self.start["text"] = "Play"
        self.start["command"] = self.playVid
        self.start.grid(row=1, column=1, padx=2, pady=2)
        # Create Pause button
        self.pause = Button(self.master, width=20, padx=3, pady=3)
        self.pause["text"] = "Pause"
        self.pause["command"] = self.pauseVid
        self.pause.grid(row=1, column=2, padx=2, pady=2)
        # Create Teardown button
        self.teardown = Button(self.master, width=20, padx=3, pady=3)
        self.teardown["text"] = "Exit"
        self.teardown["command"] =  self.exitClient
        self.teardown.grid(row=1, column=3, padx=2, pady=2)

        # Create a label to display the movie
        self.label = Label(self.master, height=19)
        self.label.grid(row=0, column=0, columnspan=4, sticky=W+E+N+S, padx=5, pady=5) 
        self.master.mainloop()

    def setupVid(self):
        if self.state == Types.INIT:
            self.reciveResponse(self.sendRequest(Types.SETUP))
            self.state = Types.READY
            log("STATE", 'SETUP')

    def playVid(self):
        if self.state is Types.READY:
            thread = threading.Thread(target = self.receive)
            thread.daemon = True
            thread.start()
            self.reciveResponse(self.sendRequest(Types.PLAY))
            self.state = Types.PLAYING
            log("STATE", 'PLAY')

    def pauseVid(self):
        if self.state == Types.PLAYING:
            self.reciveResponse(self.sendRequest(Types.PAUSE))
            self.isNotInPause = False
            self.state = Types.READY
            log("STATE", 'PAUSE')

    def exitClient(self):
        if self.state != Types.INIT:
            self.reciveResponse(self.sendRequest(Types.TEARDOWN))
        self.teardownAcked = 1
        self.master.destroy()
        if os.path.isfile(Types.CACHE_FILE_NAME + str(self.sessionId) + Types.CACHE_FILE_EXT):
            os.remove(Types.CACHE_FILE_NAME + str(self.sessionId) + Types.CACHE_FILE_EXT)
        self.socket.close()
        self.state = Types.INIT
        log("STATE", 'TEARDOWN')

    def sendRequest(self,code:int):
        """Send RTSP request to the server."""
        if code == Types.SETUP:
            # REQUEST SETUP
            request = f"{Types.SETUP_SW};{str(self.sessionId)};{self.name};{self.filename};{str(self.port_video)}"
        elif code == Types.PLAY and self.state == Types.READY:
            # REQUEST PLAY
            request = f"{Types.PLAY_SW};{str(self.sessionId)};{self.name};{str(self.port_video)}"
        elif code == Types.PAUSE:
            # REQUEST PAUSE
            request = f"{Types.PAUSE_SW};{str(self.sessionId)};{self.name};{str(self.port_video)}"
        elif code == Types.TEARDOWN:
            # REQUEST TEARDOWN
            request = f"{Types.TEARDOWN_SW};{str(self.sessionId)};{self.name};{str(self.port_video)}"
        else:
            return None

        return request


    def reciveResponse(self, request):
        log("MSG", "data-sent: " + request)
        while True:
            data = self.socket.recv(1024)
            try:
                data = pickle.loads(data)
                auxData = data.split(';')
                if auxData[0] == self.name:
                    if auxData[1] == "200 OK":
                        self.sessionId = auxData[2]
                        return 0
                    else:
                        return -1
            except:
                pass
            self.socket.sendto(pickle.dumps(request), (self.peer_ip,self.port))

    def receive(self):
        """Listen for RTP replies from the server."""
        while True:
            data = bytearray()
            try:
                data = self.socket_video.recv(50000)
                if self.isNotInPause:
                    data = pickle.loads(data)
                    if data:
                        rtpPacket = RtpPacket()
                        rtpPacket.decode(data)
                        currFrameNbr = rtpPacket.getSeqN()

                        if currFrameNbr > self.frameNbr: # Discard the late packet
                            self.frameNbr = currFrameNbr
                            self.updateVid(self.writeFrame(rtpPacket.getPayload()))
            except:
                # Stop listening upon requesting PAUSE or TEARDOWN
                if self.teardownAcked == 1:
                    self.socket_video.shutdown(socket.SHUT_RDWR)
                    self.socket_video.close()
                    break
        
    def writeFrame(self, data):
        """Write the received frame to a temp image file. Return the image file."""
        cachename = Types.CACHE_FILE_NAME + str(self.sessionId) + Types.CACHE_FILE_EXT
        file = open(cachename, "wb")
        file.write(data)
        file.close()
        return cachename
    
    def updateVid(self, imageFile):
        """Update the image file as video frame in the GUI."""
        photo = ImageTk.PhotoImage(Image.open(imageFile),master=self.master)
        self.label.configure(image = photo, height=288) 
        self.label.image = photo

    def handler(self):
        """Handler on explicitly closing the GUI window."""
        self.pauseVid()
        exits = messagebox.askokcancel("Quit?","Are you sure you want to quit?")
        if exits:
            self.exitClient()
        else:
            self.playVid()