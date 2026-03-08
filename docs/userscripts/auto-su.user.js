// ==UserScript==
// @name         Air-Battle Auto-SU
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Automatically log in as superuser in Air-Battle, remembering your password after the first successful login.
// @author       You
// @match        *://*.air-battle.net/*
// @match        *://localhost:*/*
// @match        *://127.0.0.1:*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let lastTypedPassword = '';
    let hasSentAutoLogin = false;
    let checkAttempts = 0;

    console.log("[Auto-SU] Userscript loaded, waiting for game initialization...");

    const checkReadyInterval = setInterval(() => {
        checkAttempts++;
        if (checkAttempts % 10 === 0) {
            console.log(`[Auto-SU] Still waiting. Attempt ${checkAttempts}. status:`, {
                Network: typeof window.Network,
                game: typeof window.game,
                Players: typeof window.Players,
                whisper: window.Players ? typeof window.Players.whisper : 'n/a'
            });
        }

        if (typeof window.Network !== 'undefined' && 
            typeof window.game !== 'undefined' && 
            typeof window.Players !== 'undefined' && 
            typeof window.Players.whisper === 'function') {
            
            clearInterval(checkReadyInterval);
            console.log("[Auto-SU] Ready to intercept chat and commands. Hooking Network.sendChat...");

            // 1. Hook into Network.sendCommand to catch when you manually type "/su password"
            const originalSendCommand = window.Network.sendCommand;
            window.Network.sendCommand = function(command, data) {
                console.log("[Auto-SU] Intercepted Network.sendCommand: " + command + " " + data);
                if (command === 'su' && data) {
                    lastTypedPassword = data.trim();
                    console.log("[Auto-SU] Captured manual SU password input.");
                }
                return originalSendCommand.apply(this, arguments);
            };

            console.log("[Auto-SU] Hooking Players.whisper...");
            
            // 2. Hook into Players.whisper to catch the server's message BEFORE it drops it
            const originalWhisper = window.Players.whisper;
            window.Players.whisper = function(msg) {
                // msg contains { from, to, text }
                if (msg && msg.text === 'You have superuser rights now.') {
                    console.log("[Auto-SU] Intercepted SU success message from server!");
                    
                    // Success! Save the password if we captured one manually.
                    if (lastTypedPassword) {
                        localStorage.setItem('airbattle_auto_su_password', lastTypedPassword);
                        console.log("[Auto-SU] Saved SU password to localStorage!");
                        lastTypedPassword = ''; // clear memory
                    } else {
                        console.log("[Auto-SU] Warning: Success msg seen, but no password was captured in lastTypedPassword.");
                    }
                }
                
                return originalWhisper.apply(this, arguments);
            };

            console.log("[Auto-SU] Starting background check for auto-login...");
            
            // 3. Auto-login loop for joining a new game
            const stateCheckInterval = setInterval(() => {
                if (window.game.state === window.Network.STATE.PLAYING && !hasSentAutoLogin) {
                    console.log("[Auto-SU] Game state -> PLAYING.");
                    hasSentAutoLogin = true;
                    
                    const savedPassword = localStorage.getItem('airbattle_auto_su_password');
                    if (savedPassword) {
                        console.log("[Auto-SU] Game connected, sending saved SU command...");
                        setTimeout(() => {
                            console.log("[Auto-SU] Executing stored password command (/su)...");
                            window.Network.sendCommand('su', savedPassword);
                        }, 1000);
                    } else {
                        console.log("[Auto-SU] No saved SU password found. Type '/su <password>' to save it.");
                    }
                } else if (window.game.state !== window.Network.STATE.PLAYING && hasSentAutoLogin) {
                    console.log("[Auto-SU] Game state disconnected. Resetting login tracker.");
                    // Reset flag if disconnected so we auto-login upon reconnecting
                    hasSentAutoLogin = false;
                }
            }, 500);

        }
    }, 500);

})();
