This is an expansion on what I've been working on for about a year: making modern-day Airmash more accessible for more players to enjoy and hack on.

<div class="callout main-game">
  <h4>Play on the tried-and-true battleground at:</h4>
  <a href="https://airmash.rocks" class="btn btn-secondary">airmash.rocks</a>
</div>

<div class="info-grid">
<div class="left-column">

<div class="action-buttons">
	<a href="https://game.air-battle.net" class="btn btn-primary" style="display:flex;justify-content:space-between; align-items: center;">
		<span>#CTF&nbsp;A-B</span>
		<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
	</a>
	<ServerStatus />
	<hr />
	<a href="https://docs.air-battle.net" class="btn btn-secondary">
		Docs
	</a>
</div>

</div>
<div class="right-column">

<details>
<summary>What is this?</summary>

The goal with `Air-Battle` is to combine and modernize the parts that make up modern-day Airmash:

- [`airmash-frontend`](https://github.com/airmash-refugees/airmash-frontend) by [airmash-refugees](https://github.com/airmash-refugees/airmash-frontend)
	- Fork: [ab-frontend](https://github.com/parsehex/ab-frontend)
- [`ab-server`](https://github.com/wight-airmash/ab-server) by [wight-airmash](https://github.com/wight-airmash)
	- Fork: [ab-server](https://github.com/parsehex/ab-server)
- [`AB-bot`](https://github.com/spatiebot/ab-bot) by [spatiebot](https://github.com/spatiebot)
	- Fork: [ab-bot](https://github.com/parsehex/ab-bot)

Full A-B project: [`parsehex/airbattle-hosting`](https://github.com/parsehex/airbattle-hosting)

Read more here: [About Air-Battle](https://docs.air-battle.net/about)
</details>

<details>
<summary>Differences I can think of</summary>

- Air-Battle uses [Spatie Bots](https://github.com/parsehex/ab-bot), which act differently and can be updated more easily
- Quick Respawn hotkey: press `Shift` + (`1` - `5`) to respawn as a specific ship
- SuperUsers (admin) are tagged visually for all players
- Better reconnecting
	- Past chat messages are kept
	- Can try to Reconnect again after 3s
- Admin(s) can use `/update` to update the server + restart if needed and `/bots` to change bot settings
- Bots strategize between `#capture` and `#defend` depending on score + flag-passing on their own
- Bot carriers pass the flag to teammates
	- A Heli bot will seek and drop to a Goli
	- Non-Goli bot carriers will drop to a player (fly on top of one)
- Ship icons when you press `Tab` to know what you're up against
- Click to switch players in spectate mode
</details>

<details>
<summary>My changes hope-list</summary>

- Browser Extension
	- See the player and teams counts + score
	- Leaderboard?
	- View live chat (guest chat ?)
- Easier to host servers with instrtuctions/docs
	- Server Directory ?
	- Single Player / Desktop mode
		- Blegh Electron ikik but no one has to use it, ignore the scientist in jurassic park.
- I'd love to bring back the modding scene of the early days
	- Mod API to hook into the game
	- Directory of mods (maybe installable- I think that's literally XSS tho)
- Bot updates
	- Would love bots to strategize more
	- Better situational awareness 🤞
- More public spaces
	- Ways to chat on the site itself
		- Chat feed (+ player list?) on home/game page ?
	- Public ban logs (+ appeals ?)
- Seasons or other time-based rankings/changes
</details>

<details>
<summary>My level of commitment</summary>

I keep coming back to this game over the years so there's some longevity to my interest, but I'm sorting out my messy life and mostly just need somewhere to be me during that.

I can't / won't promise to work on things for the game beyond what I choose to do. I need an outlet that I'm hoping this will be, but I finally got a start doing web-dev work so `A-B` isn't my only focus (though I hope they're symbiotic for my mental health's sake).

That said, I need to practice putting stuff down so I'm going to intentionally go at my own pace / slow.
</details>

<details>
<summary>This is clunky / off-putting</summary>

Yep it is, which I like! Airmash's place is solid and that should stay true -- this will be a bit opinionated and not for everyone. I hope that my work can be helpful to the main game but I have no control over that.

I'm working on this because I want a space of my own to hang out and build on. I like the game enough to keep playing alone but I welcome anyone that wants to come along for the ride.

Airmash felt like it had a "thing" about it and I want to continue the same spirit; this is my stab at that.
</details>

<details>
<summary>To wight</summary>

First thing I want to say is that I continue to admire the gargantuan codebase(s) you've been working in- seriously. In the age of AI crutches (🙋‍♂️) I feel very humbled at the system you made from close-to-nothing, and I genuinely hope I can treat your work right.

(^ Goes to anyone else like [spatie](https://github.com/spatiebot) that might read this one day. I stand on the shoulders of giants.)

Next, I agree with [Nebulous Narwhal](https://github.com/wight-airmash/ab-server/pull/130) that updating to use a newer version of Node.js not only works but might be faster - I did some naive benchmarks in the past and recall better perf. on some dimensions. The patch definitely feels fragile though so I'd be more than happy to hear what you think about the weak points.

I'm more monkey-like when it comes to putting things together and you're clearly more experienced than me in a lot of ways, so I'd be up to talk dev-stuff if you're ever interested. I can and will gloss you more but I'll stop here.
</details>

My hope is that all this gives someone an idea of what to expect here.

</div>
</div>

-- swizzin / orca / garbagepatchkid / etcetc / [u/n_airmash](https://reddit.com/u/n_airmash/)
