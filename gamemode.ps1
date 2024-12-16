# TODO show current game mode
function Show-Menu {
	Clear-Host
	Write-Host "=== Game Mode Switcher ==="
	Write-Host "1: FFA"
	Write-Host "2: CTF"
	Write-Host "3: BTR"
	Write-Host "Q: Quit"
	Write-Host "=========================="
}

function Edit-EnvFile {
	param (
			[string]$gameMode
	)
	$gameModeLower = $gameMode.ToLower()
	$envPath = "$PSScriptRoot\ab-server\.env"
	if (Test-Path $envPath) {
			# Read the content of .env file
			$content = Get-Content $envPath
			$content = $content -replace "SERVER_TYPE=.*", "SERVER_TYPE=`"$gameMode`""
			$content = $content -replace "SERVER_ROOM=.*", "SERVER_ROOM=`"ab-$gameModeLower`""
			# Save changes
			$content | Set-Content $envPath
			Write-Host "Updated .env file with game mode: $gameMode"
	}
	else {
			Write-Host "Error: .env file not found at $envPath" -ForegroundColor Red
	}
}

function Edit-GamesJson {
	param (
			[string]$gameMode
	)
	$gamesJsonPath = "$PSScriptRoot\games.json"
	if (Test-Path $gamesJsonPath) {
			try {
					# Read and parse the JSON file
					$gamesConfig = Get-Content $gamesJsonPath -Raw | ConvertFrom-Json
					$gamesConfig[0].games[0].id = $gameMode + "1"
					$gamesConfig[0].games[0].nameShort = $gameMode + " #1"
					switch ($gameMode) {
							"FFA" {
									$gamesConfig[0].games[0].name = "Free For All #1"
									$gamesConfig[0].games[0].type = 1
							}
							"CTF" {
									$gamesConfig[0].games[0].name = "Capture The Flag #1"
									$gamesConfig[0].games[0].type = 2
							}
							"BTR" {
									$gamesConfig[0].games[0].name = "Battle Royale #1"
									$gamesConfig[0].games[0].type = 3
							}
					}
					# Save the modified JSON back to file
					"[$($gamesConfig | ConvertTo-Json -Depth 100)]" | Set-Content $gamesJsonPath
					Write-Host "Successfully updated games.json for $gameMode mode" -ForegroundColor Green
			}
			catch {
					Write-Host "Error updating games.json: $_" -ForegroundColor Red
			}
	}
	else {
			Write-Host "Error: games.json not found at $gamesJsonPath" -ForegroundColor Red
	}
}

# Main script
Show-Menu
$choice = Read-Host "Please make a selection"
switch ($choice) {
	"1" {
			$gameMode = "FFA"
	}
	"2" {
			$gameMode = "CTF"
	}
	"3" {
			$gameMode = "BTR"
	}
	"Q" {
			Write-Host "Exiting..."
			exit
	}
	default {
			Write-Host "Invalid selection. Exiting..." -ForegroundColor Red
			exit
	}
}

Edit-EnvFile -gameMode $gameMode
Edit-GamesJson -gameMode $gameMode
cd "$PSScriptRoot\ab-frontend"
npm run build
cd "$PSScriptRoot"
Write-Host "Game mode set to: $gameMode" -ForegroundColor Green
Start-Sleep -Seconds 2
