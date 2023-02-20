from Peer2Peer.Nodes import Node

class Router(Node):
   
    def __init__(self, ip, port, name, conf):
        super().__init__(ip, port, name, conf)
    
    def main_loop(self):
        self.run()
