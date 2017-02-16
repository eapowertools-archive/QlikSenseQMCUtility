sc query "QlikEAPowerToolsServiceDispatcher"

IF %ERRORLEVEL% EQU 0 (GOTO END) ELSE (GOTO ADDSERVICE)

:ADDSERVICE
sc create QlikEAPowerToolsServiceDispatcher binPath= "%~1" DisplayName= "Qlik EAPowerTools Service Dispatcher" start= auto
sc description "QlikEAPowerToolsServiceDispatcher" "Service Dispatcher for running EA Powertools" 

sc start QlikEAPowerToolsServiceDispatcher

TIMEOUT /T 10

:END


