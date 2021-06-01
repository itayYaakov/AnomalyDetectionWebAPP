# Anomaly Detection Web Application

A Single-Page Web Application, built using JavaScript for frontend and backend (Node.Js).

In the app you can upload .csv files and detect any irregularities - abnormal data resources and report back to the user - all through the client's browser. 

In order to use the app you simply need:
Node.Js installed
Browser (or another http client)
And 2 csv files (1st one for normal data, so we can detet the standarts, and a 2nd one for the testing of the abnormalities)
That's All!

## Preview 
Desktop:  
<p align="center">
  <img width="700" src="https://user-images.githubusercontent.com/35079630/120120094-e4f4a380-c1a3-11eb-9263-769d02df3f7d.png">  
</p>
Mobile support:  
<p align="center">
  <img width="700" height="600" alt="MobileSupport" src="https://user-images.githubusercontent.com/35079630/120120046-aeb72400-c1a3-11eb-92b6-4ef58903e6ee.png">
</p>



@@ need to ask for requirements - which installations (and check for their direct instructions)

### Requirements and installation

Before using this web app, and run the server for your clients, we will need the to install the following :

 - Node.js with the latest update through their [main website](https://nodejs.org/), and in linux through the terminal enter the ``` sudo apt install nodejs ``` command.
 


Up next, clone this repository or download the .ZIP file of the app, and extract. Go to the [repository's webpage](https://github.com/itayYaakov/AnomalyDetectionWebAPP), and follow the instructions :

1. Press the 'Code' tab, and press the 'download' button as shown below  
<img width="400" src="https://github.com/eladoni1/Pictures-for-WebAPP-Anomaly-Detector/blob/main/codeANDdownloadPressNumberedShorter.png">

2. Go to the extraction folder, from there continue to 'backend' -> 'Server'.

3. Open the Command Prompt / Terminal -
 - Windows - Press the path-bar, and write down 'cmd', press enter and you'll be met with the Command Prompt to our directory.
 - Linux - Right-click on a free space within the folder, and select 'Open in Terminal'.

4. Type 'node FinalServer.js', and press enter.  
<img width="500" src="https://github.com/eladoni1/Pictures-for-WebAPP-Anomaly-Detector/blob/main/cmdPressEnter2.PNG">

The user will be then notified that the server is up and running. 

### Instructions

#### Connecting to the web app

After the server is running, you could connect to the site via any browser on your netowrk (including mobile and other laptops) -

To enter as the host, simply type 'localhost:8080' (or <host_ip>:8080 on other clients) to enter the app. It will automatically redirect you to the homepage.


#### File & Settings selection 

(default test and train files were supplied for demonstration purposes)

In the webpage, we have the option to drag-and-drop the files we need to provide -

1. Select the train file in your computer, and drag into the 'train csv' box. (Alternative - choose it by clicking 'Browse file' button)  
   <p align="center">
     <img width="400" src="https://github.com/eladoni1/Pictures-for-WebAPP-Anomaly-Detector/blob/main/dragAndDropTrain.png">
   </p>
   
2. Now do the same with the test file - select the test file and drag  it into the 'test csv' box.  
   <p align="center">
     <img width="400" src="https://github.com/eladoni1/Pictures-for-WebAPP-Anomaly-Detector/blob/main/dragAndDropTest.png">
   </p>
   
3. Drag and select your desired threshold level - as the threshold level grows higher, the requirement for correlation gets more demanding. The default threshold is 0.7.
   
4. Select your detection mode -
   
   a. Regression - detecting each anomaly with a linear approach to the correlating features. any pair of values that consist a point, and are further away from the calculated linear equation by a certain parameter - will be considered as an anomaly.
   
   b. Hybrid - changing its approach for the following criteria :
   1)  if the correlation of the said features is between 0,5 and our threshold input, it will change into a circular approach - any pair of values (from first and second features) that consist a point, and are further away from the center than the calculated radius - are considered anomaly.
   2)  if the correlation is equal OR higher than the input of the threshold - it will change into a linear approach as if it's the 'Regression' mode.

Without files or detection mode the program will not start. The user will be notified what files/parameters are missing.

### Results - Anomalies, Tables & Report history

Post-Analysis :
<p align="center">
  <img width="900" height="500" src="https://github.com/eladoni1/Pictures-for-WebAPP-Anomaly-Detector/blob/main/dashboard_darkmode2.png">
