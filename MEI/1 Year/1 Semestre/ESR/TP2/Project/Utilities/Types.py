class Types:
    
    """ 
        Diferent types of message used by the application
    """
    
    INIT = 0
    READY = 1
    PLAYING = 2
    
    SETUP = 0
    PLAY = 1
    PAUSE = 2
    TEARDOWN = 3
    
    CACHE_FILE_NAME = "cache-"
    CACHE_FILE_EXT = ".jpg"
    
    SETUP_SW = 'SETUP'
    PLAY_SW = 'PLAY'
    PAUSE_SW = 'PAUSE'
    TEARDOWN_SW = 'TEARDOWN'
    
    OK_200 = 0
    FILE_NOT_FOUND_404 = 1
    CON_ERR_500 = 2
    INV_OPERATION_300 = 3
    