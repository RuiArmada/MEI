import random
import string
import socket
import pickle

class Common:

    @staticmethod
    def get_random_string(length):    
        return ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))  

    @staticmethod    
    def get_ip():    
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)    
        s.settimeout(0)    
        try:    
            # doesn't even have to be reachable    
            s.connect(('10.254.254.254', 1))                                       
            IP = s.getsockname()[0]                                                
        except Exception:                                                          
            IP = '127.0.0.1'                                                       
        finally:                                                                   
            s.close()                                                              
        return IP
        
    @staticmethod    
    def is_pickle_stream(stream):
        try:
            pickle.loads(stream)
            return True
        except pickle.UnpicklingError:
            return False