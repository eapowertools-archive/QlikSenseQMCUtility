sc query "QlikEAPowerToolsServiceDispatcher"

IF %ERRORLEVEL% EQU 0 (GOTO END) ELSE (GOTO ADDSERVICE)

:ADDSERVICE
sc create QlikEAPowerToolsServiceDispatcher binPath= "%~1\PowerToolsServiceDispatcher\PowerToolsService.exe" DisplayName= "Qlik EAPowerTools Service Dispatcher" start= auto obj= %2 password= %3
sc description "QlikEAPowerToolsServiceDispatcher" "Service Dispatcher for running EA Powertools" 

:END


