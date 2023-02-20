import configparser
import argparse
from tkinter import Tk
import os


from Services.Client import Client
from Services.Server import Server
from Services.Router import Router

from Utilities.Common import Common

def printConf(config) :
    for section_name in config.sections():
        print('Section: ', section_name)
        print('Nodes: ', config.options(section_name))
        for key,value in config.items(section_name):
            print('     {} = {}'.format(key,value))
        print()

def loadConf(filename):
    config = configparser.ConfigParser()
    config.read(filename)
    return config

def keyFromVal(file, val, tp):
    for key, value in file.items(tp):
        if value == val:
            return key
        
def main(args):
    print('\nWelcome to our Streaming Service\n')
    
    port = args.port
    ip   = Common.get_ip()
    boot = args.config
    type_ = args.type
    # path = args.paths
    file = args.file
    
    conf = loadConf(boot)
    # paths = loadConf(path)
    name = args.name
    # ssIP = conf.get('SERVER','SERVER')

    if os.environ.get('DISPLAY','') == '':
        os.environ.__setitem__('DISPLAY', ':0.0')
    
    app = None

    if type_ == "c":
        name = keyFromVal(conf, ip, 'Client').upper()
        root = Tk()
        app = Client(root, ip, port, file, conf, name)
        print(f"#### CLIENT {name} ####\n")
    elif type_ == "s":
        app = Server(ip, port, conf, file)
        print("#### SERVER ####\n")
    elif type_ == "r":
        app = Router(ip, port, name, conf)
        print(f"#### ROUTER {name} ####\n")
    else:
        print("Invalid type")
        exit(1)
    app.main_loop()
    
if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('port', action='store',
                        help='port to be connected')
    parser.add_argument('type', action='store',choices=['c','r','s'], default='r', help='c: client, s: server')
    parser.add_argument('--config', action='store',
                        default="Config/MainTopo/Bootstrap.ini", help='The configuration file.')
    # parser.add_argument('--paths', action='store',
    #                   default="Config/MainTopo/Paths.ini", help='The paths file.')
    parser.add_argument('-f', '--file', action='store',default='movie.mjpeg', help='File to be broadcasted')
    parser.add_argument('name', nargs='?',default=None, action='store', help='Media Name')
    args = parser.parse_args()
    
    main(args)
