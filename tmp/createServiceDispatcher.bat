sc query state=all | find "QlikEAPowerToolsServiceDispatcher"

IF %ERRORLEVEL% EQU 1
GOTO ADDSERVICE
ELSE
GOTO END

:ADDSERVICE
sc create QlikEAPowerToolsServiceDispatcher binPath= "%~1\PowerToolsServiceDispatcher\PowerToolsService.exe" DisplayName= "Qlik EAPowerTools Service Dispatcher" start= auto obj=%2 password=%3
sc description "QlikEAPowerToolsServiceDispatcher" "Service Dispatcher for running EA Powertools" 

:END
exit