</p>
First we have to distinguish between the finds, and information on screen :  
<img width="506"src="https://user-images.githubusercontent.com/35079630/120120830-a01f3b80-c1a8-11eb-81eb-006b5fb36499.png">  

1) **The reports' history**
can be seen on the lower-left side of the web app. This will be kept up-to-date with any report we might add, and we can traverse between the old and new reports at any given moment. It provides the follows :

 - **Time stamp** - Timestamps for client sending request and client receiving response
   
 - **Algorithm & Threshold** - The user selected Threshold and Algorithm (Regression (linear only), or Hybrid (linear & circle))
   
 - **File names**.

2) **The Explore Anomalies section**
![alt text](https://github.com/eladoni1/Pictures-for-WebAPP-Anomaly-Detector/blob/main/EXPLOREaNOMALIES.PNG?raw=true)
A drop-down list of all the features that has a correlated feature. The small text specifies the other most correlated feature.
When selecting a pair of features from this list - the graphs will be updated accordingly.

3) **Graphs**  
<p align="center">
  <img width="600" height="300" src="https://github.com/eladoni1/Pictures-for-WebAPP-Anomaly-Detector/blob/main/valuesOnGraph.PNG">
  <img width="600" height="300" src="https://github.com/eladoni1/Pictures-for-WebAPP-Anomaly-Detector/blob/main/linearAndAnomalies.PNG">
</p>

*Top graph* - displays train information (each row from .csv) of the 2 seleced features (from Explore Anomalies) (each feature has a differnt color)  
*Bottom graph* - displays combined train informationof the 2 seleced features, with all anomalies points in red.
   - **Zoom** - You can zoom in/out to check points more cloesly. Just hover your cursor on said graph, and use  ``` MouseWheel Up/Down ``` and enjoy the view up close. You can also drag the cursor to a box shape, this will zoom the graph to the box.
   - **Tooltip** -  When hovering over a point, a tooltip pops up with the point value and label information.
   - **Disable/Enable** - You can disable a certein feature from the gaph by simply clicking it's squared colored label (top of the chart). That's makes it easier to watch one feature's behaviour along the graph.

4) **Statistics**
![alt text](https://github.com/eladoni1/Pictures-for-WebAPP-Anomaly-Detector/blob/main/dashboardTop.PNG?raw=true)
at top of dashboard screen:
 - **Reports available** - How many previous reports/operations has the server processed and are avilable.
 - **Anomalies found** - How many anomalies features pairs are found in the the current selected report (Reports history section).
 - **Last report creation duration** - The time took (in milliseconds) between last report request until server response.
 - **Last report date** - data of last report.

5) **Navigation bar**  
   <img width="151" src="https://user-images.githubusercontent.com/35079630/120120612-f8edd480-c1a6-11eb-92a1-a7f991473aa1.png">  
   **Pages** Links to Dashboard (homepage), Train table and Test Table.
   Since this is a Single page app - click a page won't refresh the site - it will simply replace the page main content with the new page content (that the client asks from the server)
   **Switch** between dark/light mode.  
   **Shrink button** - reduces the size of the bar.
   
5) **Tables - Train and Test**  
   <img src="https://user-images.githubusercontent.com/35079630/120120721-cee8e200-c1a7-11eb-8cc1-9d3d99fd92bf.png">  
   In each table page - there's a responsive view of the .csv data (the tables content changes upon selecting different report item in Reports History)  
   Features: sort by column, search, go to a specifc page, change column width  
   
#### Packages, out source features and final notes

#### Project video
[here](https://youtu.be/xyScTK9mcMw)

##### Using the API through code

The **httpRequests.log** file contains a detailed explanation on the API's requests and responses.
If the host wishes to use the API through code, check it out and start detecting anomalies in your CSV files!

response from the server [javascript object] : 

{
    "id" : 128782175,
    "anomalies" : [
    {
        "col_1" : "A",
        "col_2" : "B",
        "data" : [1, 2, 3, 5, 8, 9, ...]
    },
    {
        "col_1" : "C",
        "col_2" : "D",
        "data" : [10, 11, 12, ...]
    },
    ...
    ]
}

3rd party libraries:  
dark-mode-switch - enables the switch to dark mode button  
SB Admin 2 4.0.5 - theme  
Graphs - (1) *chart.js* - and (2) *chartjs-plugin-zoom* - enable **zoom** in chart.js  
Tables - grid.js  
jquery framework  
bootstrap - responsive site across different views  
bootstrap-select - upgraded select element  
font-awesome - icons  
Express - web application framework  



