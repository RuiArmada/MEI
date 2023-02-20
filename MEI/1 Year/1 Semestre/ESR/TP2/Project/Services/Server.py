import socket
import threading
import json
import pickle
from random import randint

from Peer2Peer.Nodes import Node
from Utilities.utils import log
from Utilities.VStream import VStream
from Utilities.Types import Types

class Server(Node):
    
    def __init__(self, ip, port, conf, filename):
        super().__init__(ip,port,"SERVER",conf)
        self.ip = ip
        self.port = int(port)
        self.conf = conf
        self.listStream = [filename]
        self.peer_ip = json.loads(conf.get("SERVER","peers"))[0]
        self.socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        self.serverDic = {}


    def main_loop(self):
        try:
            self.socket.bind((self.ip, self.port))
            log("SRV", f"server-connection-addr: " + self.ip + ":" + str(self.port))
        except Exception as e:
            self.terminate()
            log("ERR", f"error-message {e}")
            exit(1)

        log("SERVER", "server-started")
        while True:
            connection, addressTup = self.socket.recvfrom(1024)
            self.reciveConnection(connection)

        self.socket.close()


    def reciveConnection(self, conn):
        data = pickle.loads(conn)
        if data and isinstance(data, str):
            log("MSG", f"content: {data}")
            self.processRequest(data)

    def processRequest(self, data):
        try:
            request = data.split(';')
            rtype = request[0]
            seq = request[1]
            name = request[2]
            
            if rtype == Types.SETUP_SW:
                filename = request[3]
                if filename in self.listStream:
                    self.setup(filename, name)
            elif rtype == Types.PLAY_SW:
                self.play(seq, name)
            elif rtype == Types.PAUSE_SW:
                self.pause(seq, name)
            elif rtype == Types.TEARDOWN_SW:
                self.teardown(seq, name)
        except:
            pass

    def setup(self, filename, name):
        log("REQ", f"SETUP fileName: {filename}")

        streamDoesNotExist = True
        for streamSeq in self.serverDic.keys():
            if filename == self.serverDic[streamSeq]["file"]:
                seq = streamSeq
                if name not in self.serverDic[streamSeq]["init"]:
                    self.serverDic[streamSeq]["init"].append(name)
                streamDoesNotExist = False
                break

        if streamDoesNotExist:
            try:
                pv = VStream(filename, self.peer_ip)
                th = threading.Thread(target= pv.run)
                th.daemon = True
                seq = randint(100000, 999999)
                self.serverDic[seq] = {
                    "file": filename,
                    "thread": th.run(),
                    "state": Types.INIT,
                    "init": [name],
                    "pause": [],
                    "playing": []
                }
                log("INF", f"file-has-been-sucessfully-read {filename}")
            except IOError:
                log("ERR", f"cannot-read-file {filename}")
                self.sendReply(name, Types.FILE_NOT_FOUND_404, 0)

        self.sendReply(name, Types.OK_200, seq)

    def play(self, seq, name):
        log("REQ", "PLAY")
        if seq in self.serverDic.keys():
            if name in self.serverDic[seq]["init"]:
                self.serverDic[seq]["init"].remove(name)
                self.serverDic[seq]["playing"].append(name)
                self.sendReply(name, Types.OK_200, seq)
                if self.serverDic[seq]["state"] == Types.INIT:
                    self.serverDic[seq]["thread"].start()
                    self.serverDic[seq]["state"] = Types.PLAYING
            elif name in self.serverDic[seq]["pause"]:
                self.serverDic[seq]["pause"].remove(name)
                self.serverDic[seq]["playing"].append(name)
                self.sendReply(name, Types.OK_200, seq)
                if self.serverDic[seq]["state"] == Types.READY:
                    self.serverDic[seq]["thread"].cont()
                    self.serverDic[seq]["state"] = Types.PLAYING
            elif name in self.serverDic[seq]["playing"]:
                self.sendReply(name, Types.OK_200, seq)
            else:
                self.sendReply(name, Types.INV_OPERATION_300, seq)

    def pause(self, seq, name):
        log("REQ", "PAUSE")
        if seq in self.serverDic.keys():
            if name in self.serverDic[seq]["playing"]:
                self.serverDic[seq]["playing"].remove(name)
                self.serverDic[seq]["pause"].append(name)
                self.sendReply(name, Types.OK_200, seq)
                if self.serverDic[seq]["state"] == Types.PLAYING and len(self.serverDic[seq]["playing"]) == 0:
                    self.serverDic[seq]["thread"].stop()
            elif name in self.serverDic[seq]["pause"]:
                self.sendReply(name, Types.OK_200, seq)
            else:
                self.sendReply(name, Types.INV_OPERATION_300, seq)

    def teardown(self, seq, name):
        log("REQ", "TEARDOWN")
        if seq in self.serverDic.keys():
            if name in (self.serverDic[seq]["playing"]):
                self.serverDic[seq]["playing"].remove(name)
                self.serverDic[seq]["pause"].append(name)
                self.sendReply(name, Types.OK_200, seq)
                activeUsers = len(self.serverDic[seq]["playing"] + self.serverDic[seq]["pause"] + self.serverDic[seq]["init"])
                if self.serverDic[seq]["state"] == Types.PLAYING and activeUsers == 0:
                    self.serverDic[seq]["thread"].terminate()
            elif name not in self.serverDic[seq]["pause"] + self.serverDic[seq]["playing"] + self.serverDic[seq]["init"]:
                self.sendReply(name, Types.OK_200, seq)
            else:
                self.sendReply(name, Types.INV_OPERATION_300, seq)

    def sendReply(self, name, code, seq):
        """Send Reply to the client"""
        if code == Types.OK_200:
            reply = f"{name};200 OK;{seq}"
            self.socket.sendto(pickle.dumps(reply),(self.peer_ip, 23456))
            log("MSG", f"data-sent: {reply}")
        elif code == Types.FILE_NOT_FOUND_404:
            reply = f"{name};404 NOT FOUND;{seq}"
            self.socket.sendto(pickle.dumps(reply),(self.peer_ip, 23456))
            log("MSG", f"data-sent: {reply}")
        elif code == Types.CON_ERR_500:
            reply = f"{name};500 CONNECTION ERROR;{seq}"
            self.socket.sendto(pickle.dumps(reply),(self.peer_ip, 23456))
            log("MSG", f"data-sent: {reply}")
        elif code == Types.INV_OPERATION_300:
            reply = f"{name};300 INVALID OPERATION;{seq}"
            self.socket.sendto(pickle.dumps(reply),(self.peer_ip, 23456))
            log("MSG", f"data-sent: {reply}")