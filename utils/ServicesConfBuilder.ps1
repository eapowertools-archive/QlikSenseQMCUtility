$installParent = Get-Location
$installedProjects = Get-ChildItem -path $installParent | Where-Object{($_.PSIsContainer)} | foreach-object{$_.Name}
$count = 0

$intro = "This is the EAPowerTools services.conf update script.`n"
$intro += "This script will review installed PowerTools and add entries to the`n"
$intro += "services.conf file if applicable and if missing due to an upgrade of`n"
$intro += "Qlik Sense.`n`n"
$intro += "Press any key to begin the update."

Write-Host $intro
Write-Host "========================================================================"

$x = $Host.ui.RawUI.ReadKey("NoEcho,IncludeKeyDown")

Write-Host "========================================================================"
Write-Host


function getServiceDispatcherPath
{
    $Entry = Get-ChildItem "HKLM:\Software\Microsoft\Windows\CurrentVersion\Uninstall" -Recurse |
    ForEach-Object {Get-ItemProperty $_.pspath} | Where-Object {$_.DisplayName -eq "Qlik Sense Service Dispatcher"}

    return $Entry.InstallLocation + "servicedispatcher\services.conf"
}

$serviceDispatcherPath = getServiceDispatcherPath

Write-Host "The services.conf file resides at path: "$serviceDispatcherPath
Write-Host

function getConf
{
    param([string]$dir, [string]$app)
    #$dir = $args[0]
    #$app = $args[1]
    
    if(Test-Path "$dir\$app\config\services.conf.cfg")
    {
        $config = [IO.File]::ReadAllText("$dir\$app\config\services.conf.cfg")
        return $config
    }
}

Write-Host "Reviewing list of installed EAPowerTools"
Write-Host 
Write-Host "========================================================================"
 

forEach($appName in $installedProjects)
{
    Write-Host
    Write-Host $appName" is installed on this system."
    $appWithBracks = "\[$appName\]"
    #Write-Host $appWithBracks
    $configuredApps = Select-String -Path $serviceDispatcherPath -pattern $appWithBracks

    if(!$configuredApps)
    {
        Write-Host "Adding "$appName" configuration to services.conf."
        $conf = getConf $installParent $appName
        Add-Content $serviceDispatcherPath "`n$conf"
        $count++
    }
    else
    {
        Write-Host $appName" configuration exists in services.conf"
    }

    Write-Host
    Write-Host "========================================================================"

}

if($count -gt 0)
{
   
    Write-Host "Made $count updates to the services.conf."
    Write-Host "Stopping the Qlik Sense Service Dispatcher Service."
    Stop-Service -DisplayName "Qlik Sense Service Dispatcher"
    Write-Host
    Write-Host "========================================================================"

    Write-Host
    Write-Host "Starting the Qlik Sense Service Dispatcher Service."
    Start-Service -DisplayName "Qlik Sense Service Dispatcher"
}
else
{
   Write-Host
    Write-Host "No updates need to be made to the services.conf."
}