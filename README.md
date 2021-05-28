# Anomaly Detection Web Application

This web application, as the name suggests, detecting any irregularities - abnormal data resources and report back to the user - all through your client's browser. 

It's target market is wide, and is not restricted only for analysts, for it's output is accessible and easy to read.

The app uses 2 csv files, one to register a normality, so we can detect what is not in line with this file's standard, and a second for the testing of the abnormalities.

After providing a second csv file meant for testing any anomalies there might be, the user will be able to select which detect mode he wants to perform, and what is the threshold for a line to be considered 'anomaly'.

## Preview 

![alt text](https://github.com/eladoni1/Pictures-for-WebAPP-Anomaly-Detector/blob/main/preview.png?raw=true)


@@ need to ask for requirements - which installations (and check for their direct instructions)

### Requirements and installation

Before using this web app, and run the server for your clients, we will need the to install the following :

 - Node.js with the latest update through their [main website](https://nodejs.org/), and in linux through the terminal enter the ``` sudo apt install nodejs ``` command.
   
 - @@ more requirements here~
 


Up next, we will have to download the .ZIP file of the app, and extract. Go to the [repository's webpage](https://github.com/itayYaakov/AnomalyDetectionWebAPP), and follow the instructions :

1. Press the 'Code' tab, and press the 'download' button as shown below

![alt text](https://github.com/eladoni1/Pictures-for-WebAPP-Anomaly-Detector/blob/main/codeANDdownloadPressNumbered.png?raw=true)

2. Go to the extraction folder, from there continue to 'backend' -> 'Server'.

3. Open the Command Prompt / Terminal -
 - Windows - Press the path-bar, and write down 'cmd', press enter and you'll be met with the Command Prompt to our directory.
 - Linux - Right-click on a free space within the folder, and select 'Open in Terminal'.

4. Type 'node FinalServer.js', and press enter.

You'll then be notified that the server is up and running. 

@@ again, need to activate the server once on my own..
### Instructions

#### Connecting to the web app

After the server is running, you can enter from any web browser -

To enter as the host, simply type 'localhost:8080' to enter the app.

@@ Can you enter as another PC on the network??


![alt text](https://github.com/eladoni1/Pictures-for-WebAPP-Anomaly-Detector/blob/main/webAdress.PNG?raw=true)


#### File & Settings selection 

(default test and train files were supplied for demonstration purposes)

In the webpage, we have the option to drag-and-drop the files we need to provide -

1. Select the train file in your computer, and drag into the 'train csv' box. (Alternative - choose it with 'Browse file' option)
   
   ![alt text](https://github.com/eladoni1/Pictures-for-WebAPP-Anomaly-Detector/blob/main/dragAndDropTrain.png?raw=true)
   
2. Now do the same with the test file - select the test file and drag  it into the 'test csv' box.

![alt text](https://github.com/eladoni1/Pictures-for-WebAPP-Anomaly-Detector/blob/main/dragAndDropTest.png?raw=true)
   
3. Drag and select your desired threshold level - as the threshold level grows higher, the requirement for correlation gets more demanding. The default threshold is 0,7.
   
4. Select your detection mode -
   
   a. Regression - detecting each anomaly with a linear approach to the correlating features - representing their correlation with a line, or linear equation.
   
   b. Hybrid - changing its presentation of correlation for the following criteria :
   1)  if the correlation of the said features is between 0,5 and our threshold input, it will represent the correlation in a circular approach.
   2)  if the correlation is equal OR higher than the input of the threshold - it will represent the correlation in a linear approach as if it's the 'Regression' mode

Without files or detection mode the program will not start. The user will be notified what files/parameters are missing.

#### Results - Anomalies, Tables & Report history

Analyze :

![alt text](https://github.com/eladoni1/Pictures-for-WebAPP-Anomaly-Detector/blob/main/BigAftermath.png?raw=true)

First we have to distinguish between the finds, and information on screen :

![alt text](https://github.com/eladoni1/Pictures-for-WebAPP-Anomaly-Detector/blob/main/historyReport.PNG?raw=true)

1) The reports' history - can be seen on the lower-left side of the web app. This will be kept up-to-date with any report we might add, and we can traverse between the old and new reports at any given moment. It provides the follows :

 - **Time stamp** - when did the analysis occur, and the time the server finished calculating its response.
   
 - **Algorithm & Threshold** - Algorithm being Regression (linear only), or Hybrid (both linear and circular approach), and the threshold, as received from the user.
   
 - **File names**.

![alt text](https://github.com/eladoni1/Pictures-for-WebAPP-Anomaly-Detector/blob/main/exploreAnomalies.PNG?raw=true)

2) The Explore Anomalies section - above the history report, we can see the name of each feature and his significant other - his most correlated other feature. By pressing one of the options, we will be given information via graphs about the anomalies and the values of the said features.

![alt text](https://github.com/eladoni1/Pictures-for-WebAPP-Anomaly-Detector/blob/main/valuesOnGraph.PNG?raw=true)

3) The value's graph - top graph, it presents the values of both features at every row of the input. 
   - **Zoom** - we can zoom in and out and check each value. Just hover your cursor on said graph, and use  ``` CTRL + MouseWheel Up ``` and enjoy the view up close.
   - **Points** -  when pointed at a spot on the graph, it will provide the feature name of the affiliated graph, and the value the point represents.
    
The graph also provides different colour for the two features selected, so it will become much easier to understand whose value is it.

![alt text](https://github.com/eladoni1/Pictures-for-WebAPP-Anomaly-Detector/blob/main/linearAndAnomalies.PNG?raw=true)

4) Anomalies & Linear/Circle graph - bottom graph, shows the line OR circle representing the correlation of both features. The red dots in the graph represent the anomalies, and we can point to figure out the exact value of that gone-rogue-row.

![alt text](https://github.com/eladoni1/Pictures-for-WebAPP-Anomaly-Detector/blob/main/dashboardTop.PNG?raw=true)

5) Anomaly/Report counters, Timer, and Last report - at the top of the screen, we can see 4 parameters -
 - **Reports available** - How many reports/operations have the server processed, and ready to give feedback on.
 - **Anomalies found** - How many anomalies found for the current report selected in the Reports' history section.
 - **Last report creation duration** - How much time (in milliseconds) it took for the last request and its operation to be processed by the server until response.
 - **Last report date**.

![alt text](https://github.com/eladoni1/Pictures-for-WebAPP-Anomaly-Detector/blob/main/leftBar.PNG?raw=true)

6) Left bar - includes the switch between dark/light mode, the test table and train table for the current active report (includes the entire CSV file values and feature names), and a shrink button - reduces the size of the bar.

#### Packages and out source features

@@ dark mode
@@ graphs
@@ css UI?
