$(document).ready(function(){
        
    // SET UP DATABASE
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

    // GLOBAL VAR
    // Create objects for the 2 players
    var player1 = null;
    var player2 = null;

    // Set initial values for each player and turn
    var player1Name = "";
    var player2Name = "";

    var name = "";
    var choice = "";
    var wins = 0;
    var losses = 0;
    var turn = 0;

    var chat = '';

    // INITIAL PAGE SET UP
    $('#player-greeting').hide();
    $('#player-turn-status').hide();
    $('#win-loss-status').hide();

    $('#player-1-stats').hide();   
    $('#player-2-stats').hide();  

    // ADD PLAYER
    // When 'Start' button clicked
    $("#name").on("click", function(event){
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

    // SET REAL-TIME UPDATES
    // At the initial load and subsequent value changes, get a snapshot of the stored data
    database.ref('players').on('value', function(snapshot) {

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
        // PLAYER 1
        if (snapshot.child('player1').exists()) {

            // Store name
            player1 = snapshot.val().player1;
            player1Name = player1.name;

            // Update html with name and stats
            $('#player-1-name').html('<h3>' + player1Name + '</h3>');
            $('#player-1-stats').show().html('Wins: ' + player1.wins + ' Losses: ' + player1.losses);  
        }

        // PLAYER 2
        if (snapshot.child('player2').exists()) {

            // Store name
            player2 = snapshot.val().player2;
            player2Name = player2.name;

            // Update html with name and stats
            $('#player-2-name').html('<h3>' + player2Name + '</h3>');
            $('#player-2-stats').show().html('Wins: ' + player2.wins + ' Losses: ' + player2.losses);  
        }

        // If both players present, signal player 1 turn
        if ( (player1 !== null) && (player2 !== null) ) {

            // Highlight player1 display
            $('#player-1-buttons').addClass('highlight');
            $('#player-2-buttons').removeClass('highlight');

            // Update turn status
            $('#player-turn-status').delay(1000).show(0).text('Status: Waiting for ' + player1Name + ' to choose.');
        }
    });

    // SWITCH TURNS
    // Switch to signal player 2 turn
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

    // PLAYER 1 TURN
    // On click of a choice 
    $('#player-1-buttons').on('click', '.choice-btn1', function(event) {
        event.preventDefault();
        console.log(playerName + ': ' + $(this).val());

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

    // PLAYER 2 TURN
    // On click of a choice
    $('#player-2-buttons').on('click', '.choice-btn2', function(event) {
        event.preventDefault();

        console.log(playerName + ': ' + $(this).val());

        // Get snapshot of turn
        database.ref('turn').on('value', function(snapshot) {

            // If turn = 2
            if (snapshot.val() === 2) {

                // Set var turn to 2
                turn = 2;
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

    // CHECK FOR WINNER
    // Compare choices, update database and html
    function compareChoices() {

        // When player 1 chooses rock
        if ( (player1.choice === 'rock') && (player2.choice === 'rock') ) {
            database.ref().child('outcome').set('You tied');
            console.log('Tie');
        }
        else if ( (player1.choice === 'rock') && (player2.choice === 'paper') ) {

            database.ref().child('players/player1/losses').set(player1.losses + 1);
            database.ref().child('players/player2/wins').set(player2.wins + 1);
            database.ref().child('outcome').set(player2Name + ' Wins!');

        }
        else if ( (player1.choice === 'rock') && (player2.choice === 'scissors') ) {

            database.ref().child('players/player1/wins').set(player1.wins + 1);
            database.ref().child('players/player2/losses').set(player2.losses + 1);
            database.ref().child('outcome').set(player1Name + ' Wins!');
        }

        // When player 1 chooses paper
        else if ( (player1.choice === 'paper') && (player2.choice === 'rock') ) { // This one not working

            database.ref().child('players/player1/wins').set(player1.wins + 1);
            database.ref().child('players/player2/losses').set(player2.losses + 1);
            database.ref().child('outcome').set(player1Name + ' Wins!');
        }
        else if ( (player1.choice === 'paper') && (player2.choice === 'paper') ) {
            database.ref().child('outcome').set('You tied');
            console.log('Tie');
        }
        else if ( (player1.choice === 'paper') && (player2.choice === 'scissors') ) {

            database.ref().child('players/player1/losses').set(player1.losses + 1);
            database.ref().child('players/player2/wins').set(player2.wins + 1);
            database.ref().child('outcome').set(player2Name + ' Wins!');
        }

        // When player 1 chooses scissors
        else if ( (player1.choice === 'scissors') && (player2.choice === 'rock') ) { // This one not working

            database.ref().child('players/player1/losses').set(player1.losses + 1);
            database.ref().child('players/player2/wins').set(player2.wins + 1);
            database.ref().child('outcome').set(player2Name + ' Wins!');
        }
        else if ( (player1.choice === 'scissors') && (player2.choice === 'paper') ) { // This one not working

            database.ref().child('players/player1/wins').set(player1.wins + 1);
            database.ref().child('players/player2/losses').set(player2.losses + 1);
            database.ref().child('outcome').set(player1Name + ' Wins!');
        }
        else if ( (player1.choice === 'scissors') && (player2.choice === 'scissors') ) {
            database.ref().child('outcome').set('You tied');
            console.log('Tie');
        }

        // Set turn value back to 1
        turn = 1;
        database.ref().child('turn').set(turn);
    }

    // DISPLAY GAME RESULT
    // At end of a round, display game outcome for 2 seconds
    database.ref('outcome').on('value', function(snapshot) {
        if (snapshot.val().exists()) {
            $('#win-loss-status').show(0).text(snapshot.val()).delay(2000).hide(0);
        }
        else {
            $('#win-loss-status').hide();
        }
    })

    // ON DISCONNECT
    // Clear database
    database.ref('/players/player1').onDisconnect().remove();
    database.ref('/players/player2').onDisconnect().remove();
    database.ref('outcome').onDisconnect().remove();

    // CHAT INPUT
    // When 'Send' button clicked, add to database
    $('#chat').on('submit', function(event) {
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

    // CHAT DISPLAY
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

        // Scroll to bottom of messages
        $('#chat-messages').stop().animate({ scrollTop: $('#chat-messages')[0].scrollHeight}, 1000);

    })
});


