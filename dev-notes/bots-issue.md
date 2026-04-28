# Bots Go Crazy

This is an issue where bots become stuck on the edge of the map + mountains, boosting forward non-stop.

## Manifestations

I've seen this in the following ways:

- On spawn, some or most bots will fly straight forward into the top of the map
- Flying in circles forever
- Bots get stuck flying into a mountain and don't corrrect
	- One bot has gotten stuck in the top right corner of the mountain maze in Greenland
- Seen one get stuck in the bottom left corner of the map

## Temporarily Resolving

This behavior can be reset/fixed not by restarting the bots but the server. Restarting the bots alone has no effect.

In fact, this led to all bots (besides the idle leader bot) to fly straight north on spawn, leading me to believe that this issue happened in the middle of the game for the bots to have such positions.

I'm leaving the server / bots as-is for now to see if the issue possibly resolves itself over time.

I should point out that I couldn't see any issues by flying around myself, and again that restarting the bots alone doesn't make any difference.

## Updates

After a little poking this is what I can add:

- I saw in the server logs that it was at 100, so I thought of lower the bots - nope, same. Also, raising it back to the orig / 8, I'm seeing the cpu in the 40s.
	- Looking at htop on the vps, the bots are for sure working hard to be going forward.
	- I'd like to understand though, why it takes restarting the server for the fix.

## Update Part 2

With all of the bots acting this way yesterday, I flew near the group of them on the other team in-game. When I shot near them they began to disperse to dodge it, at first flying in straight lines once they were no longer dodging and after they began to encounter / go near the other (still stuck) team then all the bots started acting more normal.

## Update Part 3

I believe that this doesn't happen all at once because of the various ways they get stuck. Joining this morning I could see that all the bots succumbed to this but only 2 or 3 were stuck on the map edge while several others were flying in circles.

I restarted the bots and predictably they all (but 1 that went idle at spawn) flew straight north only. I should note that when restarting, the bots join under different names, so I still feel stumped trying to understand why the server seems to be at the core of this seemingly bot-exclusive issue.

## Update Part 4

Just dropping in to mention that I'm looking at both teams of 8 bots following their respective leaders who are flying in circles - red near Greenland and blue in the middle east. For some reason blue has actually roamed back to red's base.

It's looking fairly clear that even without any glaring issues with the path-finding or something like that, that the main way to fix or possibly mitigate this issue is to consistently have a source or randomness or instigation.
