#QlikSenseQMCUtility    
A collection of management console utilities for use with Qlik Sense.

## Latest Release is [3.0.1](https://github.com/eapowertools/QlikSenseQMCUtility/releases/latest)

**[Latest Release Notes](https://github.com/eapowertools/QlikSenseQMCUtility/releases/latest)**

-----

##Introduction
QMC Utilities is an Express, AngularJs, and Node application for presenting management and administration capabilities in the Qlik Sense Platform that do not exist in the Qlik Management Console (QMC), but are possible through the APIs.

##Minimum Requirements
QMC Utilities requires the following environment to function properly:

* QMC Utilities ***must*** be installed on a server running Qlik Sense server software.
* Qlik Sense Enterprise 3.0 and higher **or** Qlik Analytics Platform 3.0 and higher.
* Qlik Sense service account for running the EAPowerTools service dispatcher.
* Ability to make requests to the Qlik Repository Service API on the Central Node using port 4242.
* An available port (by default port 9945) to connect to the QMC Utilities user interface.


##Installation

The ***preferred*** method for installing QMC Utilities is the installer found here: **[QMCUtilities.exe](https://s3.amazonaws.com/eapowertools/qmcutilities/QMCUtilities.exe)**.  The installer includes includes all node and bower modules and does not require the use of npm to install software.

For a walkthrough of the installation process, please have a look at the install documentation here: **[Install Document](https://github.com/eapowertools/QlikSenseQMCUtility/wiki/Installing-QMC-Utilities)**

QMC Utilities may be installed by downloading the source from GitHub and running npm install.  However, some manual configuration of the config.js configuration file will be required before running if installed using this method.  **No documentation is provided for this method.**

##Usage
After installing QMC Utilities, fire up a web browser and navigate to the hostname and port number specified in the install.  For example, if the Qlik Sense hostname is _sense3.112adams.local_, in the browser address bar enter **https://sense3.112adams.local:9945**.

##Plugins!
QMC Utilities uses a plugin architecture to instantiate the tools in the menu framework.  The following plugins have been developed by the EAPowertools team for use with QMC Utilities:

**[Sheet Approver](https://github.com/eapowertools/qmcu-sheet-approver#qmcu-sheet-approver)**: The Sheet Approver enables users to approve published sheets in an app, thus, making them base sheets of the Qlik Sense application.  In addition, it's possible to un-approve sheets as well and push them back to the community.

**[Rule Manager](https://github.com/eapowertools/qmcu-rule-manager#qmcu-rule-manager)**: The Rule Manager allows a Qlik Sense administrator to export and import security rules from the Qlik Sense repository.

**[Custom Property Bulk Loader](https://github.com/eapowertools/qmcu-custom-prop-loader#qmcu-custom-prop-loader)**: The Custom Property Bulk Loader enables administrators to upload a list of values for managing custom properties without having to enter values manually.

**[App Mover](https://github.com/eapowertools/qmcu-app-mover#qmcu-app-mover)**: This QMC Utilities plugin will allow users to export apps out of an environment and move them to other Qlik Sense environments.

**[Source Control Assistant](https://github.com/eapowertools/qmcu-sclite#qmcu-sclite)**: The Source Control Assistant is an application backup and restore solution for Qlik Sense.

##Promotion
QMC Utilities is designed and developed by the EA Team at Qlik as part of the Powertools initiative. To learn more about EA Powertools and all the solutions we are building to enhance Qlik Sense, please visit the **[EA Powertools](https://community.qlik.com/community/qlik-sense/ea-powertools)** space on Qlik Community.

##License

**[MIT](https://github.com/eapowertools/QlikSenseQMCUtility/blob/master/LICENSE)**

For more information, please visit the **[EA Powertools](https://community.qlik.com/community/qlik-sense/ea-powertools)** space on Qlik Community.

##Issues
If you experience an issue, open an issue!  We want your feedback!  Open an issue here: **[Issues](https://github.com/eapowertools/QlikSenseQMCUtility/issues)**
