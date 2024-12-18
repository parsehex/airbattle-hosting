# Sharing Your Game Server Externally

In order to share your game server with others, you will need to expose it to the internet.

This guide is a work in progress showing how this can be done.

## Sign Up For Ngrok

1. Go to [ngrok.com](https://ngrok.com/) and sign up for an account.
2. After you verify your email, follow the instructions to download the ngrok client for your OS from the [download page](https://download.ngrok.com/).
   - First, follow the section to **Install**.
   - Next, follow the section **Configure and run** to login to your account using the `ngrok config` command.
3. After you have installed and configured ngrok, use this command to get a public URL for your server:
```bash
ngrok http 3501
```
4. Look for the `Forwarding` line in the output. You'll see a URL like `https://bb8f-2603-6011-6b40-20-2c82-f0a7-fcb2-7e35.ngrok-free.app`. This is the URL that you can share with others to join your server.
