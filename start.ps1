try {
	$nodeVersion = node -v
	if ($nodeVersion -notmatch "v12") {
		nvm use 12
	}

	Write-Host "Starting frontend..."
	$frontendJob = Start-Job -ScriptBlock {
		Set-Location -Path "$using:PSScriptRoot\ab-frontend"
		npm start 2>&1 | ForEach-Object {
			$_ -replace '^\(node:\d+\) \[DEP\d+\] DeprecationWarning:.*$', ''
		}
	}

	Write-Host "Starting server..."
	$serverJob = Start-Job -ScriptBlock {
		Set-Location -Path "$using:PSScriptRoot\ab-server"
		# Load environment variables from .env.server
		Get-Content "$using:PSScriptRoot\.env.server" | ForEach-Object {
			if ($_ -match '^\s*([^#\s]+)\s*=\s*(.+?)\s*$') {
				$key = $matches[1].Trim()
				$value = $matches[2].Trim()

				# Remove surrounding quotes (both single and double)
				if ($value -match '^["''](.*)[""'']$') {
					$value = $matches[1]
				}

				# Handle empty values
				if ($value -eq '""' -or $value -eq "''") {
					$value = ""
				}

				# Expand environment variables in the value
				$value = [System.Environment]::ExpandEnvironmentVariables($value)

				[System.Environment]::SetEnvironmentVariable($key, $value)
			}
		}
		npm start 2>&1 | ForEach-Object {
			$_ -replace '^\(node:\d+\) \[DEP\d+\] DeprecationWarning:.*$', ''
		}
	}

	# Wait for server to be ready by monitoring its output
	Write-Host "Waiting for server to be ready..."
	$serverReady = $false
	$maxAttempts = 30  # Maximum number of attempts (30 seconds)
	$attempts = 0

	while (-not $serverReady -and $attempts -lt $maxAttempts) {
		$serverOutput = Receive-Job -Job $serverJob -Keep
		if ($serverOutput) {
			# Filter out empty lines and deprecation warnings
			$serverOutput = $serverOutput | Where-Object { $_ -and -not ($_ -match '^\(node:\d+\) \[DEP\d+\]') }
			if ($serverOutput) {
				# Write-Host "Server output: $serverOutput"
				# Adjust this pattern based on what your server outputs when ready
				if ($serverOutput -match "listening|started|ready") {  # Add more patterns if needed
					$serverReady = $true
					Write-Host "Server is ready!"
				}
			}
		}

		if (-not $serverReady) {
			$attempts++
			Write-Host "Waiting for server... (Attempt $attempts of $maxAttempts)"
			Start-Sleep -Seconds 1
		}
	}

	if (-not $serverReady) {
		throw "Server failed to start after $maxAttempts seconds"
	}

	Write-Host "Starting bots..."
	$botsJob = Start-Job -ScriptBlock {
		Set-Location -Path "$using:PSScriptRoot\ab-bot"
		$cmd = "dist/app.js --ws=ws://127.0.0.1:3501 --num=12 --type=distribute --character=Aggressive --flag=rainbow"
		Start-Process -FilePath "node" -ArgumentList $cmd -Wait
	}

	# Monitor all jobs
	while ($true) {
		$allJobs = @($frontendJob, $serverJob, $botsJob)

		foreach ($job in $allJobs) {
			$output = Receive-Job -Job $job -Keep
			if ($output) {
				$output = $output | Where-Object { $_ -and -not ($_ -match '^\(node:\d+\) \[DEP\d+\]') }
				if ($output) {
					# Write-Host "[$($job.Name)] $output"
				}
			}
		}

		# Check if any job has failed
		if ($allJobs.State -contains "Failed") {
			throw "One or more jobs have failed"
		}

		# Check if all jobs are complete
		if ($allJobs.State -notcontains "Running") {
			break
		}

		Start-Sleep -Seconds 1
	}
}
catch {
	Write-Error "An error occurred: $_"
}
finally {
	# Clean up jobs
	Remove-Job -Job $frontendJob, $serverJob, $botsJob -Force -ErrorAction SilentlyContinue
}
