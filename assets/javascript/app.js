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

        var name = "";
        var choice = "";
        var wins = 0;
        var losses = 0;
        var turn = 0;


    // At the initial load and subsequent value changes, get a snapshot of the stored data.
    // This function allows you to update your page in real-time when the firebase database changes.
    // ?
    database.ref('players').on('value', function(snapshot) {

        // PLAYER 1
        // If player 1 exists in the database
        if (snapshot.child('player1').exists()) {

            // Get a snapshot of player 1 object
            player1 = snapshot.val().player1;
            var player1Name = player1.name;

            // Update html to show player 1's name
            $('#player-1-name').text(player1Name);
        }
        // If player 1 does not exist in database

        // PLAYER 2
        // If player 2 exists in the database
        if (snapshot.child('player2').exists()) {

            // Get a snapshot of player 2 object
            player1 = snapshot.val().player2;
            var player2Name = player2.name;

            // Update html to show player 2's name
            $('#player-2-name').text(player2Name);
        }
        // If player 2 does not exist in database
        
    });


    // INITIAL PAGE SET UP
    // Diplay name form
    // In player-1 div, display 'Waiting for Player 1'
    // In player-2 div, display 'Waiting for Player 2'

    $('#player-greeting').hide();
    


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

    $("#add-player-btn").on("click", function(event){
        event.preventDefault();

        // If a name is entered when no players exist
        if ( ($('#player-name-input').val().trim() !== '') && (player1 === null) && (player2 === null) ) {

            // Set name to value entered
            name = $('#player-name-input').val().trim();
            console.log('Player 1 = ' + name);

            // Create object components for player 1
            player1 = {
                name: name,
                wins: 0,
                losses: 0,
                choice: ""
            };

            // Add player1 to database
            database.ref().child("/players/player1").set(player1);

            // Set turn value to 1 to indicate player 1 goes first
            database.ref().child('/turn').set(1);

            // If player1 disconnects, remove from database
            database.ref('/players/player1').onDisconnect().remove();

        }

        // Else if a name is entered when player 1 exists
        else if ( ($('#player-name-input').val().trim() !== '') && (player1 !== null) && (player2 === null) ) {

            // Set name to value entered
            name = $('#player-name-input').val().trim();

            // Create object components for player 2
            player2 = {
                name: name,
                wins: 0,
                losses: 0,
                choice: ""
            };

            // Add player2 to database
            database.ref().child("/players/player2").set(player2);

            // If player1 disconnects, remove from database
            database.ref('/players/player2').onDisconnect().remove();
        }
        
        // Clear input field
        $('#player-name-input').val('');
        
    });

    // When the second player enters their name
        // hide name input form
        // show 'Hi _______. You are Player 2.'
        // save name as player 2 in database
        // hide 'Waiting for Player 2' in div id 'player-2'
        // For player 1 screen
            // show name and win/loss count only in div id 'player-1'
        // For player 2 screen
            // show name, buttons, and win/loss count in div id 'player-1'


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
});


// https://github.com/angrbrd/multiplayer-rps/blob/master/assets/js/app.js