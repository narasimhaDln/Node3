**_Real time file processing system_**
##objective
A backend system to simulate real time file processing system

### Main Features in this application

->New file every 3 seconds with unique name
->Secure random processing duration(1-6s)
->Logs all file transitions with timeStamps
->Warnings for long in_progress states
->Crashed files handled and logged
->Folder-based file status separation

## Folder structure

/Processing-Initial files
/In-Progress-Files being processed
/Completed-Successfully process files
/Crashed-Failed processes

## Logging Strategy

-logs.txt-logs all event with timestamps
-warnings if file in-progress >3s
-Errors if process exceeds 5s

### Libraries Used

fs-for file system operations
path-for cross-platform paths
crypto.randomInt()-secure random number generation(avoids Math.random)

###sample logs

[text](Completed/file_2025-5-14-12-28-24-647.txt)
[text](Completed/file_2025-5-14-12-28-27-648.txt)
[text](Completed/file_2025-5-14-12-28-30-650.txt)
[text](Completed/file_2025-5-14-12-28-42-683.txt)
[text](Completed/file_2025-5-14-12-28-48-691.txt)
[text](Completed/file_2025-5-14-12-28-51-703.txt)
[text](Completed/file_2025-5-14-12-28-57-707.txt) [text](Completed/

[2025-05-14T06:50:33.870Z]File created:file_2025-05-14T06-50-33-869Z.txt
[2025-05-14T06:50:33.979Z]In-Progress:file_2025-05-14T06-50-33-869Z.txt
[2025-05-14T06:50:33.980Z]WARNING:file_2025-05-14T06-50-30-862Z.txt still in progress after 3s
[2025-05-14T06:50:34.991Z]Completed:file_2025-05-14T06-50-33-869Z.txt
[2025-05-14T06:50:36.881Z]File created:file_2025-05-14T06-50-36-881Z.txt
[2025-05-14T06:52:41.449Z]File created:file_2025-05-14T06-52-41-446Z.txt
[2025-05-14T06:52:41.557Z]In-Progress:file_2025-05-14T06-52-41-446Z.txt
[2025-05-14T06:52:44.460Z]File created:file_2025-05-14T06-52-44-459Z.txt
[2025-05-14T06:52:44.566Z]WARNING:file_2025-05-14T06-52-41-446Z.txt still in progress after 3s
[2025-05-14T06:52:44.570Z]Completed:file_2025-05-14T06-52-41-446Z.txt
