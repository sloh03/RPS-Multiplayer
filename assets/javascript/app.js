$(document).ready(function(){
        
    // SET UP DATABASE mission manor

    // Initialize Firebase
    var config = {
    apiKey: "AIzaSyDGwzf1VHh1VdTK2fRqBZrv0T29xGlYqfU",
    authDomain: "rps-multiplayer-271b8.firebaseapp.com",
    databaseURL: "https://rps-multiplayer-271b8.firebaseio.com",
    projectId: "rps-multiplayer-271b8",
    storageBucket: "",
    messagingSenderId: "701106460970"
    };
    firebase.initializeApp(config);

    // Assign reference to database to var 'database'
    var database = firebase.database();

    // Create objects for the 2 players
    var player1 = null;
    var player2 = null;

    // Set initial values for each player and turn
        // player
            // name
            // choice
            // wins
            // losses
        // turn = 0;

        var player1Name = "";
        var player2Name = "";

        var name = "";
        var choice = "";
        var wins = 0;
        var losses = 0;
        var turn = 0;
    
        var chat = '';

    
    // INITIAL PAGE SET UP
    // Diplay name form
    // In player-1 div, display 'Waiting for Player 1'
    // In player-2 div, display 'Waiting for Player 2'

    $('#player-greeting').hide();
    $('#player-turn-status').hide();
    $('#win-loss-status').hide();

    $('#player-1-stats').hide();   
    $('#player-2-stats').hide();  



    //GENERAL
    // If player1 disconnects, remove from database
    database.ref('/players/player1').onDisconnect().remove();

    // If player2 disconnects, remove from database
    database.ref('/players/player2').onDisconnect().remove();



    // At the initial load and subsequent value changes, get a snapshot of the stored data.
    // This function allows to update page in real-time when the firebase database changes.
    database.ref('players').on('value', function(snapshot) {

        // PLAYER 1
        // If player 1 exists in the database
        if (snapshot.child('player1').exists()) {

            // Get a snapshot of player 1 object
            player1 = snapshot.val().player1;
            player1Name = player1.name;

            // Update html
            $('#player-1-name').html('<h3>' + player1Name + '</h3>');
            $('#player-1-stats').show().html('Wins: ' + player1.wins + ' Losses: ' + player1.losses);  
        }
        // If player 1 does not exist in database

        // PLAYER 2
        // If player 2 exists in the database
        if (snapshot.child('player2').exists()) {

            // Get a snapshot of player 2 object
            player2 = snapshot.val().player2;
            player2Name = player2.name;

            // Update html to show player 2's name
            $('#player-2-name').html('<h3>' + player2Name + '</h3>');
            $('#player-2-stats').show().html('Wins: ' + player2.wins + ' Losses: ' + player2.losses);  
        }
        // If player 2 does not exist in database

        // If both present, signal player 1 turn
        if ( (player1 !== null) && (player2 !== null) ) {

            // Highlight player1 display
            $('#player-1-buttons').addClass('highlight');
            $('#player-2-buttons').removeClass('highlight');

            // Update turn status
            $('#player-turn-status').delay(2000).show(0).text('Status: Waiting for ' + player1Name + ' to choose.');
        }

        // NO PLAYERS
        if ( (player1 === null) && (player2 === null) ) {

            // Remove chat from database storage
            database.ref('chat').remove();

            // Clear chatbox display
            $('#chat-messages').empty();

            // Reset turns
            turn = 0;
            database.ref().child('/turn').set(0);


        }

    });

    // Highlight
    database.ref('turn').on('value', function(snapshot) {

        if (snapshot.val() === 2) {
            turn = 2;

                // Switch highlight
                $('#player-1-buttons').removeClass('highlight');
                $('#player-2-buttons').addClass('highlight');

                // Update turn status
                $('#player-turn-status').text('Status: Waiting for ' + player2Name + ' to choose.');
        }
    });

 

    // SETTING PLAYERS UP AND SAVING TO DATABASE
    // When the first player enters their name
        // hide name input form
        // show 'Hi _______. You are Player 1.'
        // save name as player 1 in database
        // hide 'Waiting for Player 1' in div id 'player-1'
        // For player 1 screen
            // show name, buttons, and win/loss count in div id 'player-1'
        // For player 2 screen
            // show name and win/loss count only in div id 'player-1'
    
    // When the second player enters their name
        // hide name input form
        // show 'Hi _______. You are Player 2.'
        // save name as player 2 in database
        // hide 'Waiting for Player 2' in div id 'player-2'
        // For player 1 screen
            // show name and win/loss count only in div id 'player-1'
        // For player 2 screen
            // show name, buttons, and win/loss count in div id 'player-1'

    // When 'Start' button clicked
    $("#add-player-btn").on("click", function(event){
        event.preventDefault();

        // If a name is entered when no players exist
        if ( ($('#player-name-input').val().trim() !== '') && (player1 === null) && (player2 === null) ) {

            // Set name to value entered
            playerName = $('#player-name-input').val().trim();
            console.log('Player 1 = ' + playerName);

            // Create object components for player 1
            player1 = {
                name: playerName,
                wins: 0,
                losses: 0,
                choice: ""
            };

            // Add player1 to database
            database.ref().child("/players/player1").set(player1);

            // Set turn value to 1 to indicate player 1 goes first
            database.ref().child('/turn').set(1);
            turn = 1;
            console.log(turn);

            // Hide name input
            $('#name-input').hide();

            // Update greeting
            $('#player-greeting').show().html('Hello ' + playerName + '. You are Player 1');

            // If player1 disconnects, remove from database
            database.ref('/players/player1').onDisconnect().remove();

        }

        // Else if a name is entered when player 1 exists
        else if ( ($('#player-name-input').val().trim() !== '') && (player1 !== null) && (player2 === null) ) {

            // Set name to value entered
            playerName = $('#player-name-input').val().trim();
            console.log('Player 2 = ' + playerName);

            // Create object components for player 2
            player2 = {
                name: playerName,
                wins: 0,
                losses: 0,
                choice: ""
            };

            // Add player2 to database
            database.ref().child("/players/player2").set(player2);

            // Set turn value to 1 to indicate player 1 goes first
            database.ref().child('/turn').set(1);
            turn = 1;
            console.log(turn);

            // Hide name input
            $('#name-input').hide();

            // Update greeting
            $('#player-greeting').show().html('Hello ' + playerName + '. You are Player 2');

            // If player2 disconnects, remove from database
            database.ref('/players/player2').onDisconnect().remove();
        }
        
        // Clear input field
        $('#player-name-input').val('');
        
    });



    // TURNS AND SCORING
    // At the beginning of a game
    // Highlight player 1 area
        // On player 1 screen
            // Display 'It's your turn' in #player-turn-status
            // Show choices 
        // On player 2 screen
            // Display 'Waiting for ___________(player 1 name) to choose.' in #player-turn-status
            // All choices hidden
    // When player 1 chooses rock, paper or scissors
        // Store in respective database
        // add 1 to var 'turn'
        // Highlight player 2 area
        // On player 1's screen
            // Hide choices
            // Show selected choice in big font
            // Display 'Waiting for ___________(player 2 name) to choose.' in #player-turn-status
        // On player 2 screen
            // Display 'It's your turn' in #player-turn-status
            // Show choices
    // When player 2 chooses rock, paper, or scissors
        // Store in respective database
        // add 1 to var 'turn'
        // On player 1 screen
            // Show choice selected for player 2
        // On player 2 screen
            // Hide choices
            // Show choices selected for both players 
    

    // Player 1: On click of a choice 
    $('#player-1-buttons').on('click', '.choice-btn1', function(event) {
        event.preventDefault();

        console.log($(this).val());
        console.log(playerName);
        console.log(player1.name);
        console.log(turn);

        // Get snapshot of turn
        database.ref('turn').on('value', function(snapshot) {

            // If turn = 1
            if (snapshot.val() === 1) {

                // Set var turn to 1
                turn = 1;
                console.log('Turn 1 ' + turn);

            }
        })

        // If name registered and is player 1's turn
        if ( (playerName === player1.name) && (turn === 1) ) {

            // Record player 1's choice value
            var choice = $(this).val();
            console.log('Player 1 choice: ' + choice);

            // Send to database
            var player1Choice = choice;
            database.ref().child('players/player1/choice').set(player1Choice);

            // Set turn to 2
            turn = 2;
            console.log('turn: ' + turn);
            database.ref().child('turn').set(turn);
        }
    });

    // Player 2: On click of a choice
    $('#player-2-buttons').on('click', '.choice-btn2', function(event) {
        event.preventDefault();

        console.log($(this).val());
        console.log(playerName);
        console.log(player2.name);
        console.log(turn);

        // Get snapshot of turn
        database.ref('turn').on('value', function(snapshot) {

            // If turn = 2
            if (snapshot.val() === 2) {

                // Set var turn to 2
                turn = 2;
                console.log('Turn 2 ' + turn);

            }
        })

        // If name registered and is player 2's turn
        if ( (playerName === player2.name) && (turn === 2) ) {

            // Record player 2's choice value
            var choice = $(this).val();
            console.log('Player 2 choice: ' + choice);

            // Send to database
            var player2Choice = choice;
            database.ref().child('players/player2/choice').set(player2Choice);

            // Call function to compare choices
            compareChoices();

        }
    });

    // Compare choices, update database and html
    function compareChoices() {

        // When player 1 chooses rock
        if ( (player1.choice === 'rock') && (player2.choice === 'rock') ) {
            console.log('Tie');
        }
        else if ( (player1.choice === 'rock') && (player2.choice === 'paper') ) {

            database.ref().child('players/player1/losses').set(player1.losses + 1);
            database.ref().child('players/player2/wins').set(player2.wins + 1);
            $('#player-turn-status').hide();
            $('#win-loss-status').show(0).text(player2Name + ' Wins!').delay(2000).hide(0);
        }
        else if ( (player1.choice === 'rock') && (player2.choice === 'scissors') ) {

            database.ref().child('players/player1/wins').set(player1.wins + 1);
            database.ref().child('players/player2/losses').set(player2.losses + 1);
        }

        // When player 1 chooses paper
        else if ( (player1.choice === 'paper') && (player2.choice === 'rock') ) {

            database.ref().child('players/player1/wins').set(player1.wins + 1);
            database.ref().child('players/player2/losses').set(player2.losses + 1);
        }
        else if ( (player1.choice === 'paper') && (player2.choice === 'paper') ) {
            console.log('Tie');
        }
        else if ( (player1.choice === 'paper') && (player2.choice === 'scissors') ) {

            database.ref().child('players/player1/losses').set(player1.losses + 1);
            database.ref().child('players/player2/wins').set(player2.wins + 1);
            $('#player-turn-status').hide();
            $('#win-loss-status').show(0).text(player2Name + ' Wins!').delay(2000).hide(0);
        }

        // When player 1 chooses scissors
        else if ( (player1.choice === 'scissors') && (player2.choice === 'rock') ) {

            database.ref().child('players/player1/losses').set(player1.losses + 1);
            database.ref().child('players/player2/wins').set(player2.wins + 1);
            $('#player-turn-status').hide();
            $('#win-loss-status').show(0).text(player2Name + ' Wins!').delay(2000).hide(0);
        }
        else if ( (player1.choice === 'scissors') && (player2.choice === 'paper') ) {

            database.ref().child('players/player1/wins').set(player1.wins + 1);
            database.ref().child('players/player2/losses').set(player2.losses + 1);
        }
        else if ( (player1.choice === 'scissors') && (player2.choice === 'scissors') ) {
            console.log('Tie');
        }

        // Set turn value back to 1
        turn = 1;
        database.ref().child('turn').set(turn);
    }


    // When turns = 2
        // Check player choices
            // If player 1 selects rock and player 2 selects rock
                // Display 'You tie!' in #win-loss-status
                // Restart game (reset choices)
            // Else if player 1 selects rock and 2 selects paper
                // Add 1 to player 1 losses
                // Add 1 to player 2 wins
                // Display '__________ (player 2 name) wins!' in #win-loss-status
                // Restart game (reset choices)
            // Else if player 1 selects rock and 2 selects scissors
                // Add 1 to player 1 wins
                // Add 1 to player 2 losses
                // Display '__________ (player 1 name) wins!' in #win-loss-status
                // Restart game (reset choices)

            // Else if player 1 selects paper and 2 selects rock
                // Add 1 to player 1 wins
                // Add 1 to player 2 losses
                // Display '__________ (player 1 name) wins!' in #win-loss-status
                // Restart game (reset choices)
            // Else if player 1 selects paper and 2 selects paper
                // Display 'You tie!' in #win-loss-status
                // Restart game (reset choices)
            // Else if player 1 selects paper and 2 selects scissors
                // Add 1 to player 1 losses
                // Add 1 to player 2 wins
                // Display '__________ (player 2 name) wins!' in #win-loss-status
                // Restart game (reset choices)

            // Else if player 1 selects scissors and 2 selects rock
                // Add 1 to player 1 losses
                // Add 1 to player 2 wins
                // Display '__________ (player 2 name) wins!' in #win-loss-status
                // Restart game (reset choices)
            // Else if player 1 selects scissors and 2 selects paper
                // Add 1 to player 1 wins
                // Add 1 to player 2 losses
                // Display '__________ (player 1 name) wins!' in #win-loss-status
                // Restart game (reset choices)
            // Else if player 1 selects scissors and 2 selects scissors
                // Display 'You tie!' in #win-loss-status
                // Restart game (reset choices)

    // RESTART FUNCTION
        // Hide selected choice
        // Show choices available and win/loss count
        // Clear center 'win-loss-status' display


    // WHEN A PLAYER LEAVES

    // CHAT
    // When 'Send' button clicked, add to database
    $('#send-message-btn').on('click', function(event) {
        event.preventDefault();

        // If message entered and player name exists
        if ( (playerName !== '') && ($('#chat-input').val().trim() !== '') ) {

            // Store message in var
            var message = playerName + ': ' + $('#chat-input').val().trim();

            // Clear input
            $('#chat-input').val('');

            // Get key for new chat entry
            database.ref().child('chat').push(message);

        }
    })

    // Display new messages to chatbox
    database.ref('chat').on('child_added', function(snapshot) {

        // Store retrieved message in var
        var newMessage = snapshot.val();
        // Create div to hold the message
        var chatEntry = $('<div>').html(newMessage);

        // Change color of message
        if (newMessage.startsWith(playerName)) {
            chatEntry.addClass('selfColor');
        }
        else {
            chatEntry.addClass('opponentColor');
        }

        // Add to chat display
        $('#chat-messages').append(chatEntry);

    })
});


