import socket

def main():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    s.sendto("GININHA".encode(), ("10.0.6.1", 23456))

if __name__ == "__main__":
    main()

