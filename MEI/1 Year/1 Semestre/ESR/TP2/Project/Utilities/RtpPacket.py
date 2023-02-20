from time import time

HEADER_SIZE = 12

class RtpPacket:
    
    header = bytearray(HEADER_SIZE)
    
    def __init__(self):
        pass

    def __repr__(self) -> str:
        return(f'RTPPacket({self.header}{self.payload})')
    
    def encode(
        self,
        version,
        padding,
        extension,
        cc,
        seqN,
        marker,
        pt,
        ssrc,
        payload
    ):
        """Encode the RTP packet with header fields and payload"""
        timestamp = int(time())
        header = bytearray(HEADER_SIZE)
        header[0] = (header[0] | version << 6) & 0xC0; # 2 bits
        header[0] = (header[0] | padding << 5);        # 1 bit
        header[0] = (header[0] | extension << 4);      # 1 bit
        header[0] = (header[0] | (cc & 0x0F));         # 4 bits
        header[1] = (header[1] | marker << 7);         # 1 bit
        header[1] = (header[1] | (pt & 0x7f));         # 7 bits
        header[2] = (seqN >> 8);
        header[3] = (seqN & 0xFF);
        header[4] = (timestamp >> 24);
        header[5] = (timestamp >> 16) & 0xFF;
        header[6] = (timestamp >> 8) & 0xFF;
        header[7] = (timestamp & 0xFF);
        header[8] = (ssrc >> 24);
        header[9] = (ssrc >> 16) & 0xFF;
        header[10] = (ssrc >> 8) & 0xFF;
        header[11] = ssrc & 0xFF
        # Set header and payload
        self.header = header
        self.payload = payload
        
    def decode(self, byteS):
        """Decode the RTP packet"""
        self.header = bytearray(byteS[:HEADER_SIZE])
        self.payload = byteS[HEADER_SIZE:]
        
    def getVersion(self):
        return int(self.header[0] >> 6)
    
    def getSeqN(self):
        seqN = self.header[2] << 8 | self.header[3]
        return int(seqN)
    
    def getTimeStamp(self):
        timestamp = self.header[4] <<24 | self.header[5] << 16 | self.header[6] << 8 | self.header[7]
        return int(timestamp)
    
    def getPT(self):
        pt = self.header[1] & 127
        return int(pt)
    
    def getPayload(self):
        return self.payload
    
    def getPacket(self):
        return self.header + self.payload