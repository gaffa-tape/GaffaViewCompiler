mkdir output

del output\app.nw
del output\app.exe

cd ..\app

"C:\Program Files\WinRAR\winrar" a -r -afzip ..\build\output\app.nw .\*.*

cd ..\build

copy /y node-webkit\*.* output\

cd output

copy /y /b nw.exe+app.nw app.exe 

start app.exe E:\Development\estate-forms\public\views

cd..
