setlocal
set use_choco_curl=false
echo Checking dependencies . . .
if not exist "C:\Windows\System32\curl.exe" (
	echo cURL not found. Installing . . .
	choco install cURL -y
	set use_choco_curl=true
)
echo cURL exists . . .
start /B /WAIT "" "cmd.exe" "/c 'C:\ProgramData\chocolatey\bin\refreshenv.cmd'"
echo Deploying . . .
if %user_choco_curl%==[true] (
	start /B /WAIT "" "cmd.exe" "/c 'C:\ProgramData\chocolatey\bin\curl.exe'"
) else (
	start /B /WAIT "" "cmd.exe" "/c 'C:\Windows\System32\curl.exe'"
)
