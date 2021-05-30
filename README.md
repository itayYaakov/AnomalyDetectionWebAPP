# Anomaly Detection Web Application

This web application detects any irregularities - abnormal data resources and report back to the user - all through your client's browser. 

It's target market is wide, and is not restricted only for analysts, for it's output is accessible and easy to read.

The app uses 2 csv files, one to register a normality, so we can detect what is not in line with this file's standard, and a second for the testing of the abnormalities.

After providing a second csv file meant for testing any anomalies there might be, the user will be able to select which detect mode he wants to perform, and what is the threshold for a line to be considered 'anomaly'.

## Preview 

![alt text](https://github.com/eladoni1/Pictures-for-WebAPP-Anomaly-Detector/blob/main/dashboard_darkmode.PNG?raw=true)


@@ need to ask for requirements - which installations (and check for their direct instructions)

### Requirements and installation

Before using this web app, and run the server for your clients, we will need the to install the following :

 - Node.js with the latest update through their [main website](https://nodejs.org/), and in linux through the terminal enter the ``` sudo apt install nodejs ``` command.
   
 - @@ more requirements here~
 


Up next, we will have to download the .ZIP file of the app, and extract. Go to the [repository's webpage](https://github.com/itayYaakov/AnomalyDetectionWebAPP), and follow the instructions :

1. Press the 'Code' tab, and press the 'download' button as shown below

![alt text](https://github.com/eladoni1/Pictures-for-WebAPP-Anomaly-Detector/blob/main/codeANDdownloadPressNumberedShorter.png?raw=true)

2. Go to the extraction folder, from there continue to 'backend' -> 'Server'.

3. Open the Command Prompt / Terminal -
 - Windows - Press the path-bar, and write down 'cmd', press enter and you'll be met with the Command Prompt to our directory.
 - Linux - Right-click on a free space within the folder, and select 'Open in Terminal'.

4. Type 'node FinalServer.js', and press enter.

The user will be then notified that the server is up and running. 

### Instructions

#### Connecting to the web app

After the server is running, you can enter from any web browser -

To enter as the host, simply type 'localhost:8080' to enter the app. It will automatically redirect you to the '/dashboard' page.


#### File & Settings selection 

(default test and train files were supplied for demonstration purposes)

In the webpage, we have the option to drag-and-drop the files we need to provide -

1. Select the train file in your computer, and drag into the 'train csv' box. (Alternative - choose it with 'Browse file' option)
   
   ![alt text](https://github.com/eladoni1/Pictures-for-WebAPP-Anomaly-Detector/blob/main/dragAndDropTrain.png?raw=true)
   
2. Now do the same with the test file - select the test file and drag  it into the 'test csv' box.

![alt text](https://github.com/eladoni1/Pictures-for-WebAPP-Anomaly-Detector/blob/main/dragAndDropTest.png?raw=true)
   
3. Drag and select your desired threshold level - as the threshold level grows higher, the requirement for correlation gets more demanding. The default threshold is 0,7.
   
4. Select your detection mode -
   
   a. Regression - detecting each anomaly with a linear approach to the correlating features. any pair of values that consist a point, and are further away from the calculated linear equation by a certain parameter - will be considered as an anomaly.
   
   b. Hybrid - changing its approach for the following criteria :
   1)  if the correlation of the said features is between 0,5 and our threshold input, it will change into a circular approach - any pair of values (from first and second features) that consist a point, and are further away from the center than the calculated radius - are considered anomaly.
   2)  if the correlation is equal OR higher than the input of the threshold - it will change into a linear approach as if it's the 'Regression' mode.

Without files or detection mode the program will not start. The user will be notified what files/parameters are missing.

### Results - Anomalies, Tables & Report history

Post-Analysis :

![alt text](https://github.com/eladoni1/Pictures-for-WebAPP-Anomaly-Detector/blob/main/dashboard_darkmode2.png?raw=true)

First we have to distinguish between the finds, and information on screen :

![alt text](https://github.com/eladoni1/Pictures-for-WebAPP-Anomaly-Detector/blob/main/historyReport.PNG?raw=true)

1) **The reports' history**
can be seen on the lower-left side of the web app. This will be kept up-to-date with any report we might add, and we can traverse between the old and new reports at any given moment. It provides the follows :

 - **Time stamp** - when did the analysis occur, and the time the server finished calculating its response.
   
 - **Algorithm & Threshold** - Algorithm being Regression (linear only), or Hybrid (both linear and circular approach), and the threshold, as received from the user.
   
 - **File names**.

![alt text](https://github.com/eladoni1/Pictures-for-WebAPP-Anomaly-Detector/blob/main/EXPLOREaNOMALIES.PNG?raw=true)

2) **The Explore Anomalies section**

above the history report, we can see the name of each feature and his significant other - his most correlated other feature. By pressing one of the options, we will be given information via graphs about the anomalies and the values of the said features.

![alt text](https://github.com/eladoni1/Pictures-for-WebAPP-Anomaly-Detector/blob/main/valuesOnGraph.PNG?raw=true)

3) **Graphs**
*Top graph* - displays train information (each row from .csv) of the 2 seleced features (from Explore Anomalies) (each feature has a differnt color)
*Bottom graph* - displays combined train informationof the 2 seleced features, with all anomalies points in red.
   - **Zoom** - You can zoom in/out to check points more cloesly. Just hover your cursor on said graph, and use  ``` MouseWheel Up/Down ``` and enjoy the view up close. You can also drag the cursor to a box shape, this will zoom the graph to the box.
   - **Tooltip** -  When hovering over a point, a tooltip pops up with the point value and label information.
   - **Disable/Enable** - You can disable a certein feature from the gaph by simply clicking it's squared colored label (top of the chart). That's makes it easier to watch one feature's behaviour along the graph.

![alt text](https://github.com/eladoni1/Pictures-for-WebAPP-Anomaly-Detector/blob/main/linearAndAnomalies.PNG?raw=true)

![alt text](https://github.com/eladoni1/Pictures-for-WebAPP-Anomaly-Detector/blob/main/dashboardTop.PNG?raw=true)

4) **Statistics**
at top of dashboard screen:
 - **Reports available** - How many previous reports/operations has the server processed and are avilable.
 - **Anomalies found** - How many anomalies features pairs are found in the the current selected report (Reports history section).
 - **Last report creation duration** - The time took (in milliseconds) between last report request until server response.
 - **Last report date** - data of last report.

![alt text](https://github.com/eladoni1/Pictures-for-WebAPP-Anomaly-Detector/blob/main/leftBar.PNG?raw=true)

5) **Left bar**
includes the switch between dark/light mode, the test table and train table for the current active report (includes the entire CSV file values and feature names), and a shrink button - reduces the size of the bar.

#### Packages, out source features and final notes

@@ NEED TO ADD EXAMPLE FOR EACH FEATURE

##### Using the API through code

The **httpRequests.log** file contains a detailed explanation on the API's requests and responses.
If the host wishes to use the API through code, check it out and start detecting anomalies in your CSV files!

@@ express
@@ node.js
@@ dark mode
![alt text](https://github.com/eladoni1/Pictures-for-WebAPP-Anomaly-Detector/blob/main/DarkMode.png?raw=true)
@@ graphs
![alt text](https://github.com/eladoni1/Pictures-for-WebAPP-Anomaly-Detector/blob/main/graphs.png?raw=true)
@@ css UI?
