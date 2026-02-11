# Refresh PATH so npm is available (needed if terminal was open before Node was installed)
$env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")
Set-Location $PSScriptRoot
npm run dev
