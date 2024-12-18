<script setup>
	import CollapseSection from './CollapseSection.vue';
</script>

# Setting Up Airbattle

(Work in progress)

## Install NVM / Node.js

First, install NVM if you haven't already. See the instructions for your operating system below:

<CollapseSection title="Windows">
Download and run the latest <code>nvm-setup.exe</code> from nvm-windows <a href="https://github.com/coreybutler/nvm-windows/releases" target="_blank">here</a>.
</CollapseSection>
<br />
<CollapseSection title="Linux/macOS">
Run <code>curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash</code> in your terminal.

See full/updated instructions on <a href="https://github.com/nvm-sh/nvm#install--update-script" target="_blank">this page</a>.
</CollapseSection>

Now, install Node.js v12 by running the following commands:

```bash
nvm install 12
nvm use 12
```

## Clone the Repository and Setup

Clone this repository and its submodules, then navigate into the directory and begin setting up the environment:

```bash
git clone --recursive https://github.com/parsehex/airbattle-hosting
cd airbattle-hosting
npm install
```

Now, run the setup script to copy the needed files and proceed with the setup:

```bash
npm run setup
```

## Start the Server

To start the server, run:

```bash
npm run start
```

### Running Spatie Bots

You must run the bots separately for now. To start the bots, open a new terminal, navigate to the `airbattle-hosting` directory, and run:

```bash
npm run bots
```

Add `-- --num=` after the above to specify the number of bots to run. For example, to run 10 bots:

```bash
npm run bots -- --num=10
```

## Access the Game

You should be able to access the game at [`127.0.0.1:8000`](http://127.0.0.1:8000) in your browser.

## Troubleshooting

### `EADDRINUSE`

If you see an error like `EADDRINUSE: address already in use`, there might be instance(s) running in the background.

You can kill them by running one of the following commands:

<CollapseSection title="Windows">
<div class="language-powershell">
<pre>
<code>
Get-NetTCPConnection -LocalPort 3501,8000 | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
</code>
</pre>
</div>
</CollapseSection>

<CollapseSection title="Linux/macOS">
<div class="language-bash">
<pre>
<code>
kill -9 $(lsof -t -i:3501,8000)
</code>
</pre>
</div>
</CollapseSection>
