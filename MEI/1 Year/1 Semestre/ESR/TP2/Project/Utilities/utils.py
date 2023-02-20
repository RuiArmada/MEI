import datetime


def log(t, logMessage):
    if t == "MSG":
        lg = '; '.join(logMessage.split('\n'))
        print(f"{datetime.datetime.now()} [{t}] ->\n  {lg}\n")
    else:
        print(f"{datetime.datetime.now()} [{t}] ->\n  {logMessage}\n")