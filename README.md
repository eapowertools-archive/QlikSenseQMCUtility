#QlikSenseQMCUtility    
A collection of management console utilities for use with Qlik Sense.

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

For a walkthrough of the installation process, please have a look at the install documentation here: **[Install Document](https://linktoInstallDocument)**

QMC Utilities may be installed by downloading the source from GitHub and running npm install.  However, some manual configuration of the config.js configuration file will be required before running if installed using this method.  **No documentation is provided for this method.**

##Plugins!
QMC Utilities uses a plugin architecture to instantiate the tools in the menu framework.

The initial release includes the following tools:

###Sheet Approver
The Sheet Approver enables users to approve published sheets in an app, thus, making them base sheets of the Qlik Sense application.  In addition, it's possible to un-approve sheets as well and push them back to the community.

![Sheet Approver](https://s3.amazonaws.com/eapowertools/qmcutilities/SheetApproverScreen.png)

To approve or un-approve sheets, qualifying items will have a clear checkbox.  Click the checkbox to activate and then select the appropriate approve or un-approve button that is relevant to the selections made.

-----

###Rule Manager
![Rule Manager](https://s3.amazonaws.com/eapowertools/qmcutilities/RuleManagerScreen.png)

The Rule Manager allows a Qlik Sense administrator to export and import security rules from the Qlik Sense repository.

To export rules, use the checkboxes to select the rules and click the Export button to create a formatted json file containing the rule information.

To import rules, click the import button to select a file and upload. 

![uploadFile](https://s3.amazonaws.com/eapowertools/qmcutilities/importRuleFile.png)

Then select the rules from the file to import into the repository.

![uploadedFile](https://s3.amazonaws.com/eapowertools/qmcutilities/uploadedRuleFile.png)

-----

###Custom Property Bulk Loader
The Custom Property Bulk Loader enables administrators to upload a list of values for managing custom properties without having to enter values manually.

![CustomPropLoader](https://s3.amazonaws.com/eapowertools/qmcutilities/CustomPropScreen.png)

The bulk loader is able to update existing custom properties, or create new custom properties for a Qlik Sense deployment.

Select a custom property or provide a name, select the resources the custom property will apply to, and upload a csv file with a single column list of values.  Once that's done click the Create or Update button and to add or modify the custom property.

-----

##Promotion
QMC Utilities is designed and developed by the EA Team at Qlik as part of the Powertools initiative. To learn more about EA Powertools and all the solutions we are building to enhance Qlik Sense, please visit the **[EA Powertools](https://community.qlik.com/community/qlik-sense/ea-powertools)** space on Qlik Community.

##License
EA Power Tools are a collection of software programs and methodologies for Qlik products. EA Power Tools and QMC Utilities are provided free of charge and are not supported by Qlik. EA Power Tools and QMC Utilities use Qlik APIs, but are open source solutions provided without warranty. Use of EA Power Tools and QMC Utilities is at your own risk.

For more information, please visit the **[EA Powertools](https://community.qlik.com/community/qlik-sense/ea-powertools)** space on Qlik Community.

##Issues
If you experience an issue, open an issue!  We want your feedback!  Open an issue here: **[Issues](https://github.com/eapowertools/QlikSenseQMCUtility/issues)**