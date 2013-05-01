mkdir output

del output\gvc.nw
del output\gvc.exe

cd ..\app

"C:\Program Files\WinRAR\winrar" a -r -afzip ..\build\output\gvc.nw .\*.*

cd ..\build

copy /y node-webkit\*.* output\

cd output

copy /y /b nw.exe+gvc.nw gvc.exe 

start gvc.exe

cd..
