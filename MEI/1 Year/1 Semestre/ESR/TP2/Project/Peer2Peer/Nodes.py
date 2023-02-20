import hashlib
import pickle
import threading
import socket
import time
import json
from configparser import ConfigParser

from Utilities.Common import Common

class Node(threading.Thread):
    
    lock = threading.RLock()
    ip: str
    port: int
    name: str
    conf: ConfigParser
    cache: list
    sockets: dict 

    def __init__(self, ip = None, port = 23456, name = None, conf = None):
        super(Node, self).__init__()
        self.ip = ip # Common.get_random_string(8) if ip is None else ip
        self.port = int(port)
        self.name = name
        self.conf = conf
        self.sockets = {}
        self.cache = []
        self.cache_video = []
        self.terminate_event = threading.Event()
        self.delays = self.conf.get(name,"delay") # list of all the delays that each interface of the node has
        self.neighbours_addressList = [] # list of all addresses connect to this node
        self.interfaces_addressList = [] # list of all of this node's interfaces
        self.neighbours_addressList = list(map(self.add_port,json.loads(self.conf.get(name,"peers")))) # list of all addresses neighbouring this node
        self.interfaces_addressList = list(map(self.add_port,json.loads(self.conf.get(name,"interfaces")))) # list of all address interfaces for this node
        self.neighbours_address_list_video = list(map(self.add_port_video,json.loads(self.conf.get(name,"peers")))) # list of all addresses neighbouring this node
        self.interfaces_address_list_video = list(map(self.add_port_video,json.loads(self.conf.get(name,"interfaces")))) # list of all address interfaces for this node
        self.id = hashlib.sha256(str(self.ip).encode() + str(self.port).encode()).hexdigest()[:16]
        print("CREATED: Node with Id %s\n" %(self.id))
        
    def add_port(self, address):
        return (str(address),int(self.port))
    def add_port_video(self, address):
        return (str(address),int(self.port)+1)

    def getNAddr(self):
        return len(self.interfaces_addressList)

    def getNIAddr(self):
        return len(self.neighbours_addressList)

    def get_socket_if_cs(self):
        if len(self.sockets.items()) != 1:
            raise Exception("Node %s has %d peers" %(self.id, self.getNAddr()))
        else:
            for _, socket in self.sockets.items():
                return socket

    def start_listening(self):
        print("\nNode %s listening on %d interfaces" %(self.id, self.getNAddr()))
        for address in self.interfaces_addressList:
            soc = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            print("Node %s listening on %s:%d" %(self.id, address[0], address[1]))
            soc.bind(address)
            self.sockets[address] = soc

    def start_listening_video(self):
        print("\nNode %s listening on %d interfaces" %(self.id, self.getNAddr()))
        for address in self.interfaces_address_list_video:
            soc = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            print("Node %s listening on %s:%d" %(self.id, address[0], address[1]))
            soc.bind(address)
            self.sockets[address] = soc

    def unicast_monit(self, data, address):
        conn = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        for delay in self.delays:
            if delay == 0:
                conn.sendto(data[0], address)
                conn.close()
                print("Unicasting to %s" % (address[0]))

    def unicast(self, data, address):
        conn = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        conn.sendto(data[0], address)
        conn.close()
        print("Unicasting to %s" % (address[0]))
           
    def multicast_monit(self, data):
        print("\nMulticasting message to %d nodes" % (self.getNAddr()))
        for address in self.neighbours_addressList:
            for delay in self.delays:
                if address[0] != data[1][0] and delay == "0":
                    self.unicast(data, address)
           
    def multicast(self, data):
        print("\nMulticasting message to %d nodes" % (self.getNAddr()))
        for address in self.neighbours_addressList:
            if address[0] != data[1][0]:
                self.unicast(data, address)
                
    def multicast_video_monit(self, data):
        print("\nMulticasting video to %d nodes" % (self.getNAddr()))
        for address in self.neighbours_address_list_video:
            for delay in self.delays:
                if address[0] != data[1][0] and delay == "0":
                    self.unicast(data, address)

    def multicast_video(self, data):
        print("\nMulticasting video to %d nodes" % (self.getNAddr()))
        for address in self.neighbours_address_list_video:
            if address[0] != data[1][0]:
                self.unicast(data, address)    
    
    def terminate(self):
        self.terminate_event.set()
        print("\nNode %s:%d terminated" %(self.ip, self.port))

    def run(self):
        print("Node with id %s running" %self.id)
        print(f"\n\n {self.delays}")
        self.start_listening()
        self.start_listening_video()
        self.receive()
        time.sleep(0.01)
        while not self.terminate_event.is_set():
            time.sleep(1)
            self.lock.acquire()
            self.cache = []
            self.lock.release()
            pass
        self.fullStop()          
                    
    def fullStop(self):
        print("\nNode stopping...")
        for sock in self.sockets.values():
            sock.close()
        print("\nNode stopped") 
    
    def handle_receive(self, socket, bytes = 1024):
        while not self.terminate_event.is_set():
            data = socket.recvfrom(bytes) # 20480 bytes max ((package, (ip, port))
            cached = pickle.loads(data[0])
            self.lock.acquire()
            #if True:
            if cached not in self.cache:
                self.cache.append(cached)
                self.lock.release()
                # print("\nReceived: %s from Node %s:%d" % (data[0],data[1][0],data[1][1]))
                self.multicast(data)
            else:
                self.lock.release()
                return

    def handle_receive_video(self, socket, bytes = 1024):
        while not self.terminate_event.is_set():
            data = socket.recvfrom(bytes) # 20480 bytes max ((package, (ip, port))
            cached = pickle.loads(data[0])
            self.lock.acquire()
            #if True:
            if cached not in self.cache_video:
                self.cache_video.append(cached)
                self.lock.release()
                # print("\nReceived: %s from Node %s:%d" % (data[0],data[1][0],data[1][1]))
                self.multicast_video(data)
            else:
                self.lock.release()
                return
     
    def receive(self):
        for address,sock in self.sockets.items():
            if int(address[1]) == int(self.port):
                t1 = threading.Thread(target=self.handle_receive, args=(sock,1024))
                t1.daemon = True
                t1.start()
            else:
                t2 = threading.Thread(target=self.handle_receive_video, args=(sock,50000))
                t2.daemon = True
                t2.start()                  