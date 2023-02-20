import logging
from random import randint
import threading
import pickle
import utils

from Utilities.VStream import VStream
from Utilities.Types import Types
from Utilities.RtpPacket import RtpPacket

class ServerWorker:
    
    state = Types.INIT
    client_Info = {}

    def __init__(self, info):
        # TODO tudo esta a ser limitado a um unico cliente
        #      não é suposto o self ser o cliente a quem está ligado
        #      porque assim so existe um
        #      devia ser um dicionario de keys(maybe ip) para clientes
        #      0 clientes nao se envia
        #      >0 ativar o envio mas em broadcast (parecido com o router)
        self.client_Info = info
        self.conn = info['Socket']

    def sendReply(self, code, seq):
        """Send Reply to the client"""
        if code == Types.OK_200:
            reply = 'RTSP/1.0 200 OK\nCSeq: ' + seq + '\nSession: ' + str(self.client_Info['session'])
            conn = self.client_Info['Socket']
            conn.sendto(pickle.dumps(reply),self.client_Info['PEER'])
        elif code == Types.FILE_NOT_FOUND_404:
            logging.error("404 NOT FOUND")
        elif code == Types.CON_ERR_500:
            logging.error("500 CONNECTION ERROR")

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
            utils.log("INF", "packets-have-all-been-sent")
        return packet.getPacket()

    def sendRTP(self):
        """Send RTP packets over UDP."""
        while True:
            self.client_Info['event'].wait(0.05)
            if self.client_Info['event'].isSet():
                break
            data = self.client_Info['VStream'].nextFrame()
            if data:
                frameN = self.client_Info['VStream'].frameNum()
                try:
                    self.client_Info['Socket_Video'].sendto(pickle.dumps(self.forgeRTP(data, frameN)),self.client_Info['PEER_VIDEO'])
                except:
                    logging.error("Connection Error - Server Worker")

    def setup(self, filename, seq, request):
        utils.log("STATE", "SETUP")
        try:
            # TODO parecido mas, em vez de se ir buscar ao cliente o que ele quer ver,
            #      começa-se o stream assim que o server inicia e os clientes
            #      é que se juntam à lista de quem está a ver
            self.client_Info['VStream'] = VStream(filename)
            utils.log("INF", f"file-has-been-sucessfully-read {filename}")
            self.state = Types.READY
        except IOError:
            self.sendReply(Types.FILE_NOT_FOUND_404, seq[1])
        self.client_Info['session'] = randint(100000, 999999)
        self.sendReply(Types.OK_200, seq[1])
        self.client_Info['rtpPort'] = int(request[2])

    def play(self, seq):
        utils.log("STATE", "PLAY")
        self.state = Types.PLAY_SW
        # TODO codigo repetido
        self.client_Info["Socket"] = self.conn
        self.sendReply(Types.OK_200, seq[1])
        # TODO why here? codigo repetido
        self.client_Info['event'] = threading.Event()
        # TODO nao devia ser feito aqui
        #      começa-se o stream assim que o server inicia e os clientes é que se juntam
        self.client_Info['worker'] = threading.Thread(target=self.sendRTP)
        self.client_Info['worker'].daemon = True
        self.client_Info['worker'].start()
        self.state = Types.PLAYING

    def pause(self, seq):
        utils.log("STATE", "PAUSE client")
        # TODO honestamente nem sei... suponho que se possa retirar o cliente da
        #      lista mas não se pode perder os dados dele
        self.state = Types.READY
        self.client_Info['event'].set()
        self.sendReply(Types.OK_200, seq[1])
        self.state = Types.READY

    def teardown(self, seq):
        utils.log("STATE", "TEARDOWN")
        # TODO retirar um cliente da lista
        self.sendReply(Types.OK_200, seq[1])
        self.state = Types.INIT

    def processRequest(self, data):
        request = data.split('\n')
        line1 = request[0].split(' ')
        rtype = line1[0]
        filename = line1[1]
        seq = request[1].split(' ')
        if rtype == Types.SETUP_SW:
            if self.state == Types.INIT:
                self.setup(filename, seq, request)
        elif rtype == Types.PLAY_SW:
                self.play(seq)
        elif rtype == Types.PAUSE_SW:
            if self.state == Types.PLAYING:
                self.pause(seq)
        elif rtype == Types.TEARDOWN_SW:
            self.teardown(seq)

    def recvRequest(self):
        conn = self.client_Info['Socket']
        # TODO conn apenas funciona para um unico cliente
        #      conn = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        #      conn.bind(('', self.port_video))
        while True:
            # TODO data, addressTup = conn.recvfrom(1024)
            #      addressTup contem (clientIp, clientPortNum) para a qual se responde
            data = conn.recv(1024)
            data = pickle.loads(data)
            if data and isinstance(data, str):
                utils.log("MSG", f"content: {data}")
                self.processRequest(data)

    def run(self):
        thread = threading.Thread(target=self.recvRequest)
        thread.daemon = True
        thread.start()
