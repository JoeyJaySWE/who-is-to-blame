<p align="center">
  <img src="https://media.giphy.com/media/gLv5vBZCnbank4pfJe/giphy.gif" alt="She did it!" />
</p>

# Who's to blame?

Ready to put your friendship to the limit?
The Judge has summoned you and your colleagues due to a terrible crime taken place and it's time to blame someone.
The one who's found guilty will receive the death penalty while the others are free to leave.
Do your best to prove your innocence and push the blame on your friend, however,
if the judge catches you in a contradiction, or lie, the scales of justice may shift its
eyes to look at you instead.

In this game, you get access to evidence cards and blame cards that you can use to shift the blame to another person.
However, if you are taking the stand and got no more evidence card to back up your claims, or don't have any balme cards
on your hand, you will start to look more and more suspicious and the grim reaper gets closer and closer.

OBS! require 3rd party chat program of your choosing to handle conversations, or meet up IRL (the horror!)

<a href="https://trello.com/b/jIITfXiT/whos-to-blame" target="_blank">Roadmap</a>

<a href="https://www.figma.com/file/AS24qhmaGpnj5Vo77Xpedh/Who-s-To-Blame?node-id=0%3A1" target="_blank">Concept Arts</a>

<h2 id='rules'>The Rules</h2>
<p> 
In this game, you get access to evidence cards and blame cards that you can use to shift the blame to another person.
However, if you are taking the stand and got no more evidence card to back up your claims, or don't have any balme cards
on your hand, you will start to look more and more suspicious and the grim reaper gets closer and closer.
 
You find yourself standing in front of a corrupt and narcissistic person who’ll serve as your judge and executioner for a crime you did not commit. The Judge has explained that to find the guilty person he’ll be using a 3 strike system. Get three strikes, and you’re found guilty and will be executed.
 
<h3> Set Up </h3>
The first one to unter the site will be appointed the Judge,
The others will be referred to as user2 and user3. Make sure that the one that’s to play the Judge has connected fully before entering the page yourselves.
 
At the top of the screen in red you’ll find the indicator for who’s to take the stand (who’s turn it is). At the beginning no one has the stand, which allows you all to draw your evidence and blame cards by pressing the ‘Draw Cards’ button. The evidence card has a title, a description and an image. You are free to use either of the three sections to tell your testimony of what happened. 
The hands are your blame cards. A pointing finger is used together with an evidence card to shift the blame to your opponent.
An open hand is an OBJECTION card which you use to interrupt the testimony of another and throw 1 more evidence card to interrupt the person. The one on the stand has to adjust his story accordingly, and quickly or earn himself a strike from the Judge.
 
<h3> The Judge </h3>
The Judge is the God in this game. He can question any motive, add his own views as to what happened and doesn’t need blame or evidence cards to do so. He selects which player takes the stand by clicking on either ‘Player 2’ or ‘Player 3’ above the piles. In order to deliver a strike, he clicks the player underneath the piles. Where he’ll also be able to keep track of the number of strikes they’ve received.
 
<h4> The Strikes </h4>
The Judge can deliver strikes based on any of the reasons listed below:
<ul>
<li>Player can’t present a Pointing card (player needs to be honest)</li>
<li>Player can’t present any evidence cards (player needs to be honest)</li>
<li>Player is being too slow (taking more than 5-10 seconds, Judges whim)</li>
<li>Players testimony is boring to listen to</li>
<li>He feels the evidence isn’t good enough</li>
<li>If a player interrupts the flow of the game in any way (can still allow objections)</li>
<li>Just cause he feels like it.</li>
</ul>
 
<h3> The Rounds </h3>
The Judge begins by declaring what crime they are suspects of, then decides which player takes the stand first while all players draw their cards.

The player that takes the stands tells his story of innocence using the evidence cards he’s gotten from the pile. Answer the Judges question and finish by adding a pointing card and an evidence to shift that blame over to the other player.

Judge switches to the other player's turn.
The next player takes the stand and repeats the process. If the player who ain’t on the stand drops an objection card, he can add another piece of evidence to try and make holes in the accused testimony. However, he can’t draw any new cards until it’s his turn to take the stand.

Once it’s his turn again, he draws 1 new evidence card and 1 new blame card from the pile. And the process continues until a player receives 3 strikes and is executed.

</p>

# Installation

Add the installation instructions.

# Changelog

- [#1 - Add a link to each pull request with a descriptive line.](#1)

# Code Review

1. ```dealer.js``` is empty, remove if not needed

2. ```hostSetup.js:70-118``` should delete unused code

3. ```game.js:576``` the pointer parameter is not used, maybe remove it

4. ```game.js:654-659,721-726,753-758```should remove unused code

5. ```assets``` found it strange to have styles in assets folder. 

6. ```game.js``` the whole game in create() and all the functions. I would split up functions outside the game.

7. ```game.js:819``` update function is not being used so think about removing it or use it

8. ```game.js:173 & game.js:204``` you have declared sprite twice. Same with card. You seem to redeclare within sockets. Is this necessary?

9. ```game.js:765-768``` camel case is used everywhere in the code but here pascal case is being used instead, why?

10. ```game.js:718``` this variable is never used, maybe remove it

We couldn't test the game so make sure to add instructions for the installation.

# Testers

Tested by the following people:

1. Jane Doe
2. John Doe
3. Jane Doe
4. John Doe

Tested by the following muggles (non-coders):

1. Jane Doe
2. John Doe
3. Jane Doe
4. John Doe
